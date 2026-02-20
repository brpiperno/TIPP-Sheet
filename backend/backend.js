import express from 'express';
import sessionLogRouter from './routes/sessionLogRouter.js'
import authRouter from './routes/authRouter.js'

process.loadEnvFile();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static('frontend'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use("/api/", sessionLogRouter);
app.use("/api/auth", authRouter)
app.use("/api/log", sessionLogRouter);

app.listen(PORT, () => {
  console.log("Server running in port ", PORT);
})