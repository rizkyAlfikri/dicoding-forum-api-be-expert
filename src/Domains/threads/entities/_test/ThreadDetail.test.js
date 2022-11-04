const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail', () => {
    it('should throw error when does not contain needed data', () => {
        // arrange
        const payload = {
            id: "thread-123",
        };

        // action and assert
        expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.DOES_NOT_CONTAIN_NEEDED_DATA');
    });

    it('should throw error when does not meet data type spesification', () => {
        const payload = {
            id: "thread-AqVg2b9JyQXR6wSQ2TmH4",
            title: "sebuah thread",
            body: "sebuah body thread",
            created_at: "2021-08-08T07:59:16.198Z",
            username: "dicoding",
            comments: true
        };

        // action and assert
        expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.DOES_NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create thread detail entity correctly', () => {
        // arrange
        const payload = {
            id: "thread-AqVg2b9JyQXR6wSQ2TmH4",
            title: "sebuah thread",
            body: "sebuah body thread",
            created_at: "2021-08-08T07:59:16.198Z",
            username: "dicoding",
            comments: []
        };

        // action
        const threadDetail = new ThreadDetail(payload);

        // assert
        expect(threadDetail).toBeInstanceOf(ThreadDetail);
        expect(threadDetail.id).toEqual(payload.id);
        expect(threadDetail.title).toEqual(payload.title);
        expect(threadDetail.body).toEqual(payload.body);
        expect(threadDetail.date).toEqual(payload.created_at);
        expect(threadDetail.username).toEqual(payload.username);
        expect(threadDetail.comments).toEqual(payload.comments);
    });
});