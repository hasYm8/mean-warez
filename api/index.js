import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import bookRoute from './routes/book.js'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { seedBooksData } from './seed.js';

const app = express();
dotenv.config();
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'];
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'POST,GET,PUT,OPTIONS,DELETE,PATCH'
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false
    }
}));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/book", bookRoute);

app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong";
    return res.status(statusCode).json({
        success: [200, 201, 204].some(a => a === obj.status) ? true : false,
        status: statusCode,
        message: message,
        data: obj.data
    });
});

app.listen(8800, () => {
    connectMongoDB();
    console.log('Connected to backend');
});

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        if (process.argv.includes("--seed")) {
            await seedBooksData();
        }
        console.log("Connected to database");
    } catch (error) {
        throw error;
    }
}