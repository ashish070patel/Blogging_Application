const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});
const upload = multer({ storage: storage });

// --- Routes ---

// Render the "Add Blog" page
router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});

// View a specific blog and its comments
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        if (!blog) {
            return res.status(404).send("Blog not found");
        }
        const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
        return res.render("blog", {
            user: req.user,
            blog,
            comment: comments,
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).send("Internal Server Error"); 
    }
});

// Post a comment on a blog
router.post("/comment/:blogId", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("You must be logged in to comment.");
        }
        await Comment.create({
            comment: req.body.content,
            blogId: req.params.blogId,
            createdBy: req.user._id,
        });
        return res.redirect(`/blog/${req.params.blogId}`);
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Create a new blog
router.post("/", upload.single("coverImage"), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("You must be logged in to create a blog.");
        }
        const { title, body } = req.body;
        let coverImageURL = "";
        if (req.file) {
            coverImageURL = `/uploads/${req.file.filename}`;
        }
        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageURL,
        });
        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Delete a blog (Authorized for creator only)

router.post("/delete/:id", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("You must be logged in to do this.");
        }
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }
        // Authorization Check: Compare creator ID with logged-in user ID
        if (blog.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).send("Unauthorized: You can only delete your own blogs.");
        }
        // Delete the blog and its associated comments
        await Blog.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ blogId: req.params.id });
        return res.redirect("/"); 
    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;