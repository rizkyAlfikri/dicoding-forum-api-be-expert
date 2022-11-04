const Comment = require('../Comment');

describe('Comment entities', () => {
    it('should throw error when payload does not contain needed properties', () =>{
        // arrange
        const payload = {
            content: 'content'
        };

        // action and assert
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload does not meet data type spesification', () => {
        // arrange
        const payload = {
            content: 'content',
            owner: true,
            threadId: 'thread-123',
        };

        // action and assert
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create Comment entity correctly', () => {
        // arrange 
        const payload = {
            content: 'Dicoding',
            owner: 'user-123',
            threadId: 'thread-123',
        };

        // action
        const comment = new Comment(payload);

        // assert
        expect(comment).toBeInstanceOf(Comment);
        expect(comment.content).toEqual(payload.content);
        expect(comment.owner).toEqual(payload.owner);
        expect(comment.threadId).toEqual(payload.threadId);
    });
});