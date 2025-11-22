import { Router } from "express";
import multer from "multer";
import path from 'path'

import Blog from '../models/models-blog.js'
import Comment from "../models/models-comment.js";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()} - ${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render('addblog', {
    user: req.user,
  });
});


// ⭐ DELETE BLOG (must be above GET("/:id"))
router.delete("/:id", async (req, res) => {

  if (!req.user) return res.status(401).send("Unauthorized");

  const blog = await Blog.findById(req.params.id);

  if (!blog) return res.status(404).send("Blog not found");

  if (blog.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).send("Forbidden - Not your blog");
  }

  await Blog.findByIdAndDelete(req.params.id);

  return res.redirect("/");
});


// ⭐ GET SINGLE BLOG + COMMENTS
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

  res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});


// ⭐ COMMENT ROUTE — fully fixed
router.post('/comment/:blogId', async (req, res) => {

  if (!req.user) {
    return res.redirect('/user/signin');   // must be logged in
  }

  if (!req.body.content || req.body.content.trim() === "") {
    return res.redirect(`/blog/${req.params.blogId}`);  // prevents validation error
  }

  await Comment.create({
    content: req.body.content.trim(),
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});


// ⭐ CREATE BLOG
router.post("/", upload.single('coverImage'), async (req, res) => {
  const { title, body } = req.body;

  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`
  });

  return res.redirect(`/blog/${blog._id}`);
});


export default router;
