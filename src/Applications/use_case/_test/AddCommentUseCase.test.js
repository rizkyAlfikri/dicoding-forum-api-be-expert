const CommentRepository = require("../../../Domains/comments/CommentRepository");
const Comment = require("../../../Domains/comments/entities/Comment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe('AddCommentUseCase', () => {
    it('should orchestrating add comment action property', async () => {
        // arrange
        const owner = 'user-123';
        const threadId = 'thread-123';
        const useCasePayload = {
            content: 'Dicoding',
            owner: owner,
            threadId: threadId,
        };

        const expectedAddedComment = {
            id: 'comment-123',
            content: 'Dicoding',
            owner: owner,
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve({
            id: 'comment-123',
            content: 'Dicoding',
            owner: owner,
        }));

        const addCommentUseCase = new AddCommentUseCase({ commentRepository: mockCommentRepository, threadRepository: mockThreadRepository });

        // action
        const addedComment = await addCommentUseCase.execute(useCasePayload);

        // assert
        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
        expect(mockCommentRepository.addComment).toBeCalledWith(new Comment(
            {
                content: 'Dicoding',
                owner: owner,
                threadId: threadId,
            }
        ));
    });
});
