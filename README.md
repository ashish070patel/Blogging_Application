📝 Blogify — Blogging Application

A full-stack blogging platform built with Node.js, Express, MongoDB, and EJS — where users can create, read, and manage blog posts with a clean and responsive UI.

🔗 Live Demo: http://blogify-env-1.eba-r7yn3bmv.ap-south-1.elasticbeanstalk.com/
📁 Repository: https://github.com/ashish070patel/Blogging_Application


🚀 Features


🔐 User Authentication with JWT (Sign up / Sign in / Sign out)
✍️ Create, view, and manage blog posts
🖼️ Image upload support via Multer
📱 Responsive UI with Bootstrap 5
🧩 Templating with EJS
✅ Form validation using express-validator
🍪 Cookie-based session management
☁️ Deployed on AWS Elastic Beanstalk



🛠️ Tech Stack
| Layer       | Technology                         |
| ----------- | ---------------------------------- |
| Runtime     | Node.js                            |
| Framework   | Express.js v5                      |
| Database    | MongoDB (via Mongoose)             |
| Templating  | EJS                                |
| Auth        | JWT (jsonwebtoken) + cookie-parser |
| File Upload | Multer                             |
| Validation  | express-validator                  |
| Styling     | Bootstrap 5                        |
| Dev Tool    | Nodemon                            |
| Deployment  | AWS Elastic Beanstalk (ap-south-1) |

📁 Project Structure

Blogging_Application/
├── middlewares/        # Custom middleware (auth guards, etc.)
├── models/             # Mongoose schemas (User, Blog, etc.)
├── public/             # Static assets (CSS, JS, images)
├── routes/             # Express route handlers
├── services/           # Business logic / service layer
├── views/              # EJS templates
├── app.js              # Application entry point
├── package.json
└── .gitignore


⚙️ Getting Started

Prerequisites


Node.js (v18+ recommended)
MongoDB (local or Atlas)


Installation

bash# Clone the repository
git clone https://github.com/ashish070patel/Blogging_Application.git
cd Blogging_Application

# Install dependencies
npm install

Environment Variables

Create a .env file in the root directory:

envPORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Running the App

bash# Development (with hot reload)
npm run dev

# Production
npm start

The app will be available at http://localhost:8080.


📦 Dependencies

json{
  "express": "^5.2.1",
  "mongoose": "^9.3.3",
  "ejs": "^5.0.1",
  "jsonwebtoken": "^9.0.3",
  "cookie-parser": "^1.4.7",
  "multer": "^2.1.1",
  "express-validator": "^7.3.2",
  "dotenv": "^17.4.2",
  "bootstrap": "^5.3.8"
}


☁️ Deployment

This app is deployed on AWS Elastic Beanstalk in the ap-south-1 (Mumbai) region.

To deploy your own instance:


Install the AWS EB CLI
Initialize and configure your environment:


bash   eb init
   eb create
   eb deploy


Set environment variables via the Elastic Beanstalk console under Configuration → Software.

📄 License

This project is licensed under the ISC License.
