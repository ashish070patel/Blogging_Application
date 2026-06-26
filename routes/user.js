const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
    res.render("signin");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signin", async(req, res) => {
    const { email, password } = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                }).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
        });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
});

router.post("/signup",[
		body("fullName").notEmpty().withMessage("Full name is required"),
		body("email").isEmail().withMessage("Valid email is required"),
		body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("signup", {
				error: errors.array()[0].msg,
			});
		}
		const { fullName, email, password } = req.body;
		await User.create({
			fullName,
			email,
			password,
		});
		return res.redirect("/");
	}
);


module.exports = router;