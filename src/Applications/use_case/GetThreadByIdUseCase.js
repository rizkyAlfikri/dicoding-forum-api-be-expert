const InvariantError = require("../../Commons/exceptions/InvariantError");
const CommentDetail = require("../../Domains/comments/entities/CommentDetail");
const ReplyDetail = require("../../Domains/replies/entities/ReplyDetail");

class GetThreadByIdUseCase {
    constructor({ replyRepository, commentRepository, threadRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(userCasePayload) {
        const threadId = userCasePayload.threadId;
        if (typeof threadId !== 'string') {
            throw new InvariantError('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPESIFICATION');
        }

        await this._threadRepository.verifyAvailableThread(threadId)

        const thread = await this._threadRepository.getThreadById(threadId);
        const commentsResult = await this._commentRepository.getCommentByThreadId(threadId);

        const repliesDetails = commentsResult.map(async (comment) => {
            const repliesResult = await this._replyRepository.getReplyByThreadIdAndCommentId(threadId, comment.id)
            const replies = repliesResult.map((reply) => {
                const replyContent = (reply.is_delete === true)
                    ? "**balasan telah dihapus**"
                    : reply.content;

                const repliesDetail = new ReplyDetail({ ...reply, content: replyContent })
                return { ...repliesDetail };
            });

            return { commentId: comment.id, replies }
        });

        const repliesResult = await repliesDetails;

        const commentResults = commentsResult.map(async (comment) => {
            const commentContent = (comment.is_delete === true)
                ? "**komentar telah dihapus**"
                : comment.content;

            const replies = repliesResult.find(async (data) => {
                const reply = await data;
                return reply.commendId == comment.id;
            });

            const reply = await replies
            const commentDetail = new CommentDetail({ ...comment, content: commentContent, replies: reply.replies })
            return { ...commentDetail };
        });

        const comments = await Promise.all(commentResults)

        return {
            ...thread,
            comments: comments,
        };
    }
}

module.exports = GetThreadByIdUseCase;