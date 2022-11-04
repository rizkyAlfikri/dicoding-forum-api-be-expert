const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(comment) {
        const id = `comment-${this._idGenerator()}`;
        const createdAt = new Date().toISOString();
        const { content, owner, threadId } = comment;
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, content, createdAt, threadId, owner]
        }

        const result = await this._pool.query(query);

        return new AddedComment({
            ...result.rows[0],
        });
    }

    async getCommentByThreadId(threadId) {
        const query = {
            text: `SELECT comments.id, users.username, comments.created_at, comments.content, comments.is_delete FROM comments
            LEFT JOIN users ON users.id = comments.owner
            WHERE comments.thread_id = $1
            GROUP by comments.id, users.username
            ORDER BY comments.created_at ASC`,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async deleteComment(id) {
        const query = {
            text: 'UPDATE comments SET is_delete = $2 WHERE id = $1 RETURNING id',
            values: [id, true],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('COMMENT_REPOSITORY_POSTGRES.COMMENT_ID_DOES_NOT_EXIST');
        }
    }

    async verifyOwnerComment(deleteComment) {
        const query = {
            text: 'SELECT id, thread_id, owner FROM comments WHERE id = $1',
            values: [deleteComment.commentId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('COMMENT_REPOSITORY_POSTGRES.COMMENT_ID_DOES_NOT_EXIST');
        }

        if (result.rows[0].owner !== deleteComment.owner) {
            throw new AuthorizationError('COMMENT_REPOSITORY_POSTGRES.COMMENT_OWNER_DOES_NOT_VALID');
        }
    }

    async verifyAvailableComment(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('COMMENT_REPOSITORY_POSTGRES.COMMENT_ID_DOES_NOT_EXIST');
        }
    }
}

module.exports = CommentRepositoryPostgres;