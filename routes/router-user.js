import { Router } from 'express'
import User from '../models/models-user.js'
const router = Router();





import multer from "multer";
import path from "path";

// STORAGE ENGINE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/profile/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


router.get('/signin', (req, res) => {
    return res.render('signin')
})

router.get('/signup', (req, res) => {
    return res.render('signup')
})


router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/")

    } catch (error) {
        res.render("signin", {
            error: "Incorrect Email or Password"
        })
}
})

router.get("/logout",(req,res)=>{
    res.clearCookie('token').redirect("/")
})

router.post('/signup',upload.single("profileImage"), async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
        profileImageURL: req.file 
      ? "/profile/" + req.file.filename 
      : "/images/defaultImg.png",
    });
    return res.redirect("/")
})
router.delete("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!req.user) return res.status(401).send("Unauthorized");

  if (blog.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).send("Forbidden - You cannot delete this blog");
  }

  await Blog.findByIdAndDelete(req.params.id);
  res.redirect("/");
});




export default router;