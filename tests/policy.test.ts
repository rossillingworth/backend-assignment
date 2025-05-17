import request from 'supertest';
import express from 'express';
import policyRoutes from '../src/routes/policies';

const app = express();
app.use(express.json());
app.use('/policies', policyRoutes);

let policyId: string;

describe('Policies API', () => {
  it('GET /policies/:id returns policy with product', async () => {
    const res = await request(app).get('/policies/pol_001');
    expect(res.statusCode).toBe(200);
    expect(res.body.product).toBeDefined();
  });

  it('GET /policies?customerName=Alice returns policies', async () => {
    const res = await request(app).get('/policies?customerName=Alice');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    const policies = res.body;
    for (const policy of policies) {
      expect(policy.product).toBeDefined();
    }
  });

  it('POST /policies creates a policy (with API key)', async () => {
    const newPolicy = {
      productId: "prod_home",
      customerName: "Test User",
      startDate: "2025-01-01",
      endDate: "2026-01-01",
      premium: 123,
      status: "active"
    };
    const res = await request(app)
      .post('/policies')
      .set('x-api-key', 'my-secret-key')
      .send(newPolicy);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    // store policyId for later tests
    policyId = res.body.id;
  });

  it('POST /policies throws an error (with wrong API key)', async () => {
    const newPolicy = {};
    const res = await request(app)
      .post('/policies')
      .set('x-api-key', 'my-secret-key-is-wrong')
      .send(newPolicy);
    expect(res.statusCode).toBe(401);
  });

  it('POST /policies throws and error, unknown ProductId (with API key)', async () => {
    const newPolicy = {
      productId: "prod_unknown",
      customerName: "Test User",
      startDate: "2025-01-01",
      endDate: "2026-01-01",
      premium: 123,
      status: "active"
    };
    const res = await request(app)
      .post('/policies')
      .set('x-api-key', 'my-secret-key')
      .send(newPolicy);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe( 'Unable to create Policy, caused by: Product not found: id[prod_unknown]');
  });

  it('PUT /policies/:id updates policy', async () => {
    expect(policyId).toBeDefined();
    const res = await request(app)
      .put(`/policies/${policyId}`)
      .set('x-api-key', 'my-secret-key')
      .send({customerName: "Test User Updated"});
    expect(res.statusCode).toBe(200);
    expect(res.body.customerName).toBe("Test User Updated");
  })

  it('DELETE /policies/:id deletes policy', async () => {
    expect(policyId).toBeDefined();
    const res = await request(app)
      .delete(`/policies/${policyId}`)
      .set('x-api-key', 'my-secret-key')
      .send();
    expect(res.statusCode).toBe(204);
  })
});
