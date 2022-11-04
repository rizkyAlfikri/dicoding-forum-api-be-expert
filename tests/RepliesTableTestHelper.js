/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({ id = 'reply-123', content = 'dicoding content', threadId = 'thread-123', commentId = 'comment-123', owner = 'user-123' }) {
        const createdAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7)',
            values: [id, content, createdAt, threadId, commentId, owner, false],
        }

        await pool.query(query);
    },

    async findReplyById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        }

        const result = await pool.query(query);
        return result.rows;
    },

    async getReplyIdByContent(content) {
        const query = {
            text: 'SELECT id FROM replies WHERE content = $1',
            values: [content]
        }

        const result = await pool.query(query);
        return result.rows[0].id;
    },

    async deleteReplyById(replyId) {
        const query = {
            text: 'UPDATE replies SET is_delete = $2 WHERE id = $1',
            values: [replyId, true],
        };

        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1');
    }
}

module.exports = RepliesTableTestHelper;