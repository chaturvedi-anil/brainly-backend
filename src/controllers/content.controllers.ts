import { Request, Response } from "express";
import Content from "../models/content.model";

export const createContent = async (req: Request, res: Response): Promise<void> => {
    try {
        // TODO zod validation for content
        const {link, type, title, tags} = req.body;

        const newContent = await Content.create({
            link: link,
            title: title,
            type: type,
            userId: req.body.userId,
        })

        if(newContent){
            res.status(201).json({
                message: "content is created successfully!"
            });
            return;
        }

    } catch (error: any) {
        res.status(500).json({
            error: error.message
        })
        return;
    }
} 

export const getContentList = async (req: Request, res: Response): Promise<void> => {
    try {
        // TODO zod validation for content
        const {userId} = req.body;

        const contentList = await Content.find({userId: userId});

        if(contentList){
            res.status(200).json({
                data: contentList
            });
            return;
        }

    } catch (error: any) {
        res.status(500).json({
            error: error.message
        })
        return;
    }
} 