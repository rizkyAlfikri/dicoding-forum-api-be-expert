const { addReply } = require("../../../../../tests/RepliesTableTestHelper");
const AddedReply = require("../AddedReply");

describe('AddedReply entity', () => {
    it('should throw error when payload does not contain needed propery', () => {
        // arrange
        const payload = {
            id: 'reply-123',
        };

        // action and assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload does not meet data type spesification', () => {
        // arrange
        const payload = {
            id: 'reply-123',
            content: 'content',
            owner: true,
        };

        // action and assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create AddedReply entity correctly', () => {
        // arrange
        const payload = {
            id: 'reply-123',
            content: 'content',
            owner: 'user-123',
        };

        // action
        const addedReply = new AddedReply(payload);

        // assert
        expect(addedReply).toBeInstanceOf(AddedReply);
        expect(addedReply.id).toEqual(payload.id);
        expect(addedReply.content).toEqual(payload.content);
        expect(addedReply.owner).toEqual(payload.owner); 
    });
});