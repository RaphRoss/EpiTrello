const request = require('supertest');
const express = require('express');
const commentRoutes = require('../comments');
const { pool } = require('../../db');

const app = express();
app.use(express.json());
app.use('/api/comments', commentRoutes);

// Mock the database pool
jest.mock('../../db', () => ({
    pool: {
        query: jest.fn()
    }
}));

describe('Comments API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/comments/card/:cardId', () => {
        it('should get all comments for a card', async () => {
            const mockComments = [
                {
                    id: 1,
                    card_id: 1,
                    user_id: 1,
                    content: 'Test comment',
                    user_name: 'John Doe',
                    user_email: 'john@example.com',
                    created_at: new Date()
                }
            ];

            pool.query.mockResolvedValue({ rows: mockComments });

            const response = await request(app)
                .get('/api/comments/card/1')
                .expect(200);

            expect(response.body).toMatchObject(
                mockComments.map(c => ({
                    ...c,
                    created_at: expect.any(String)
                }))
            );
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT c.*, u.name as user_name'),
                ['1']
            );
        });

        it('should handle database errors', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/api/comments/card/1')
                .expect(500);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /api/comments', () => {
        it('should create a new comment', async () => {
            const newComment = {
                cardId: 1,
                userId: 1,
                content: 'New test comment'
            };

            const mockCreatedComment = {
                id: 1,
                card_id: 1,
                user_id: 1,
                content: 'New test comment',
                created_at: new Date()
            };

            const mockUser = {
                name: 'John Doe',
                email: 'john@example.com'
            };

            // Mock comment creation
            pool.query
                .mockResolvedValueOnce({ rows: [mockCreatedComment] }) // INSERT comment
                .mockResolvedValueOnce({ rows: [] }) // INSERT activity log
                .mockResolvedValueOnce({ rows: [mockUser] }); // SELECT user

            const response = await request(app)
                .post('/api/comments')
                .send(newComment)
                .expect(201);

            expect(response.body).toMatchObject({
                id: 1,
                card_id: 1,
                user_id: 1,
                content: 'New test comment',
                user_name: 'John Doe',
                user_email: 'john@example.com'
            });
        });

        it('should create comment without userId', async () => {
            const newComment = {
                cardId: 1,
                content: 'Anonymous comment'
            };

            const mockCreatedComment = {
                id: 2,
                card_id: 1,
                user_id: null,
                content: 'Anonymous comment',
                created_at: new Date()
            };

            pool.query
                .mockResolvedValueOnce({ rows: [mockCreatedComment] }) // INSERT comment
                .mockResolvedValueOnce({ rows: [] }); // INSERT activity log

            const response = await request(app)
                .post('/api/comments')
                .send(newComment)
                .expect(201);

            expect(response.body).toMatchObject({
                card_id: 1,
                user_id: null,
                content: 'Anonymous comment'
            });
        });
    });

    describe('PUT /api/comments/:id', () => {
        it('should update a comment', async () => {
            const updatedComment = {
                content: 'Updated comment content'
            };

            const mockUpdatedComment = {
                id: 1,
                card_id: 1,
                user_id: 1,
                content: 'Updated comment content',
                created_at: new Date()
            };

            pool.query.mockResolvedValue({ rows: [mockUpdatedComment] });

            const response = await request(app)
                .put('/api/comments/1')
                .send(updatedComment)
                .expect(200);

            expect(response.body).toMatchObject({
                id: mockUpdatedComment.id,
                card_id: mockUpdatedComment.card_id,
                user_id: mockUpdatedComment.user_id,
                content: mockUpdatedComment.content,
                created_at: expect.any(String)
            });
        });

        it('should return 404 if comment not found', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const response = await request(app)
                .put('/api/comments/999')
                .send({ content: 'Updated content' })
                .expect(404);

            expect(response.body).toHaveProperty('error', 'Comment not found');
        });
    });

    describe('DELETE /api/comments/:id', () => {
        it('should delete a comment', async () => {
            pool.query.mockResolvedValue({ rows: [{ card_id: 1 }] });

            await request(app)
                .delete('/api/comments/1')
                .expect(204);

            expect(pool.query).toHaveBeenCalledWith(
                'DELETE FROM comments WHERE id = $1 RETURNING card_id',
                ['1']
            );
        });

        it('should return 404 if comment not found', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const response = await request(app)
                .delete('/api/comments/999')
                .expect(404);

            expect(response.body).toHaveProperty('error', 'Comment not found');
        });
    });
});
