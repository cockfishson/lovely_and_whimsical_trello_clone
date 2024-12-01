import express from "express";
import { connectDB } from "./src/sequalize.js";
import "./src/models/indexModel";
import trelloRouter from "./src/routes/trelloRoutes.js";
import cors from "cors";
import { errorMiddleware } from "./src/middlewares/errorMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/trello",trelloRouter);

app.use(errorMiddleware);
const PORT = process.env.PORT || 3000;

(async () => {
  console.log("ℹ️ Connecting to the database...");
  await connectDB();
  console.log("✅ Database connection established.");
})();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
