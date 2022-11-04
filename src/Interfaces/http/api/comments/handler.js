const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
        this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    }

    async postThreadCommentHandler(request, h) {
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const { id: owner } = request.auth.credentials;
        const { threadId } = request.params

        const addedComment = await addCommentUseCase.execute({ ...request.payload, threadId, owner });

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteThreadCommentHandler(request, h) {
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        const { id: owner } = request.auth.credentials;
        const { threadId, commentId } = request.params

        await deleteCommentUseCase.execute({ threadId, commentId, owner });

        return h.response({
            status: 'success',
            message: 'Comment berhasil ditambahkan',
        });
    }
}

module.exports = CommentsHandler;