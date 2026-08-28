const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendPasswordResetEmail(email, resetLink) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Your Password",
        html: `
            <h2>Password Reset</h2>

            <p>You requested to reset your password.</p>

            <p>Click the button below to reset your password:</p>

            <a href="${resetLink}"
                style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #0d6efd;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                ">
                Reset Password
            </a>

            <p>This link will expire in 15 minutes.</p>

            <p>If you did not request a password reset, you can ignore this email.</p>
        `,
    });
}

module.exports = {
    sendPasswordResetEmail,
};