import express from "express";
import cors from "cors";
import { connectDB } from "./db/db.js";
import { router } from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
const app = express();
await connectDB();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Hello from Server!!");
});
app.use("/api/v1", router);
app.listen(4000, () => {
    console.log("Server is listening at Port 4000");
});
//# sourceMappingURL=app.js.map