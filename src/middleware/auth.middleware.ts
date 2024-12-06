import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../constant";

export const authMiddleware = async (req: Request, res: Response, next:NextFunction ) => {
    try {
        const token = req.headers.token as string;

        const isTokenRight = jwt.verify(token, JWT_KEY) as { id: string };

        if(isTokenRight){
            req.body.id = isTokenRight.id
            next();
        }
    } catch (error: any) {
        res.status(401).json({
            message: "Unautherized",
            error: error.message
        })
        return;
    }
} 