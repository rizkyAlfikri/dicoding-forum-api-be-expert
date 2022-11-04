const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('/comment endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
    });

    beforeEach(async () => {
        await UsersTableTestHelper.addUser({ username: 'Dicoding' });
    });

    const stubRegisterUser = async (server) => {
        await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
            },
        });
    };

    const stubUserLogin = async (server) => {
        const response = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: {
                username: 'dicoding',
                password: 'secret',
            },
        });
        const responseJson = JSON.parse(response.payload);

        return responseJson.data.accessToken;
    }

    const stubAddThread = async (server, accessToken, title = 'dicoding') => {
        const requestPayload = {
            title: title,
            body: 'Backend learning path',
        };

        await server.inject({
            method: 'POST',
            url: '/threads',
            payload: requestPayload,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    const stubAddComment = async (server, accessToken, threadId) => {
        await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            payload: {
                content: 'dicoding',
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });
    }

    const stubAddReply = async (server, accessToken, threadId, commentId) => {
        await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments/${commentId}/replies`,
            payload: {
                content: 'dicoding',
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });
    }

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 201 and persisted reply', async () => {
            // arrange 
            const requestPayload = {
                content: 'Dicoding',
            };

            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await ThreadsTableTestHelper.addThread({ title: 'dicoding' });
            await CommentsTableTestHelper.addComment({ content: 'dicoding' });
            const threadId = "thread-123";
            const commentId = "comment-123";

            // action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // arrange
            const requestPayload = {};

            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')


            // action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat balasan karena property yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type spesification', async () => {
            // arrange
            const requestPayload = {
                content: false,
            };

            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')

            // action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat balasan karena property yang dibutuhkan tidak ada')
        });

        it('should response 401 when request not passing access token', async () => {
            // arrange
            const requestPayload = {
                content: 'Dicoding'
            };

            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')

            // action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
            });

            // assert
            expect(response.statusCode).toEqual(401);
        });

        it('should response 404 when request at no valid thread / not exist', async () => {
            // arrange
            const requestPayload = {
                content: 'Dicoding',
            };
            const falseThreadId = 'thread-234';

            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')

            // action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${falseThreadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // assert
            expect(response.statusCode).toEqual(404);
        });

        it('should response 404 when request at no valid comment / not exist', async () => {
            // arrange
            const requestPayload = {
                content: 'Dicoding',
            };
            const falseCommentId = 'comment-234';

            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);

            // action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${falseCommentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // assert
            expect(response.statusCode).toEqual(404);
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response 200', async () => {
            // arrange
            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')
            await stubAddReply(server, accessToken, threadId, commentId);
            const replyId = await RepliesTableTestHelper.getReplyIdByContent('dicoding');

            // action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 401 when request not passing access token', async () => {
            // arrange
            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')
            await stubAddReply(server, accessToken, threadId, commentId);
            const replyId = await RepliesTableTestHelper.getReplyIdByContent('dicoding');

            // action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
            });

            // assert
            expect(response.statusCode).toEqual(401);
        });

        it('should response 403 when delete reply by not owner reply', async () => {
            // arrange
            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')

            const replyId = "reply-123"
            await RepliesTableTestHelper.addReply({ id: replyId, threadId: threadId, commentId: commentId, owner: 'user-123' });

            // action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // assert
            expect(response.statusCode).toEqual(403);
        });

        it('should response 404 when delete not valid comment', async () => {
            // arrange
            const invalidCommentId = "comment-222";
            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')
            await stubAddReply(server, accessToken, threadId, commentId);
            const replyId = await RepliesTableTestHelper.getReplyIdByContent('dicoding');

            // action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${invalidCommentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // assert
            expect(response.statusCode).toEqual(404);
        });

        it('should response 404 when delete not valid thread', async () => {
            // arrange
            const invalidThreadId = "thread-222";
            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')
            await stubAddReply(server, accessToken, threadId, commentId);
            const replyId = await RepliesTableTestHelper.getReplyIdByContent('dicoding');

            // action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${invalidThreadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // assert
            expect(response.statusCode).toEqual(404);
        });

        it('should response 404 when delete not valid reply', async () => {
            // arrange
            const invalidReplyId = "thread-222";
            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')
            await stubAddReply(server, accessToken, threadId, commentId);
       
            // action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${invalidReplyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            // assert
            expect(response.statusCode).toEqual(404);
        });
    });
});