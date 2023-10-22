import { validation } from "../validation/validation.js"
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js"
import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid'

const register = async (request) => {
  const user = validation(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username
    }
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true
    }
  })
}

const login = async (request) => {
  const loginRequest = validation(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username
    },
    select: {
      username: true,
      password: true
    }
  });

  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or password wrong");
  }

  return prismaClient.user.update({
    data: {
      token: uuidv4().toString()
    },
    where: {
      username: user.username
    },
    select: {
      token: true
    }
  });
}

const get = async (username) => {
  username = validation(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username
    },
    select: {
      username: true,
      name: true
    }
  });

  if (!user) {
    throw new ResponseError(404, 'User is not found')
  }

  return user;
};

const update = async (request) => {
  const user = validation(updateUserValidation, request);

  const totalUserInDatabase = await prismaClient.user.count({
    where: {
      username: user.username
    }
  });

  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, 'User is not found');
  }

  const data = {};
  if (user.name) {
    data.name = user.name;
  }
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  return prismaClient.user.update({
    data: data,
    where: {
      username: user.username
    },
    select: {
      username: true,
      name: true
    }
  });
}

const logout = async (username) => {
  username = validation(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username
    }
  });

  if (!user) {
    throw new ResponseError(404, 'User is not found');
  }

  return prismaClient.user.update({
    where: {
      username: username
    },
    data: {
      token: null
    },
    select: {
      username: true
    }
  });
}

export default {
  register,
  login,
  get,
  update,
  logout
}