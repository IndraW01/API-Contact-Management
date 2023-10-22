import { web } from "../src/application/web.js"
import supertest from "supertest";
import { createManyTestContact, createTestContact, createTestUser, getTestContact, removeAllTestContact, removeTestUser } from "./test.util.js";
import { logger } from "../src/application/logging.js";
import { log } from "winston";

describe('POST /api/contacts', () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContact()
    await removeTestUser();
  });

  it('should can create new contact', async () => {
    const result = await supertest(web)
      .post('/api/contacts')
      .set('Authorization', 'test')
      .send({
        firstName: 'test',
        lastName: 'test',
        email: 'test@gmail.com',
        phone: '085821559461'
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.firstName).toBe('test');
    expect(result.body.data.lastName).toBe('test');
    expect(result.body.data.email).toBe('test@gmail.com');
    expect(result.body.data.phone).toBe('085821559461');
  });

  it('should reject if request is not valid', async () => {
    const result = await supertest(web)
      .post('/api/contacts')
      .set('Authorization', 'test')
      .send({
        firstName: '',
        lastName: 'test',
        email: 'test',
        phone: '0858234632462346327463246238462374623462462461559461'
      });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

});

describe('GET /api/contacts/:contactId', () => {

  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it('should can get contact', async () => {
    const contact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${contact.id}`)
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(contact.id);
    expect(result.body.data.firstName).toBe('test');
    expect(result.body.data.lastName).toBe('test');
    expect(result.body.data.email).toBe('test@gmail.com');
    expect(result.body.data.phone).toBe('085821559461');
  });

  it('should return 404 if contact id is not found', async () => {
    const result = await supertest(web)
      .get(`/api/contacts/100`)
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe('Contact is not found');
  });

});

describe('PUT /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it('should can update contact', async () => {
    const contact = await getTestContact();

    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .set('Authorization', 'test')
      .send({
        firstName: 'Jamal',
        lastName: 'Ganteng',
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(contact.id);
    expect(result.body.data.firstName).toBe('Jamal');
    expect(result.body.data.lastName).toBe('Ganteng');
    expect(result.body.data.email).toBe('test@gmail.com');
    expect(result.body.data.phone).toBe('085821559461');
  });

  it('should reject if request is invalid', async () => {
    const contact = await getTestContact();

    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .set('Authorization', 'test')
      .send({
        firstName: '',
        lastName: '',
        email: 'jamal',
        phone: '',
      });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if contact id is not found', async () => {
    const result = await supertest(web)
      .put(`/api/contacts/100`)
      .set('Authorization', 'test')
      .send({
        firstName: 'Jamal',
        lastName: 'Ganteng',
        email: 'jamal@gmail.com',
        phone: '085812121212',
      });

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe('DELETE /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it('should can remove contact', async () => {
    let contact = await getTestContact();

    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id}`)
      .set('Authorization', 'test')

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBe('OK');

    contact = await getTestContact();

    logger.info(contact);
    expect(contact).toBeNull();
  });

  it('should reject if contact id is not found', async () => {
    const result = await supertest(web)
      .delete(`/api/contacts/100`)
      .set('Authorization', 'test')

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/contacts', () => {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it('should can search without parameter', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it('should can search page 2', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .query({
        page: 2
      })
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it('should can search using name', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .query({
        name: 'test 1'
      })
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it('should can search using name and phone', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .query({
        name: 'test 1',
        phone: '085821559461',
      })
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it('should can search using name and phone and page', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .query({
        name: 'test 1',
        phone: '085821559461',
        page: 2
      })
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(0);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
});