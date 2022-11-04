const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe('DeleteCommentUseCase', () => {
   
    it('should orchestrating delete comment correctly', async () => {
        // arrange
        const threadId = 'thread-id';
        const commentId = 'comment-id';
        const owner = 'user-123';

        const useCasePayload = {
            threadId, commentId, owner,
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyOwnerComment = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({ commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });

        // action
        await deleteCommentUseCase.execute(useCasePayload);

        // assert
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(commentId);
    });
});