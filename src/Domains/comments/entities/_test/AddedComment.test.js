const AddedComment = require('../AddedComment');

describe('AddedComment entity', () => {
    it('should throw error when payload does not contain needed property', () => {
        // arrange
        const payload = {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            content: "sebuah comment",
        };

        // action and assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload does not meet data type spesification', () => {
        // arrange
        const payload = {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            content: "sebuah comment",
            owner: true,
        };

        // action and assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION')
    });

    it('should create AddedComment entity correctly', () => {
        // arrange
        const payload = {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            content: "sebuah comment",
            owner: 'user-123',
        };

        // action
        const addedComment = new AddedComment(payload);

        // assert
        expect(addedComment).toBeInstanceOf(AddedComment);
        expect(addedComment.id).toEqual(payload.id);
        expect(addedComment.content).toEqual(payload.content);
        expect(addedComment.owner).toEqual(payload.owner);
    });
});