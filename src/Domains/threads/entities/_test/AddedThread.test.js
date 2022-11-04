const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // arrange
        const payload = {
            id: 'thread_id',
            title: 'Dicoding',
        };

        // action and assert
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type spesification', () => {
        // arrange
        const payload = {
            id: 'thread_id',
            title: 'Dicoding',
            owner: true,
        };

        // action and assert
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create AddedThread entity correctly', () => {
        // arrange
        const payload = {
            id: 'thread_id',
            title: 'Dicoding',
            owner: 'owner',
        };

        // action 
        const addedThread = new AddedThread(payload);

        // assert
        expect(addedThread).toBeInstanceOf(AddedThread);
        expect(addedThread.id).toEqual(payload.id);
        expect(addedThread.title).toEqual(payload.title);
        expect(addedThread.owner).toEqual(payload.owner);
    });
});