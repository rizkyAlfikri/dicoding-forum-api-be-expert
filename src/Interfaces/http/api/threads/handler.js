const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/GetThreadByIdUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const { id: owner } = request.auth.credentials;

        const addedThread = await addThreadUseCase.execute({ ...request.payload, owner });

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);

        return response;

    }

    async getThreadByIdHandler(request, h) {
        const getThreadByIdUseCase = this._container.getInstance(GetThreadByIdUseCase.name);
        const { threadId } = request.params;

        const thread = await getThreadByIdUseCase.execute({ threadId });

        return h.response({
            status: 'success',
            data: {
                thread,
            },
        });
    }
}

module.exports = ThreadsHandler;