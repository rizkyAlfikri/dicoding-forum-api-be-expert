const DeleteReply = require("../DeleteReply");

describe('DeleteReply', () => {
    it('should throw error when payload does not contain needed data', () => {
        // arrange
        const payload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
        };

        // action and assert
        expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.DOES_NOT_CONTAIN_NEEDED_DATA');
    });

    it('should throw error when payload does not meet type data spesification', () => {
        // arrange
        const payload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
            owner: true
        };

        // action and assert
        expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.DOES_NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create DeleteReply entity correctly', () => {
        const payload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
            owner: 'user-123'
        };

        // action
        const deleteReply = new DeleteReply(payload);

        // assert
        expect(deleteReply).toBeInstanceOf(DeleteReply);
        expect(deleteReply.threadId).toEqual(payload.threadId);
        expect(deleteReply.commentId).toEqual(payload.commentId);
        expect(deleteReply.replyId).toEqual(payload.replyId);
        expect(deleteReply.owner).toEqual(payload.owner);
    });
});