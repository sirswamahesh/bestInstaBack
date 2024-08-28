const db = require("../models");
const sharp = require("sharp");
const cloudinary = require("../utils/cloudinary");
const { io, getReceiverSocketId } = require("../app");
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
          as: "likes",
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

const getAllPost = async (req, res) => {
  try {
    const posts = await db.Post.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.User,
          as: "author",
          attributes: ["username", "profilePicture"],
        },
        {
          model: db.Comment,
          as: "comments",
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: db.User,
              as: "author",
              attributes: ["username", "profilePicture"],
            },
          ],
        },
        {
          model: db.PostLike,
          as: "likes",
          attributes: ["userId"],
        },
      ],
    });

    const formattedPosts = posts.map((post) => ({
      ...post.toJSON(),
      likes: post.likes.map((like) => like.userId),
    }));

    return res.status(200).json({ posts: formattedPosts, success: true });
  } catch (error) {
    console.log(error);
  }
};

const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;

    const posts = await db.Post.findAll({
      where: { authorId: authorId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.User,
          as: "author",
          attributes: ["username", "profilePicture"],
        },
        {
          model: db.Comment,
          as: "comments",
          order: [["createdAt", "DESC"]],
          include: {
            model: db.User,
            as: "author",
            attributes: ["username", "profilePicture"],
          },
        },
        {
          model: db.PostLike,
          as: "likes",
        },
        // {
        //   model: db.Bookmark,
        //   as: "bookmarks",
        // },
      ],
    });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await db.Post.findOne({
      where: {
        id: postId,
      },
    });
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const existingLike = await db.PostLike.findOne({
      where: {
        postId: postId,
        userId: likeKrneWalaUserKiId,
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You have already liked this post", success: false });
    }
    await db.PostLike.create({
      postId,
      userId: likeKrneWalaUserKiId,
    });

    // implement socket io for real time notification
    const user = await db.User.findOne({
      where: {
        id: likeKrneWalaUserKiId,
      },
      attributes: ["username", "profilePicture"],
    });

    const postOwnerId = post.authorId.toString();
    if (postOwnerId !== likeKrneWalaUserKiId) {
      // emit a notification event
      const notification = {
        type: "like",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        post,
        message: "Your post was liked",
        seen: false,
        createdAt: new Date(),
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
  }
};
const dislikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await db.Post.findOne({
      where: {
        id: postId,
      },
    });
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const existingLike = await db.PostLike.findOne({
      where: {
        postId: postId,
        userId: likeKrneWalaUserKiId,
      },
    });

    if (!existingLike) {
      return res
        .status(400)
        .json({ message: "You haven't liked this post", success: false });
    }
    await db.PostLike.destroy({
      where: {
        postId: postId,
        userId: likeKrneWalaUserKiId,
      },
    });

    // implement socket io for real time notification
    const user = await db.User.findOne({
      where: {
        id: likeKrneWalaUserKiId,
      },
      attributes: ["username", "profilePicture"],
    });

    const postOwnerId = post.authorId.toString();
    if (postOwnerId !== likeKrneWalaUserKiId) {
      // emit a notification event
      const notification = {
        type: "dislike",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        post,
        message: "Your post was disliked",
        seen: false,
        createdAt: new Date(),
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};

const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const { text } = req.body;

    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });
    const post = await db.Post.findOne({
      where: {
        id: postId,
      },
    });

    const newComment = await db.Comment.create({
      text,
      authorId: userId,
      postId,
    });

    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      attributes: {
        exclude: ["authorId"],
      },
      include: [
        {
          model: db.User,
          as: "author",
          attributes: ["id", "username", "profilePicture"],
        },
      ],
    });

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await db.Comment.findAll({
      where: { postId: postId },
      attributes: {
        exclude: ["authorId"],
      },
      include: [
        {
          model: db.User,
          as: "author",
          attributes: ["id", "username", "profilePicture"],
        },
      ],
    });

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found for this post", success: false });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await db.Post.findOne({
      where: {
        id: postId,
      },
    });
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    if (post.authorId.toString() !== authorId)
      return res.status(403).json({ message: "Unauthorized" });

    await db.Post.destroy({
      where: {
        id: postId,
      },
    });

    await db.Comment.destroy({ where: { postId: postId } });

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await db.Post.findOne({ where: { id: postId } });
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const existingBookmark = await db.Bookmark.findOne({
      where: {
        userId: authorId,
        postId: postId,
      },
    });
    if (existingBookmark) {
      // already bookmarked -> remove from the bookmark
      await db.Bookmark.destroy({
        where: { userId: authorId, postId: postId },
      });
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      // bookmark
      await db.Bookmark.create({ userId: authorId, postId: postId });
      return res
        .status(200)
        .json({ message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addNewPost,
  getAllPost,
  getUserPost,
  dislikePost,
  likePost,
  addComment,
  getCommentsOfPost,
  deletePost,
  bookmarkPost,
};
