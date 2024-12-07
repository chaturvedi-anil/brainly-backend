import { Request, Response } from "express";
import { z } from "zod";
import Content from "../models/content.model";

export const createContent = async (req: Request, res: Response): Promise<void> => {
    try {
        // TODO zod validation for content
        const requiredBody = z.object({
            link: z.string()
                .url({message: "Invalid url"}), 
            type: z.enum(["image", "video", "article", "audio"]),
            
            title: z.string()
                .min(10, {message: "title must be at least 10 character long"})
                .max(100, {message: "title can not be more than 100 character"}),
        });

        const parseResult = requiredBody.safeParse(req.body);
        
        if(!parseResult.success) {
            res.status(400).json({
                error: parseResult.error
            })
            return;
        } else {
            const { link, title, type } = req.body;
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