import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
import connectDB from './config/mongodb.js';
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: ['http://localhost:5173'], credentials: true}));

//api endpoints
app.get('/', (req,res)=>{
    res.send("Welcome to my Auth server");
})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, (req, res)=>{
    console.log(`Server started on port ${port}`);
})
