const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { randomBytes, createHash } = require("crypto");
const User = require("../models/user");
const { sendPasswordResetEmail } = require("../services/email");

const router = Router();

router.get("/signin", (req, res) => {
    res.render("signin", {
        duplicate: req.query.duplicate === "true",
    });
});

router.get("/signup", (req, res) => {
    res.render("signup", {
        notregistered: req.query.notregistered === "true",
    });
});

router.get("/forgot-password", (req, res) => {
    res.render("forgot-password");
});
router.get("/reset-password/:token", async (req, res) => {
    const { token } = req.params;

    try {
        const hashedToken = createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).render("forgot-password", {
                error: "Password reset link is invalid or has expired.",
            });
        }

        return res.render("reset-password", {
            token,
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).render("forgot-password", {
            error: "Something went wrong. Please try again.",
        });
    }
});
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Email does not exist
        if (!user) {
            return res.redirect("/user/signup?notregistered=true");
        }

        // Email exists -> check password
        const token = await User.matchPasswordAndGenerateToken(email, password);

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        }).redirect("/");

    } catch (error) {

        // Password is incorrect
        return res.render("signin", {
            error: "Incorrect Password",
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
		try {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
            	return res.redirect("/user/signin?duplicate=true");
        	}
			await User.create({
				fullName,
				email,
				password,
			});
			return res.redirect("/");
		} catch (error) {
        	console.error("Signup error:", error);
        	return res.status(500).send("Something went wrong");
    	}
	}
);
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render("forgot-password", {
                error: "No account found with this email address.",
            });
        }

        const resetToken = randomBytes(32).toString("hex");

        user.resetPasswordToken = createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetLink =
            `${process.env.APP_URL}/user/reset-password/${resetToken}`;

        await sendPasswordResetEmail(email, resetLink);

        return res.render("forgot-password", {
            success: "Password reset link has been sent to your email.",
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).render("forgot-password", {
            error: "Something went wrong. Please try again.",
        });
    }
});

router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).render("reset-password", {
            token,
            error: "Passwords do not match.",
        });
    }

    try {
        const hashedToken = createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).render("forgot-password", {
                error: "Password reset link is invalid or has expired.",
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.redirect("/user/signin");

    } catch (error) {
        console.error("Update password error:", error);

        return res.status(500).render("reset-password", {
            token,
            error: "Something went wrong. Please try again.",
        });
    }
});

module.exports = router;