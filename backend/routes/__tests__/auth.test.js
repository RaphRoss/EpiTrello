const request = require('supertest');
const express = require('express');
const crypto = require('crypto');
const authRouter = require('../auth');

// Mock the database connection
jest.mock('../../db', () => ({
    pool: {
        query: jest.fn()
    }
}));

const { pool } = require('../../db');

// Create a test Express app
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

// Helper to hash password like the real code does
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

describe('Auth API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        test('should register a new user successfully', async () => {
            const newUser = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            const mockUser = {
                id: 1,
                name: 'testuser',
                email: 'test@example.com'
            };

            // Mock: vérifier que l'email n'existe pas
            pool.query.mockResolvedValueOnce({ rows: [] });
            // Mock: insérer le nouvel utilisateur
            pool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const response = await request(app)
                .post('/api/auth/register')
                .send(newUser)
                .expect(201);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('username', 'testuser');
            expect(response.body.user).toHaveProperty('email', 'test@example.com');
            expect(response.body.user).not.toHaveProperty('password');
        });

        test('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser' })
                .expect(400);

            expect(response.body).toHaveProperty('error', 'All fields are required');
        });

        test('should return 409 if user already exists', async () => {
            const existingUser = {
                id: 1,
                name: 'testuser',
                email: 'test@example.com',
                password: 'hashedpassword'
            };

            // Mock: l'email existe déjà
            pool.query.mockResolvedValueOnce({ rows: [existingUser] });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                })
                .expect(409);

            expect(response.body).toHaveProperty('error', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        test('should login successfully with valid credentials', async () => {
            const mockUser = {
                id: 1,
                name: 'testuser',
                email: 'test@example.com',
                password: hashPassword('password123')
            };

            // Mock: trouver l'utilisateur par email
            pool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                })
                .expect(200);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('username', 'testuser');
            expect(response.body.user).not.toHaveProperty('password');
        });

        test('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com' })
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Email and password are required');
        });

        test('should return 401 with invalid email', async () => {
            // Mock: utilisateur non trouvé
            pool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'password123'
                })
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });

        test('should return 401 with invalid password', async () => {
            const mockUser = {
                id: 1,
                name: 'testuser',
                email: 'test@example.com',
                password: hashPassword('password123')
            };

            // Mock: trouver l'utilisateur mais mot de passe incorrect
            pool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                })
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });
    });

    describe('GET /api/auth/me', () => {
        test('should return user info with valid token', async () => {
            const mockUser = {
                id: 123,
                name: 'testuser',
                email: 'test@example.com'
            };

            // Mock: trouver l'utilisateur par ID
            pool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const token = 'sometoken-123';

            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body).toHaveProperty('username', 'testuser');
            expect(response.body).toHaveProperty('email', 'test@example.com');
            expect(response.body).not.toHaveProperty('password');
        });

        test('should return 401 if no token provided', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .expect(401);

            expect(response.body).toHaveProperty('error', 'No token provided');
        });

        test('should return 401 if token is invalid', async () => {
            // Mock: utilisateur non trouvé
            pool.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalidtoken-999')
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Invalid token');
        });
    });

    describe('Security', () => {
        test('should not return password in response', async () => {
            const mockUser = {
                id: 1,
                name: 'testuser',
                email: 'test@example.com'
            };

            // Mock: email n'existe pas
            pool.query.mockResolvedValueOnce({ rows: [] });
            // Mock: insertion réussie
            pool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                })
                .expect(201);

            expect(response.body.user).not.toHaveProperty('password');
        });
    });
});
