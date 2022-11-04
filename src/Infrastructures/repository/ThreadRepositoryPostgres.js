const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(thread) {
        const id = `thread-${this._idGenerator()}`;
        const createdAt = new Date().toISOString();
        const { title, body, owner } = thread;
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, createdAt, owner],
        };

        const result = await this._pool.query(query);

        return new AddedThread({...result.rows[0]});
    }

    async getThreadById(threadId) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.created_at, users.username FROM threads
            LEFT JOIN users ON users.id = threads.owner
            WHERE threads.id = $1
            GROUP BY threads.id, users.username`,
            values: [threadId]
        };

        const result = await this._pool.query(query);
        return new ThreadDetail({...result.rows[0], comments: []});
    }

    async verifyAvailableThread(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('THREAD_REPOSITORY_POSTGRESS.THREAD_ID_DOES_NOT_EXIST');
        }
    }

}

module.exports = ThreadRepositoryPostgres;