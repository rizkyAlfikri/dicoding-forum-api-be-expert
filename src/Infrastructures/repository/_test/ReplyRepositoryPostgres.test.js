const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const DeleteReply = require("../../../Domains/replies/entities/DeleteReply");
const Reply = require("../../../Domains/replies/entities/Reply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe('ReplyRepositoryPostgres', () => {
    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
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
        await CommentsTableTestHelper.addComment({ content: 'Dicoding' });
    });


    describe('addReply method', () => {
        it('should persist and return added reply correctly', async () => {
            // arrange
            const reply = new Reply({
                content: 'Dicoding',
                owner: 'user-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
            });

            const fakeIdGenerator = () => '123';
            const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // action
            await replyRepository.addReply(reply);

            // assert
            const addedReply = await RepliesTableTestHelper.findReplyById('reply-123');
            expect(addedReply).toHaveLength(1);
        });

        it('should return added reply correctly', async () => {
            // arrange
            const reply = new Reply({
                content: 'Dicoding',
                owner: 'user-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
            });

            const fakeIdGenerator = () => '123';
            const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // action
            const addedReply = await replyRepository.addReply(reply);

            // assert
            expect(addedReply).toStrictEqual(new AddedReply({
                id: 'reply-123',
                content: 'Dicoding',
                owner: 'user-123',
            }));
        });
    });

    describe('getReplyByThreadIdAndCommentId method', () => {
        it('should persist and return reply detail correctly', async () => {
            // arrange
            await RepliesTableTestHelper.addReply({ id: 'reply-123' });
            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // action
            const replyDetails = await replyRepositoryPostgres.getReplyByThreadIdAndCommentId('thread-123', 'comment-123');

            // assert
            expect(replyDetails).toHaveLength(1);
        });

        it('should return array reply detail correctly', async () => {
            // arrange
            const expectedPayload = {
                id: 'reply-123',
                username: 'Dicoding',
                date: new Date().toISOString(),
                content: 'dicoding content',
            };

            await RepliesTableTestHelper.addReply({ id: 'reply-123' });
            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // action
            const replyDetails = await replyRepositoryPostgres.getReplyByThreadIdAndCommentId('thread-123', 'comment-123');

            // assert
            expect(replyDetails).toBeInstanceOf(Array);
            expect(replyDetails[0].id).toEqual(expectedPayload.id);
            expect(replyDetails[0].username).toEqual(expectedPayload.username);
            expect(replyDetails[0].content).toEqual(expectedPayload.content);
            expect(replyDetails[0].created_at).toEqual(expectedPayload.date);
        });
    });

    describe('deleteReply method', () => {
        it('should persist update is_delete property to true', async () => {
            // arrange
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyId = 'reply-123';

            await RepliesTableTestHelper.addReply({ id: replyId });
            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // action
            await replyRepositoryPostgres.deleteReply(replyId);

            // assert
            const reply = await RepliesTableTestHelper.findReplyById(replyId);
            expect(reply[0].id).toEqual(replyId);
            expect(reply[0].thread_id).toEqual(threadId);
            expect(reply[0].comment_id).toEqual(commentId);
            expect(reply[0].is_delete).toEqual(true);
        });

        it('should throw error when reply does not exist', async () => {
            // arrange
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // action and assert
            await expect(replyRepositoryPostgres.deleteReply(threadId, commentId)).rejects.toThrowError('REPLY_REPOSITORY_POSTGRES.REPLY_ID_DOES_NOT_EXIST');
        });
    });

    describe('verifyOwnerReply method', () => {
        it('should throw error when reply id does not exist ', async () => {
            // arrange
            const deleteReply = new DeleteReply({
                replyId: '123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            await RepliesTableTestHelper.addReply({ content: 'dicoding' });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // action and assert
            await expect(replyRepositoryPostgres.verifyOwnerReply(deleteReply)).rejects.toThrowError('REPLY_REPOSITORY_POSTGRES.REPLY_ID_DOES_NOT_EXIST')
        });

        it('should throw error when owner reply does not valid ', async () => {
            // arrange
            const deleteReply = new DeleteReply({
                replyId: 'reply-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-111',
            });

            await RepliesTableTestHelper.addReply({ content: 'dicoding' });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // action and assert
            await expect(replyRepositoryPostgres.verifyOwnerReply(deleteReply)).rejects.toThrowError('REPLY_REPOSITORY_POSTGRES.REPLY_OWNER_DOES_NOT_VALID');
        });


        it('should not throw error when reply owner is valid', async () => {
            // arrange
            const deleteReply = new DeleteReply({
                replyId: 'reply-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            await RepliesTableTestHelper.addReply({ content: 'dicoding' });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            // action and assert
            await expect(replyRepositoryPostgres.verifyOwnerReply(deleteReply)).resolves.not.toThrowError();
        });
    });

});