/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({ id = 'comment-123', content = 'dicoding content', threadId = 'thread-123', owner = 'user-123' }) {
        const createdAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
            values: [id, content, createdAt, threadId, owner],
        }

        await pool.query(query);
    },

    async findCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        }

        const result = await pool.query(query);
        return result.rows;
    },

    async getCommentIdByContent(content) {
        const query = {
            text: 'SELECT id FROM comments WHERE content = $1',
            values: [content]
        }

        const result = await pool.query(query);
        return result.rows[0].id;
    },

    async deleteCommentById(commentId) {
        const query = {
            text: 'UPDATE comments SET is_delete = $2 WHERE id = $1',
            values: [commentId, true],
        };

        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    }
}

module.exports = CommentsTableTestHelper;