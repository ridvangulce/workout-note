const request = require('supertest');
const app = require('../app');

/**
 * Helper to create a test user and get authentication token
 * @returns {Promise<{user: Object, token: string}>}
 */
async function createAuthenticatedUser(userData = {}) {
  const defaultUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'Test123!@'
  };

  const user = { ...defaultUser, ...userData };

  // Register user
  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send(user);

  if (registerResponse.status !== 201) {
    throw new Error(`Failed to create user: ${JSON.stringify(registerResponse.body)}`);
  }

  // Login to get token
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: user.email,
      password: user.password
    });

  if (loginResponse.status !== 200) {
    throw new Error(`Failed to login: ${JSON.stringify(loginResponse.body)}`);
  }

  return {
    user: loginResponse.body.user,
    token: loginResponse.body.accessToken
  };
}

/**
 * Helper to make authenticated requests
 * @param {string} token - JWT token
 * @returns {object} Request object with Authorization header
 */
function authenticatedRequest(token) {
  return {
    get: (url) => request(app).get(url).set('Authorization', `Bearer ${token}`),
    post: (url) => request(app).post(url).set('Authorization', `Bearer ${token}`),
    put: (url) => request(app).put(url).set('Authorization', `Bearer ${token}`),
    delete: (url) => request(app).delete(url).set('Authorization', `Bearer ${token}`)
  };
}

module.exports = {
  createAuthenticatedUser,
  authenticatedRequest,
  app
};
