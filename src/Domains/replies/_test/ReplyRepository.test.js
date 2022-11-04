const ReplyRepository = require('../ReplyRepository');

describe('CommentRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () =>{
        // arrange
        const replyRepository = new ReplyRepository();

        // action and assert
        expect(replyRepository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(replyRepository.getReplyByThreadIdAndCommentId('', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(replyRepository.deleteReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(replyRepository.verifyOwnerReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});