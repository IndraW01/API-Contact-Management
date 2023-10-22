import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = () => {
  return prismaClient.user.deleteMany({
    where: {
      username: 'test'
    }
  });
}

export const createTestUser = async () => {
  const passwordBcrypt = await bcrypt.hash('rahasia', 10);

  return prismaClient.user.create({
    data: {
      username: 'test',
      password: passwordBcrypt,
      name: 'test',
      token: 'test'
    }
  });
}

export const getTestUser = () => {
  return prismaClient.user.findUnique({
    where: {
      username: 'test'
    }
  });
}

export const removeAllTestContact = () => {
  return prismaClient.contact.deleteMany({
    where: {
      username: 'test'
    }
  });
}

export const createTestContact = () => {
  return prismaClient.contact.create({
    data: {
      firstName: 'test',
      lastName: 'test',
      email: 'test@gmail.com',
      phone: '085821559461',
      username: 'test'
    }
  });
}

export const createManyTestContact = async () => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.contact.create({
      data: {
        firstName: `test ${i}`,
        lastName: `test ${i}`,
        email: `test${i}@gmail.com`,
        phone: `08582155946${i}`,
        username: `test`
      }
    });
  }
}

export const getTestContact = () => {
  return prismaClient.contact.findFirst({
    where: {
      username: 'test'
    }
  })
}

export const createTestAddress = async () => {
  const contact = await getTestContact();

  return prismaClient.address.create({
    data: {
      street: "jalan test",
      city: "kota test",
      province: "provinsi test",
      country: "negara test",
      postalCode: "234234",
      contactId: contact.id
    }
  })
}

export const createManyTestAddress = async () => {
  const contact = await getTestContact();

  for (let i = 0; i < 15; i++) {
    await prismaClient.address.create({
      data: {
        street: `jalan test ${i}`,
        city: `kota test ${i}`,
        province: `provinsi test ${i}`,
        country: `negara test ${i}`,
        postalCode: `234234${i}`,
        contactId: contact.id
      }
    });
  }
}

export const removeAllTestAddress = () => {
  return prismaClient.address.deleteMany({
    where: {
      contact: {
        username: 'test'
      }
    }
  });
}

export const getTestAddress = async () => {
  const contact = await getTestContact();

  return prismaClient.address.findFirst({
    where: {
      contactId: contact.id
    }
  });
}