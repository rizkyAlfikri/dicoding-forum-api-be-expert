const Reply = require("../Reply");

describe('Reply entity', () => {
    it('should throw error when payload not contain needed properties', () => { 
        // arrange
        const payload = {
            content: 'Dicoding',
        };

        // action and assert
        expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTIES');
    });

    it('should throw error when payload does not meet data type spesification', () => {
        // arrange 
        const payload = {
            content: 'Dicoding',
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: true,
        };

        // action and assert
        expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create Reply entity correctly', () => {
          // arrange 
          const payload = {
            content: 'Dicoding',
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        // action
        const reply = new Reply(payload);

        // assert
        expect(reply).toBeInstanceOf(Reply);
        expect(reply.content).toEqual(payload.content);
        expect(reply.threadId).toEqual(payload.threadId);
        expect(reply.commentId).toEqual(payload.commentId);
        expect(reply.owner).toEqual(payload.owner);
    });
});