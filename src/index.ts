import express, {Request, Response} from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Validation with Zod 👊" });
});
app.post("/api/v1/signup", (res, req) => {

});

app.post("/api/v1/signin", (res, req) => {

});

app.post("/api/v1/content", (res, req) => {

});

app.get("/api/v1/content", (res, req) => {

});

app.delete("/api/v1/content", (res, req) => {

});

app.post("/api/v1/brain/share", (res, req) => {

});

app.get("/api/v1/brain/:shareLink", (res, req) => {

});

const start = ():void => {
    try{
        app.listen(3000, () => {
            console.log(`server is running on port ${3000}`);
        })
    } catch (error) {
        console.error(error)
    }
};


start();