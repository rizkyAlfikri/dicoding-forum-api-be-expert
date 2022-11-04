const InvariantError = require("../../../Commons/exceptions/InvariantError");

class CommentDetail {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.username = payload.username;
        this.date = payload.created_at;
        this.content = payload.content;
        this.replies = payload.replies;
    }

    _verifyPayload(payload) {
        const { id, username, created_at, content, replies } = payload;

        if (!id || !username || !created_at || !content) {
            throw new InvariantError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_DATA');
        }

        if (typeof id !== 'string' || typeof username !== 'string' || typeof created_at !== 'string' || typeof content !== 'string') {
            throw new InvariantError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
        }
    }
}

module.exports = CommentDetail;