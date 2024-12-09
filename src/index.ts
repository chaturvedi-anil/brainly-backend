import express, {Request, Response} from "express";
import mongoose from "mongoose";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.middleware";
import { signin, signup } from "./controllers/users.controller";
import { createContent, getContentList, deleteContent, createShareLink, getContentByShareableLink } from "./controllers/content.controllers";

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}))

app.get("/ping", (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

app.post("/api/v1/signup", signup);
app.post("/api/v1/signin", signin);

app.post("/api/v1/content", authMiddleware ,createContent);
app.get("/api/v1/content", authMiddleware, getContentList);
app.delete("/api/v1/content/:contentId", authMiddleware ,deleteContent);

app.post("/api/v1/brain/share", authMiddleware, createShareLink);
app.get("/api/v1/brain/:shareLink", getContentByShareableLink);

const start = async ():Promise<void> => {
    try{
        const db = await mongoose.connect("mongodb://localhost:27017/brainly");
        
        if(db.connection){
            console.log('Mongoose is connected to the database');
            app.listen(3000, () => {
                console.log(`server is running on port ${3000}`);
            })
        }
    } catch (error) {
        console.error(error)
    }
};


start();