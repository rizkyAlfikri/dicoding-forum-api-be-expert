const ReplyDetail = require("../ReplyDetail");

describe('ReplyDetail entity', () => {
    it('should throw error when request does not contain needed data', () => {
        // arrange
        const payload = {
            id: "reply-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            created_at: "2021-08-08T07:22:33.555Z",
        };

        // action and assert
        expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL.NOT_CONTAIN_NEEDED_DATA');
    });

    it('should throw error when request does not meet data type spesification', () => {
        // arrange
        const payload = {
            id: "reply-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            created_at: "2021-08-08T07:22:33.555Z",
            content: true,
        };

        // action and assert
        expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    });

    it('should create replyDetail entity correctly', () => {
        // arrange
        const payload = {
            id: "reply-_pby2_tmXV6bcvcdev8xk",
            username: "johndoe",
            created_at: "2021-08-08T07:22:33.555Z",
            content: 'content',
        };

        // action
        const replyDetail = new ReplyDetail(payload);

        // assert
        expect(replyDetail).toBeInstanceOf(ReplyDetail);
        expect(replyDetail.id).toEqual(payload.id);
        expect(replyDetail.username).toEqual(payload.username);
        expect(replyDetail.created_at).toEqual(payload.date);
        expect(replyDetail.content).toEqual(payload.content);

    });
});