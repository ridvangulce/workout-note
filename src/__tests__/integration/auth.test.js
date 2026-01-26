const request = require('supertest');
const { app } = require('../../test-utils/helpers');

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test123!@'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('register');
      expect(res.body.register).toBeInstanceOf(Array);
      expect(res.body.register[0]).toHaveProperty('id');
      expect(res.body.register[0]).toHaveProperty('email', 'test@example.com');
    });

    it('should reject registration with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Test123!@'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'validation_failed');
      expect(res.body).toHaveProperty('details');
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details.some(d => d.field === 'email')).toBe(true);
    });

    it('should reject registration with weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'weak'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('validation_failed');
      expect(res.body.details.some(d => d.field === 'password')).toBe(true);
    });

    it('should reject duplicate email registration', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'First User',
          email: 'duplicate@example.com',
          password: 'Test123!@'
        });

      // Try to register with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second User',
          email: 'duplicate@example.com',
          password: 'Test123!@'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('already exist');
    });

    it('should reject registration with short name', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'A',
          email: 'test@example.com',
          password: 'Test123!@'
        });

      expect(res.status).toBe(400);
      expect(res.body.details.some(d => d.field === 'name')).toBe(true);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          email: 'login@example.com',
          password: 'Test123!@'
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Test123!@'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'login@example.com');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword123!@'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid credentials');
    });

    it('should reject login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!@'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Invalid credentials');
    });

    it('should reject login with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'Test123!@'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('validation_failed');
    });
  });
});
