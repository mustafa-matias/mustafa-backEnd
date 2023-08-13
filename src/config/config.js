import dotenv from 'dotenv';

dotenv.config();

export default{
    port: process.env.PORT,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    mongoUrl: process.env.MONGO_URL,
    mongoSecret: process.env.MONGO_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubSecret: process.env.GITHUB_SECRET
}

