import supertest from "supertest";
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js";
import { createTestUser, removeTestUser, get, getTestUser } from "./test.util.js";
import bcrypt from "bcrypt";

describe('POST /api/users', () => {

  afterEach(async () => {
    await removeTestUser();
  });

  it('should can register new user', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: "test",
        password: "rahasia",
        name: "test"
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');
    expect(result.body.data.password).toBeUndefined;
  });

  it('should reject if request is invalid', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: "",
        password: "",
        name: ""
      });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if username already registered', async () => {
    let result = await supertest(web)
      .post('/api/users')
      .send({
        username: "test",
        password: "rahasia",
        name: "test"
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');
    expect(result.body.data.password).toBeUndefined;

    result = await supertest(web)
      .post('/api/users')
      .send({
        username: "test",
        password: "rahasia",
        name: "test"
      });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

});

describe('POST /api/users/login', () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should can login', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'test',
        password: 'rahasia'
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe('test');
  });

  it('should reject if request is invalid', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: '',
        password: '',
        allow: 'test'
      });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if password wrong', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'test',
        password: 'jamal',
      });

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe('Username or password wrong');
  });

  it('should reject if username wrong', async () => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: 'jamal',
        password: 'rahasia',
      });

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe('Username or password wrong');
  });

});

describe('GET /api/users/current', () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  })

  it('should can get current user', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.username).toBe('test');
  });

  it('should reject if header not set', async () => {
    const result = await supertest(web)
      .get('/api/users/current');

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe('Unauthorized');
  });

  it('should reject if token is invalid', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'invalid');

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
    expect(result.body.errors).toBe('Unauthorized');
  });

});

describe('PATCH /api/users/current', () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should can update user', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        name: "Indra",
        password: "password"
      })

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('Indra');

    const user = await getTestUser();
    expect(await bcrypt.compare('password', user.password)).toBe(true);
  });

  it('should can update user name', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        name: "Indra",
      })

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('Indra');

    const user = await getTestUser();
    expect(await bcrypt.compare('rahasia', user.password)).toBe(true);
  });

  it('should can update user password', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({
        password: "password",
      })

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');

    const user = await getTestUser();
    expect(await bcrypt.compare('password', user.password)).toBe(true);
  });

  it('should can update user empty request', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'test')
      .send({});

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('test');
    expect(result.body.data.name).toBe('test');

    const user = await getTestUser();
    expect(await bcrypt.compare('rahasia', user.password)).toBe(true);
  });

  it('should reject if request is not valid', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'salah')
      .send({});

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

});

describe('DELETE /api/users/logout', () => {

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should can logout user', async () => {
    const result = await supertest(web)
      .delete('/api/users/logout')
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBe('OK');

    const user = await getTestUser();

    logger.info(user);
    expect(user.token).toBeNull();
  });

  it('should reject logout if token is invalid', async () => {
    const result = await supertest(web)
      .delete('/api/users/logout')
      .set('Authorization', 'salah');

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

});