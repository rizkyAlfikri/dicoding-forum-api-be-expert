const InvariantError = require("../../../Commons/exceptions/InvariantError");

class Reply {

    constructor(payload) {

        this._verifyPayload(payload);

        this.content = payload.content;
        this.threadId = payload.threadId;
        this.commentId = payload.commentId;
        this.owner = payload.owner;
    }

    _verifyPayload(payload) {
        const { content, threadId, commentId, owner } = payload;

        if (!content || !threadId || !commentId || !owner) {
            throw new InvariantError('REPLY.NOT_CONTAIN_NEEDED_PROPERTIES')
        }

        if (typeof content !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
            throw new InvariantError('REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION');
        }
    }
}

module.exports = Reply;