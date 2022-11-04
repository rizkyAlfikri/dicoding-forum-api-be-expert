const InvariantError = require("../../../Commons/exceptions/InvariantError");

class Comment {
    constructor(payload) {
        this._verifyPayload(payload);

        this.content = payload.content;
        this.threadId = payload.threadId;
        this.owner = payload.owner;
    }

    _verifyPayload(payload) {
        const { content, owner, threadId} = payload;

        if (!content || !owner || !threadId) {
            throw new InvariantError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string') {
            throw new InvariantError('COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
        }
    }
}



module.exports = Comment;