const Thread = require('../Thread');

describe('Thread entities', () => {
    it('should throw error when payload does not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'dicoding'
        };

        // action and assert
        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type spesification', () => {
        // arrange
        const payload = {
            title: 'dicoding',
            body: 1234,
            owner: 'user-123'
        };

        // action and assert
        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create Thread entity correctly', () => {
        // arrange
        const payload = {
            title: 'dicoding',
            body: 'dicoding academy',
            owner: 'user-123'
        };

        // action 
        const thread = new Thread(payload);

        // assert
        expect(thread).toBeInstanceOf(Thread);
        expect(thread.title).toEqual(payload.title);
        expect(thread.body).toEqual(payload.body);
        expect(thread.owner).toEqual(payload.owner);
    }) ;
});