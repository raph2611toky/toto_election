const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Comment {
    constructor(id, publication_id, first_message_id, created_at = null, updated_at = null) {
        this.id = id;
        this.publication_id = publication_id;
        this.first_message_id = first_message_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromPrisma(comment) {
        return new Comment(comment.id, comment.publication_id, comment.first_message_id, comment.created_at, comment.updated_at);
    }

    static async getById(id) {
        const comment = await prisma.comment.findUnique({
            where: { id },
            include: { 
                first_message: true, 
                replies: true
            },
        });
        if (!comment) return null;

        const result = Comment.fromPrisma(comment);
        result.first_message = comment.first_message;
        result.replies = comment.replies || [];
        return result;
    }

    static async getByPublicationId(publication_id) {
        const comments = await prisma.comment.findMany({
            where: { publication_id },
            include: { first_message: true, replies: true },
        });
        return comments.map(comment => {
            const result = Comment.fromPrisma(comment);
            result.first_message = comment.first_message;
            result.replies = comment.replies || [];
            return result;
        });
    }

    static async create(data) {
        const newComment = await prisma.comment.create({ data });
        return Comment.fromPrisma(newComment);
    }

    static async delete(id) {
        return await prisma.comment.delete({ where: { id } });
    }
}

module.exports = Comment;