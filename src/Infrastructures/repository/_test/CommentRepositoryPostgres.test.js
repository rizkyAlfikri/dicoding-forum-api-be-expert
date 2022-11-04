const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const Comment = require('../../../Domains/comments/entities/Comment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const DeleteComment = require("../../../Domains/comments/entities/DeleteComment");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    })

    beforeEach(async () => {
        await UsersTableTestHelper.addUser({ username: 'Dicoding' });
        await ThreadsTableTestHelper.addThread({ title: 'Dicoding' });
    });


    describe('addComment method', () => {
        it('should persist and return added comment correctly', async () => {
            // arrange
            const comment = new Comment({
                content: 'Dicoding',
                owner: 'user-123',
                threadId: 'thread-123',
            });

            const fakeIdGenerator = () => '123';
            const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // action
            await commentRepository.addComment(comment);

            // assert
            const addedComment = await CommentsTableTestHelper.findCommentById('comment-123');
            expect(addedComment).toHaveLength(1);
        });

        it('should return added comment correctly', async () => {
            // arrange
            const comment = {
                content: 'Dicoding',
                owner: 'user-123',
                threadId: 'thread-123',
            };

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // action
            const addedComment = await commentRepositoryPostgres.addComment(comment);

            // assert
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: 'Dicoding',
                owner: 'user-123',
            }));
        });
    });

    describe('getCommentByThreadId method', () => {
        it('should persist and return comment detail correctly', async () => {
            // arrange
            await CommentsTableTestHelper.addComment('content 123');
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // action
            const commentDetails = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

            // assert
            expect(commentDetails).toHaveLength(1);
        });

        it('should return comment array detail correctly', async () => {
            // arrange
            const expectedPayload = {
                id: 'comment-123',
                username: 'Dicoding',
                date: new Date().toISOString(),
                content: 'dicoding content',
            };

            await CommentsTableTestHelper.addComment('content 123');
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // action
            const commentDetails = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

            // assert
            expect(commentDetails).toBeInstanceOf(Array);
            expect(commentDetails[0].id).toEqual(expectedPayload.id);
            expect(commentDetails[0].username).toEqual(expectedPayload.username);
            expect(commentDetails[0].content).toEqual(expectedPayload.content);
            expect(commentDetails[0].created_at).toEqual(expectedPayload.date);
        });
    });

    describe('deleteComment method', () => {
        it('should persist update is_delete property to true', async () => {
            // arrange
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await CommentsTableTestHelper.addComment({ id: commentId });

            // action
            await commentRepositoryPostgres.deleteComment(commentId);

            // assert
            const comment = await CommentsTableTestHelper.findCommentById(commentId);
            expect(comment[0].id).toEqual(commentId);
            expect(comment[0].thread_id).toEqual(threadId);
            expect(comment[0].is_delete).toEqual(true);
        });

        it('should throw error when comment does not exist', async () => {
            // arrange
            const commentId = 'comment-123';

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // action and assert
            await expect(commentRepositoryPostgres.deleteComment(commentId)).rejects.toThrowError('COMMENT_REPOSITORY_POSTGRES.COMMENT_ID_DOES_NOT_EXIST');
        });
    });

    describe('verifyOwnerComment method', () => {
        it('should throw error when owner comment does not exist ', async () => {
            // arrange
            const deleteComment = new DeleteComment({
                threadId: 'thread-123',
                commentId: '123',
                owner: 'user-111',
            });

            await CommentsTableTestHelper.addComment({ content: 'dicoding' });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // action and assert
            await expect(commentRepositoryPostgres.verifyOwnerComment(deleteComment)).rejects.toThrowError('COMMENT_REPOSITORY_POSTGRES.COMMENT_ID_DOES_NOT_EXIST')
        });

        it('should throw error when owner comment does not valid ', async () => {
            // arrange
            const deleteComment = new DeleteComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-111',
            });

            await CommentsTableTestHelper.addComment({ content: 'dicoding' });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // action and assert
            await expect(commentRepositoryPostgres.verifyOwnerComment(deleteComment)).rejects.toThrowError('COMMENT_REPOSITORY_POSTGRES.COMMENT_OWNER_DOES_NOT_VALID')
        });


        it('should not throw error when comment owner is valid', async () => {
            // arrange
            const deleteComment = new DeleteComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            await CommentsTableTestHelper.addComment({ content: 'dicoding' });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // action and assert
            await expect(commentRepositoryPostgres.verifyOwnerComment(deleteComment)).resolves.not.toThrowError();
        });
    });

    describe('verifyAvailableComment method', () => {
        it('should throw error when thread not exists', async () => {
            // arrange
            await CommentsTableTestHelper.addComment({ content: 'dicoding' });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // action and assert
            await expect(commentRepositoryPostgres.verifyAvailableComment('comment-000')).rejects.toThrowError('COMMENT_REPOSITORY_POSTGRES.COMMENT_ID_DOES_NOT_EXIST')
        });

        it('should return id when querying with exist thread', async () => {
            // arrange
            const commentId = 'comment-123';
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await CommentsTableTestHelper.addComment({ id: commentId });

            // action and assert
            await expect(commentRepositoryPostgres.verifyAvailableComment(commentId)).resolves.not.toThrowError();
        });
    });
});