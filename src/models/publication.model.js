const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Publication {
    constructor(id, user_id, image_url, contenu, reactions = 0, created_at = null, updated_at = null) {
        this.id = id;
        this.user_id = user_id;
        this.image_url = image_url;
        this.contenu = contenu;
        this.reactions = reactions;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromPrisma(publication) {
        return new Publication(publication.id, publication.user_id, publication.image_url, publication.contenu, publication.reactions, publication.created_at, publication.updated_at);
    }

    static async getById(id) {
        const publication = await prisma.publication.findUnique({ where: { id } });
        return publication ? Publication.fromPrisma(publication) : null;
    }

    static async getAll() {
        const publications = await prisma.publication.findMany({
            include: { user: true }, // Inclure les informations de l'admin
        });
        return publications.map(Publication.fromPrisma);
    }

    static async create(data) {
        const newPublication = await prisma.publication.create({ data });
        return Publication.fromPrisma(newPublication);
    }

    static async update(id, data) {
        const updatedPublication = await prisma.publication.update({ where: { id }, data });
        return Publication.fromPrisma(updatedPublication);
    }

    static async delete(id) {
        return await prisma.publication.delete({ where: { id } });
    }
}

module.exports = Publication;