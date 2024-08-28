const db = require("../models");
const sharp = require("sharp");
const cloudinary = require("../utils/cloudinary");
const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required" });

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const newPost = await db.Post.create({
      caption,
      image: cloudResponse.secure_url,
      authorId,
    });

    const post = await db.Post.findOne({
      where: { id: newPost.id },
      attributes: ["id", "caption", "image", "createdAt", "updatedAt"],
      include: [
        {
          model: db.User,
          as: "author",
          attributes: ["id", "username", "email"],
        },
        {
            model: db.Comment,
            as: "comments",
        },
        {
            model: db.PostLike,
            as: "comments",
        },
      ],
    });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addNewPost };
