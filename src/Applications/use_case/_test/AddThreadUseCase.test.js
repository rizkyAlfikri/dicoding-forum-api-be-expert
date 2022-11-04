const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe("AddThreadUseCase", () => {
    it('should orchestrating add thread action correctly', async () => {
        // Arrange
        const owner = 'user-123'
        const useCasePayload = {
            title: 'Dicoding',
            body: 'Backend Developer Path',
            owner: owner,
        };


        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: 'Dicoding',
            owner: owner,
        });

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve({
            id: 'thread-123',
            title: 'Dicoding',
            owner: owner,
        }));

        const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

        // action
        const addedThread = await addThreadUseCase.execute(useCasePayload, owner);

        // assert
        expect(addedThread.id).toEqual(expectedAddedThread.id);
        expect(addedThread.title).toEqual(expectedAddedThread.title);
        expect(addedThread.owner).toEqual(expectedAddedThread.owner);
        expect(mockThreadRepository.addThread).toBeCalledWith(new Thread({
            title: 'Dicoding',
            body: 'Backend Developer Path',
            owner: owner,
        }));

        //
    });
});