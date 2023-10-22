import supertest from "supertest";
import { web } from "../src/application/web.js"
import { createManyTestAddress, createTestAddress, createTestContact, createTestUser, getTestAddress, getTestContact, removeAllTestAddress, removeAllTestContact, removeTestUser } from "./test.util.js";
import { logger } from "../src/application/logging.js";

describe('POST /api/contacts/:contactId/addresses', () => {

  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestAddress();
    await removeAllTestContact();
    await removeTestUser();
  });

  it('should can create new address', async () => {
    const contact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set('Authorization', 'test')
      .send({
        street: "Jalan BPP",
        city: "Samarinda",
        province: "Kaltim",
        country: "Indonesia",
        postalCode: "7821"
      });

    const address = await getTestAddress();

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(address.id);
    expect(result.body.data.street).toBe('Jalan BPP');
    expect(result.body.data.city).toBe('Samarinda');
    expect(result.body.data.province).toBe('Kaltim');
    expect(result.body.data.country).toBe('Indonesia');
    expect(result.body.data.postalCode).toBe('7821');
  });

  it('should reject if address request is invalid', async () => {
    const contact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set('Authorization', 'test')
      .send({
        street: "",
        city: "Samarinda",
        province: "Kaltim",
        postalCode: ""
      });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if contact id not found', async () => {
    const contact = await getTestContact();

    const result = await supertest(web)
      .post(`/api/contacts/${contact.id + 1}/addresses`)
      .set('Authorization', 'test')
      .send({
        street: "",
        city: "Samarinda",
        province: "Kaltim",
        postalCode: ""
      });

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddress();
    await removeAllTestContact();
    await removeTestUser();
  });

  it('should can get address', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(address.id);
    expect(result.body.data.street).toBe('jalan test');
    expect(result.body.data.city).toBe('kota test');
    expect(result.body.data.province).toBe('provinsi test');
    expect(result.body.data.country).toBe('negara test');
    expect(result.body.data.postalCode).toBe('234234');
  });

  it('should reject if contact id is not found', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if address id is not found', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddress();
    await removeAllTestContact();
    await removeTestUser();
  });

  it('should can update address', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('Authorization', 'test')
      .send({
        street: "Jalan BPP",
        city: "Samarinda",
        // province: "Kaltim",
        country: "Indonesia",
        postalCode: "7821"
      })

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(address.id);
    expect(result.body.data.street).toBe('Jalan BPP');
    expect(result.body.data.city).toBe('Samarinda');
    expect(result.body.data.province).toBe('provinsi test');
    expect(result.body.data.country).toBe('Indonesia');
    expect(result.body.data.postalCode).toBe('7821');
  });

  it('should reject if address request is invalid', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('Authorization', 'test')
      .send({
        street: "Jalan BPP",
        city: "Samarinda",
        province: "Kaltim",
        country: "",
        postalCode: ""
      })

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if address id is not found', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set('Authorization', 'test')
      .send({
        street: "Jalan BPP",
        city: "Samarinda",
        province: "Kaltim",
        country: "Indonesia",
        postalCode: "75277"
      })

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if country id is not found', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set('Authorization', 'test')
      .send({
        street: "Jalan BPP",
        city: "Samarinda",
        province: "Kaltim",
        country: "Indonesia",
        postalCode: "75277"
      })

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddress();
    await removeAllTestContact();
    await removeTestUser();
  });

  it('should can remove address', async () => {
    const contact = await getTestContact();
    let address = await getTestAddress();

    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBe('OK');

    address = await getTestAddress();

    logger.info(address);
    expect(address).toBeNull();
  });

  it('should reject if contact id is not found', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject if address id is not found', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe('GET /api/contacts/:contactId/addresses', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createManyTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddress();
    await removeAllTestContact();
    await removeTestUser();
  });

  it('should can get list address', async () => {
    const contact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses`)
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(15);
  });

  it('should reject if contact id is not found', async () => {
    const contact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}/addresses`)
      .set('Authorization', 'test');

    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});