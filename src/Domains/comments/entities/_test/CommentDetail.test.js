const CommentDetail = require("../CommentDetail");

describe('CommentDetailEntity', () => {
    it('should throw error when request does not contain needed data', () => {
        // arrange
        const payload = {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            created_at: "2021-08-08T07:22:33.555Z",
        };

        // action and assert
        expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_DATA');
    });

    it('should throw error when request does not meet data type spesification', () => {
        // arrange
        const payload = {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            created_at: "2021-08-08T07:22:33.555Z",
            content: true,
            replies: [],
        };

        // action and assert
        expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create CommentDetail entity correctly', () => {
        // arrange
        const payload = {
            id: "comment-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            created_at: "2021-08-08T07:22:33.555Z",
            content: 'content',
            replies: [],
        };

        // action
        const commentDetail = new CommentDetail(payload);

        // assert
        expect(commentDetail).toBeInstanceOf(CommentDetail);
        expect(commentDetail.id).toEqual(payload.id);
        expect(commentDetail.username).toEqual(payload.username);
        expect(commentDetail.created_at).toEqual(payload.date);
        expect(commentDetail.content).toEqual(payload.content);

    });
});