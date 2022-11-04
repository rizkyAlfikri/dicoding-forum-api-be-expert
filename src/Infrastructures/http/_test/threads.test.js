const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('/thread endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
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

    describe('when POST / thread', () => {
        it('should response 201 and persisted thread', async () => {
            // arrange
            const requestPayload = {
                title: 'Dicoding',
                body: 'Backend learning path',
            };

            // eslint-disable-next-line no-undef
            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);

            // action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // arrange
            const requestPayload = {
                title: 'Dicoding',
            };

            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);

            // action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread karena property yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type spesification', async () => {
            // arrange
            const requestPayload = {
                title: 'Dicoding',
                body: true,
            };

            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);

            // action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
        });

        it('should response 401 when request not passing access token', async () => {
            // arrange
            const requestPayload = {
                title: 'Dicoding',
                body: 'Backend Learning Path',
            };

            const server = await createServer(container);
            await stubRegisterUser(server);

            // action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            // assert
            expect(response.statusCode).toEqual(401);
        });
    });

    describe('when GET /thread/{threadId}', () => {
        it('should response 200 and presisted thread detail', async () => {
            // arrange
            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
            const commentId = await CommentsTableTestHelper.getCommentIdByContent('dicoding')

            // action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });
            
            // assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread.id).toEqual(threadId);
            expect(responseJson.data.thread.comments[0].id).toEqual(commentId);
        });

        it('should response 404 when request get thread with not valid threadId', async () => {
            // arrange
            const server = await createServer(container);
            await stubRegisterUser(server);
            const accessToken = await stubUserLogin(server);
            await stubAddThread(server, accessToken);
            const threadId = await ThreadsTableTestHelper.getThreadIdByTitle('dicoding');
            await stubAddComment(server, accessToken, threadId);
           
            // action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/thead123`,
            });

            // assert
            expect(response.statusCode).toEqual(404);
        });
    });
});