const cloudinary = require("../config/cloudinary.config");
const path = require("path");

const uploadDefaultProfileImage = async () => {
    try {
        const defaultImagePath = path.join(__dirname, "../assets/profile.png");

        const result = await cloudinary.uploader.upload(defaultImagePath, {
            folder: "admin_profiles",
            public_id: "default_profile",
            overwrite: false
        });

        return result.secure_url;
    } catch (error) {
        console.error("Erreur lors de l'upload de l'image par défaut:", error);
        throw error;
    }
};

module.exports = { uploadDefaultProfileImage };