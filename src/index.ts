import express, {Request, Response} from "express";
import mongoose from "mongoose";
import { authMiddleware } from "./middleware/auth.middleware";
import { signin, signup } from "./controllers/users.controller";
import { createContent } from "./controllers/content.controllers";

const app = express();

app.use(express.json());

app.get("/ping", (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

app.post("/api/v1/signup", signup);
app.post("/api/v1/signin", signin);


app.post("/api/v1/content", authMiddleware ,createContent);

app.get("/api/v1/content", authMiddleware , (res, req) => {

});

app.delete("/api/v1/content", (res, req) => {

});

app.post("/api/v1/brain/share", (res, req) => {

});

app.get("/api/v1/brain/:shareLink", (res, req) => {

});

const start = async ():Promise<void> => {
    try{
        const db = await mongoose.connect("mongodb://localhost:27017/");
        
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