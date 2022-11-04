const CommentRepository = require("../../../Domains/comments/CommentRepository");
const Reply = require("../../../Domains/replies/entities/Reply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe('AddReplyUseCase', () => {
    it('should orchestrating add reply action property', async () => {
        // arrange
        const owner = 'user-123';
        const threadId = 'thread-123';
        const commentId = 'comment-123';
        const useCasePayload = {
            content: 'Dicoding',
            owner: owner,
            threadId: threadId,
            commentId: commentId,
        };

        const expectedAddedReply = {
            id: 'reply-123',
            content: 'Dicoding',
            owner: owner,
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve({
            id: 'reply-123',
            content: 'Dicoding',
            owner: 'user-123',
        }));

        const addReplyUseCase = new AddReplyUseCase({ replyRepository: mockReplyRepository, commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });

        // action
        const addedReply = await addReplyUseCase.execute(useCasePayload);

        // assert
        expect(addedReply).toStrictEqual(expectedAddedReply);
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
        expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
        expect(mockReplyRepository.addReply).toBeCalledWith(new Reply(
            {
                content: 'Dicoding',
                owner: owner,
                threadId: threadId,
                commentId: commentId,
            }
        ));
    });
});
