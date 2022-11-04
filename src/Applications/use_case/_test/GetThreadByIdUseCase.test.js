const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadByIdUseCase = require("../GetThreadByIdUseCase");

describe('GetThreadById usecase', () => {
    it('should orchestrating GetThreadById correctly', async () => {
        // arrange
        const expectedThreadDetail = {
            id: "thread-123",
            title: "sebuah dicoding",
            body: "sebuah body thread",
            created_at: "2021-08-08T07:19:09.775Z",
            username: "dicoding",
            comments: [],
        };

        const expectedCommentDetail = {
            id: "comment-123",
            username: "dicoding",
            date: "2021-08-08T07:22:33.555Z",
            content: "dicoding",
        };

        const expectedReplyDetail = {
            id: "reply-123",
            username: "dicoding",
            date: "2021-08-08T07:22:33.555Z",
            content: "dicoding",
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(
            new ThreadDetail({
                id: "thread-123",
                title: "sebuah dicoding",
                body: "sebuah body thread",
                created_at: "2021-08-08T07:19:09.775Z",
                username: "dicoding",
                comments: [],
            })));
        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());


        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve([
            {
                id: "comment-123",
                username: "dicoding",
                created_at: "2021-08-08T07:22:33.555Z",
                content: "dicoding",
                is_delete: false,
            },
        ]));

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.getReplyByThreadIdAndCommentId = jest.fn().mockImplementation(() => Promise.resolve([
            {
                id: "reply-123",
                username: "dicoding",
                created_at: "2021-08-08T07:22:33.555Z",
                content: "dicoding",
                is_delete: false,
            },
        ]));

        const getThreadByIdUseCase = new GetThreadByIdUseCase({ replyRepository: mockReplyRepository, commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });

        // action
        const threadDetail = await getThreadByIdUseCase.execute({ threadId: 'thread-123' });

        // assert
        expect(threadDetail.id).toEqual(expectedThreadDetail.id);
        expect(threadDetail.title).toEqual(expectedThreadDetail.title);
        expect(threadDetail.body).toEqual(expectedThreadDetail.body);
        expect(threadDetail.date).toEqual(expectedThreadDetail.created_at);
        expect(threadDetail.username).toEqual(expectedThreadDetail.username);
        expect(threadDetail.comments[0].id).toEqual(expectedCommentDetail.id);
        expect(threadDetail.comments[0].content).toEqual(expectedCommentDetail.content);
        expect(threadDetail.comments[0].date).toEqual(expectedCommentDetail.date);
        expect(threadDetail.comments[0].username).toEqual(expectedCommentDetail.username);
        expect(threadDetail.comments[0].replies[0].id).toEqual(expectedReplyDetail.id);
        expect(threadDetail.comments[0].replies[0].content).toEqual(expectedReplyDetail.content);
        expect(threadDetail.comments[0].replies[0].date).toEqual(expectedReplyDetail.date);
        expect(threadDetail.comments[0].replies[0].username).toEqual(expectedReplyDetail.username);
        expect(mockReplyRepository.getReplyByThreadIdAndCommentId).toBeCalledWith('thread-123', 'comment-123');
        expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith('thread-123');
        expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith('thread-123');
    });

    it('should return "**komentar telah dihapus**" content comment if is_delete true', async () => {
        // arrange
        const expectedThreadDetail = {
            id: "thread-123",
            title: "sebuah dicoding",
            body: "sebuah body thread",
            created_at: "2021-08-08T07:19:09.775Z",
            username: "dicoding",
            comments: [],
        };

        const expectedCommentDetail = {
            id: "comment-222",
            username: "dicoding",
            date: "2021-08-08T07:22:33.555Z",
            content: "**komentar telah dihapus**",
        };

        const expectedReplyDetail = {
            id: "reply-123",
            username: "dicoding",
            date: "2021-08-08T07:22:33.555Z",
            content: "**balasan telah dihapus**",
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(
            new ThreadDetail({
                id: "thread-123",
                title: "sebuah dicoding",
                body: "sebuah body thread",
                created_at: "2021-08-08T07:19:09.775Z",
                username: "dicoding",
                comments: [],
            })));

        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());


        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve([
            {
                id: "comment-222",
                username: "dicoding",
                created_at: "2021-08-08T07:22:33.555Z",
                content: "dicoding",
                is_delete: true,
            }
        ]));

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.getReplyByThreadIdAndCommentId = jest.fn().mockImplementation(() => Promise.resolve([
            {
                id: "reply-123",
                username: "dicoding",
                created_at: "2021-08-08T07:22:33.555Z",
                content: "dicoding",
                is_delete: true,
            },
        ]));

        const getThreadByIdUseCase = new GetThreadByIdUseCase({ replyRepository: mockReplyRepository, commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });

        // action
        const threadDetail = await getThreadByIdUseCase.execute({ threadId: 'thread-123' });
     
        // assert
        expect(threadDetail.id).toEqual(expectedThreadDetail.id);
        expect(threadDetail.title).toEqual(expectedThreadDetail.title);
        expect(threadDetail.body).toEqual(expectedThreadDetail.body);
        expect(threadDetail.date).toEqual(expectedThreadDetail.created_at);
        expect(threadDetail.username).toEqual(expectedThreadDetail.username);
        expect(threadDetail.comments[0].id).toEqual(expectedCommentDetail.id);
        expect(threadDetail.comments[0].content).toEqual(expectedCommentDetail.content);
        expect(threadDetail.comments[0].date).toEqual(expectedCommentDetail.date);
        expect(threadDetail.comments[0].username).toEqual(expectedCommentDetail.username);
        expect(threadDetail.comments[0].replies[0].id).toEqual(expectedReplyDetail.id);
        expect(threadDetail.comments[0].replies[0].content).toEqual(expectedReplyDetail.content);
        expect(threadDetail.comments[0].replies[0].date).toEqual(expectedReplyDetail.date);
        expect(threadDetail.comments[0].replies[0].username).toEqual(expectedReplyDetail.username);
        expect(mockReplyRepository.getReplyByThreadIdAndCommentId).toBeCalledWith('thread-123', 'comment-222');
        expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith('thread-123');
        expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith('thread-123');
    });

    it('should throw error when request not meet data type spesification', async () => {
        // arrange
        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(
            new ThreadDetail({
                id: "thread-123",
                title: "sebuah dicoding",
                body: "sebuah body thread",
                created_at: "2021-08-08T07:19:09.775Z",
                username: "dicoding",
                comments: [],
            })
        ));

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve([
            {
                id: "comment-123",
                username: "dicoding",
                created_at: "2021-08-08T07:22:33.555Z",
                content: "dicoding",
                is_delete: false,
            },
            {
                id: "comment-222",
                username: "dicoding",
                created_at: "2021-08-08T07:22:33.555Z",
                content: "dicoding",
                is_delete: true,
            }
        ]));

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.getReplyByThreadIdAndCommentId = jest.fn().mockImplementation(() => Promise.resolve([
            {
                id: "reply-123",
                username: "dicoding",
                created_at: "2021-08-08T07:22:33.555Z",
                content: "dicoding",
                is_delete: true,
            },
        ]));

        const getThreadByIdUseCase = new GetThreadByIdUseCase({ replyRepository: mockReplyRepository, commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });

        // action and assert
        await expect(getThreadByIdUseCase.execute({ threadId: false })).rejects.toThrowError('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPESIFICATION');
    })
});