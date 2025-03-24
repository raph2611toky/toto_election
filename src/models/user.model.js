const bcrypt = require("../utils/securite/bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class User {
    constructor(id, name, email, password, phone, profile = "profile.png", is_active = false, role = "ADMIN", created_at = null, updated_at = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.profile = profile;
        this.is_active = is_active;
        this.role = role;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromPrisma(user) {
        return new User(user.id, user.name, user.email, user.password, user.phone, user.profile, user.is_active, user.role, user.created_at, user.updated_at);
    }

    static async getById(id) {
        const user = await prisma.user.findUnique({ where: { id } });
        return user ? User.fromPrisma(user) : null;
    }

    static async findByEmail(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        return user ? User.fromPrisma(user) : null;
    }

    static async getAll() {
        const users = await prisma.user.findMany();
        return users.map(User.fromPrisma);
    }

    static async create(data) {
        if (data.password) {
            data.password = await bcrypt.hashPassword(data.password);
        }
        const newUser = await prisma.user.create({ data });
        return User.fromPrisma(newUser);
    }

    static async update(id, data) {
        if (data.password) {
            data.password = await bcrypt.hashPassword(data.password);
        }
        const updatedUser = await prisma.user.update({ where: { id }, data });
        return User.fromPrisma(updatedUser);
    }

    static async delete(id) {
        return await prisma.user.delete({ where: { id } });
    }

    static async comparePassword(password, hashPassword) {
        return bcrypt.comparePassword(password, hashPassword);
    }
}

module.exports = User;