const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Publication {
    constructor(id, titre, user_id, image_url, contenu, reactions = 0, created_at = null, updated_at = null) {
        this.id = id;
        this.titre = titre;
        this.user_id = user_id;
        this.image_url = image_url;
        this.contenu = contenu;
        this.reactions = reactions;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromPrisma(publication) {
        const pub = new Publication(
            publication.id,
            publication.titre,
            publication.user_id,
            publication.image_url,
            publication.contenu,
            publication.reactions,
            publication.created_at,
            publication.updated_at
        );
        pub.comments = publication.comments || [];
        return pub;
    }

    static async getById(id) {
        const publication = await prisma.publication.findUnique({
            where: { id },
            include: {
                comments: {
                    include: {
                        first_message: true,
                        replies: true
                    }
                }
            }
        });
        return publication ? Publication.fromPrisma(publication) : null;
    }
    
    static async getAll() {
        const publications = await prisma.publication.findMany({
            include: {
                user: true,
                comments: {
                    include: {
                        first_message: true,
                        replies: true
                    }
                }
            }
        });
        return publications.map(Publication.fromPrisma);
    }

    static async create(data) {
        const newPublication = await prisma.publication.create({
            data: {
                user_id: data.user_id,
                image_url: data.image_url,
                contenu: data.contenu,
                titre: data.titre || "",
            },
        });
        return Publication.fromPrisma(newPublication);
    }

    static async update(id, data) {
        const validFields = {
            titre: data.titre,
            contenu: data.contenu,
            image_url: data.image_url,
            reactions: data.reactions,
        };
    
        const filteredData = Object.fromEntries(
            Object.entries(validFields).filter(([_, value]) => value !== undefined)
        );
    
        const updatedPublication = await prisma.publication.update({
            where: { id },
            data: filteredData,
        });
        return Publication.fromPrisma(updatedPublication);
    }

    static async delete(id) {
        return await prisma.publication.delete({ where: { id } });
    }
}

module.exports = Publication;