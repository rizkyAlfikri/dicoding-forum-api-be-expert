const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const Thread = require("../../../Domains/threads/entities/Thread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    beforeEach(async () => {
        await UsersTableTestHelper.addUser({ username: 'Dicoding' });
    });


    describe('addThread function', () => {
        it('should persist thread and return added thread correctly', async () => {
            // arrange
            const thread = new Thread({
                title: 'Dicoding',
                body: 'Backend Learning Path',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // action
            await threadRepositoryPostgres.addThread(thread);

            // assert
            const addedThread = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(addedThread).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // arrange
            const thread = new Thread({
                title: 'Dicoding',
                body: 'Backend Learning Path',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // action
            const addedThread = await threadRepositoryPostgres.addThread(thread);

            // assert
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: 'Dicoding',
                owner: 'user-123',
            }));
        });
    });

    describe('getThreadById method', () => {
        it('should persist thread and return thread detail correctly', async () => {
            // arrange
            const expectedPayload = {
                id: 'thread-123',
                title: 'Dicoding',
                body: 'dicoding content',
                date: new Date().toISOString(),
                username: 'Dicoding',
                comments: [],
            };

            await ThreadsTableTestHelper.addThread({ title: 'Dicoding' });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // action
            const threadDetail = await threadRepositoryPostgres.getThreadById('thread-123');

            // assert
            expect(threadDetail.id).toEqual(expectedPayload.id);
            expect(threadDetail.title).toEqual(expectedPayload.title);
            expect(threadDetail.body).toEqual(expectedPayload.body);
            expect(threadDetail.date).toEqual(expectedPayload.date);
            expect(threadDetail.comments).toEqual(expectedPayload.comments);
            expect(threadDetail.username).toEqual(expectedPayload.username);
        });
    });

    describe('verifyAvailableThread method', () => {
        it('should throw error when thread not exists', async () => {
            // arrange
            const threadId = 'thread-123';
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // action and assert
            await expect(threadRepositoryPostgres.verifyAvailableThread(threadId)).rejects.toThrowError('THREAD_REPOSITORY_POSTGRESS.THREAD_ID_DOES_NOT_EXIST');
        });

        it('should return id when querying with exist thread', async () => {
            // arrange
            const threadId = 'thread-123';
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            // action and assert
            await expect(threadRepositoryPostgres.verifyAvailableThread(threadId)).resolves.not.toThrowError();
        });
    });
});