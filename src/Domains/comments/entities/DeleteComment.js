const InvariantError = require("../../../Commons/exceptions/InvariantError");

class DeleteComment {
    constructor(payload) {
        this._verifyPayload(payload);

        this.threadId = payload.threadId;
        this.commentId = payload.commentId;
        this.owner = payload.owner;
    }

    _verifyPayload(payload) {
        const { threadId, commentId, owner } = payload;

        if (!threadId || !commentId || !owner) {
            throw new InvariantError('DELETE_COMMENT.DOES_NOT_CONTAIN_NEEDED_DATA');
        }

        if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
            throw new InvariantError('DELETE_COMMENT.DOES_NOT_MEET_DATA_TYPE_SPESIFICATION');
        }
    }
}

module.exports = DeleteComment;