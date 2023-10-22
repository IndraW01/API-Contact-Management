import { prismaClient } from "../application/database.js"
import { validation } from "../validation/validation.js"
import { contactCreateValidation, getContactValidation, searchContactValidation, updateContactValidation } from "../validation/contact-validation.js"
import { ResponseError } from "../error/response-error.js";

const create = async (user, request) => {
  const contact = validation(contactCreateValidation, request);
  contact.username = user.username;

  return prismaClient.contact.create({
    data: contact,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true
    }
  });
};

const get = async (user, contactId) => {
  contactId = validation(getContactValidation, contactId);

  const contact = await prismaClient.contact.findFirst({
    where: {
      username: user.username,
      id: contactId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true
    }
  });

  if (!contact) {
    throw new ResponseError(404, 'Contact is not found');
  }

  return contact;
}

const update = async (user, request) => {
  const contact = validation(updateContactValidation, request);

  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contact.id
    }
  })


  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, 'Contact is not found');
  }

  return prismaClient.contact.update({
    where: {
      id: contact.id
    },
    data: {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email, // jika tidak ada datanya, maka tidak akan dirubah
      phone: contact.phone,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true
    }
  });
}

const remove = async (user, contactId) => {
  contactId = validation(getContactValidation, contactId);

  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId
    }
  })

  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, 'Contact is not found');
  }

  return prismaClient.contact.delete({
    where: {
      id: contactId
    },
    select: {
      id: true
    }
  })
}

const search = async (user, request) => {
  request = validation(searchContactValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  // buat filters
  const filter = [];

  filter.push({
    username: user.username
  })

  if (request.name) {
    filter.push({
      OR: [
        {
          firstName: {
            contains: request.name
          }
        },
        {
          lastName: {
            contains: request.name
          }
        }
      ]
    })
  }
  if (request.email) {
    filter.push({
      email: {
        contains: request.email
      }
    })
  }
  if (request.phone) {
    filter.push({
      phone: {
        contains: request.phone
      }
    })
  }

  const contacts = await prismaClient.contact.findMany({
    where: {
      AND: filter
    },
    take: request.size,
    skip: skip
  });

  const totalItems = await prismaClient.contact.count({
    where: {
      AND: filter
    }
  });

  return {
    data: contacts,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    }
  }
};

export default {
  create,
  get,
  update,
  remove,
  search
}