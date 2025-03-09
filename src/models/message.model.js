const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Message {
    constructor(id, content, reactions = 0, created_at = null, updated_at = null) {
        this.id = id;
        this.content = content;
        this.reactions = reactions;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromPrisma(message) {
        return new Message(message.id, message.content, message.reactions, message.created_at, message.updated_at);
    }

    static async getById(id) {
        const message = await prisma.message.findUnique({ where: { id } });
        return message ? Message.fromPrisma(message) : null;
    }

    static async create(data) {
        const newMessage = await prisma.message.create({ data });
        return Message.fromPrisma(newMessage);
    }

    static async delete(id) {
        return await prisma.message.delete({ where: { id } });
    }
}

module.exports = Message;