const InvariantError = require("../../../Commons/exceptions/InvariantError");

class ThreadDetail {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.title = payload.title;
        this.body = payload.body;
        this.date = payload.created_at;
        this.username = payload.username;
        this.comments = payload.comments;
    }

    _verifyPayload(payload) {
        const { id, title, body, created_at, username, comments } = payload;

        if (!id || !title || !body || !created_at || !username || !comments) {
            throw new InvariantError('THREAD_DETAIL.DOES_NOT_CONTAIN_NEEDED_DATA');
        }

        if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof created_at !== 'string' || typeof username !== 'string' || !(comments instanceof Array)) {
            throw new InvariantError('THREAD_DETAIL.DOES_NOT_MEET_DATA_TYPE_SPESIFICATION');
        }
    }
}

module.exports = ThreadDetail;