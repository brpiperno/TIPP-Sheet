import express from 'express';
import logRouter from './routes/log.js'

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static('frontend'));

app.use("/api/", logRouter);

app.listen(PORT, () => {
  console.log("Server running in port ", PORT);
})