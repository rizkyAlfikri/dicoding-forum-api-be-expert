const DeleteComment = require("../DeleteComment");

describe('DeleteComment', () => {
    it('should throw error when payload does not contain needed data', () => {
        // arrange
        const payload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
        };

        // action and assert
        expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.DOES_NOT_CONTAIN_NEEDED_DATA');
    });

    it('should throw error when payload does not meet type data spesification', () => {
        // arrange
        const payload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: true
        };

        // action and assert
        expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.DOES_NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create DeleteComment entity correctly', () => {
        const payload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123'
        };

        // action
        const deleteComent = new DeleteComment(payload);

        // assert
        expect(deleteComent).toBeInstanceOf(DeleteComment);
        expect(deleteComent.threadId).toEqual(payload.threadId);
        expect(deleteComent.commentId).toEqual(payload.commentId);
        expect(deleteComent.owner).toEqual(payload.owner);
    });
});