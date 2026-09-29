import 'dotenv/config';
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import router from './routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan("dev"));

app.use('/api' , router) ;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

export default app;
