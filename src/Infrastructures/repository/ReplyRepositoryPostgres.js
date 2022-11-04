const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(reply) {
        const id = `reply-${this._idGenerator()}`;
        const createdAt = new Date().toISOString();
        const { content, owner, threadId, commentId } = reply;
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, content, createdAt, threadId, commentId, owner]
        }

        const result = await this._pool.query(query);

        return new AddedReply({
            ...result.rows[0],
        });
    }

    async getReplyByThreadIdAndCommentId(threadId, commentId) {
        const query = {
            text: `SELECT replies.id, users.username, replies.created_at, replies.content, replies.is_delete FROM replies
            LEFT JOIN users ON users.id = replies.owner
            WHERE replies.thread_id = $1 AND replies.comment_id = $2
            GROUP by replies.id, users.username
            ORDER BY replies.created_at ASC`,
            values: [threadId, commentId,],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async deleteReply(id) {
        const query = {
            text: 'UPDATE replies SET is_delete = $2 WHERE id = $1 RETURNING id',
            values: [id, true],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('REPLY_REPOSITORY_POSTGRES.REPLY_ID_DOES_NOT_EXIST');
        }
    }

    async verifyOwnerReply(deleteReply) {
        const query = {
            text: 'SELECT id, thread_id, comment_id, owner FROM replies WHERE id = $1',
            values: [deleteReply.replyId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('REPLY_REPOSITORY_POSTGRES.REPLY_ID_DOES_NOT_EXIST');
        }

        if (result.rows[0].owner !== deleteReply.owner) {
            throw new AuthorizationError('REPLY_REPOSITORY_POSTGRES.REPLY_OWNER_DOES_NOT_VALID');
        }
    }
}

module.exports = ReplyRepositoryPostgres;