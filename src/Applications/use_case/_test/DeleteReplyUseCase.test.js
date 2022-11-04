const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteReply = require("../../../Domains/replies/entities/DeleteReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe('DeleteReplyUseCase', () => {

    it('should orchestrating delete reply correctly', async () => {
        // arrange
        const threadId = 'thread-id';
        const commentId = 'comment-id';
        const replyId = 'reply-123'
        const owner = 'user-123';

        const useCasePayload = {
            threadId, commentId, replyId, owner,
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());


        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.verifyOwnerReply = jest.fn().mockImplementation(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({ replyRepository: mockReplyRepository, commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });
        // action
        await deleteReplyUseCase.execute(useCasePayload);

        // assert
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
        expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
        expect(mockReplyRepository.verifyOwnerReply).toBeCalledWith(new DeleteReply(useCasePayload));
        expect(mockReplyRepository.deleteReply).toBeCalledWith(replyId);
    });
});