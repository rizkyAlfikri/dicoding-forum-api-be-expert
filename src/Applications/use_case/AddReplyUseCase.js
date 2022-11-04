const Reply = require("../../Domains/replies/entities/Reply");

class AddReplyUseCase {
    constructor({replyRepository, commentRepository, threadRepository}) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const reply = new Reply(useCasePayload);

        await this._threadRepository.verifyAvailableThread(reply.threadId);
        await this._commentRepository.verifyAvailableComment(reply.commentId);

        return this._replyRepository.addReply(reply);
    }
}

module.exports = AddReplyUseCase;