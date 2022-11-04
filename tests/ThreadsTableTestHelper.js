/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-123', title = 'Dicoding Title', body = 'dicoding content', owner = 'user-123',
    }) {
        const createdAt = new Date().toISOString();
        const query = {
            text : 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
            values: [id, title, body, createdAt, owner],
        };

        await pool.query(query);
    },

    async findThreadById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id]
        }

        const result = await pool.query(query);
        return result.rows;
    },

    async getThreadIdByTitle(title) {
        const query = {
            text: 'SELECT id FROM threads WHERE title = $1',
            values: [title]
        }

        const result = await pool.query(query);
        return result.rows[0].id;
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1') ;
    }
}

module.exports = ThreadsTableTestHelper;