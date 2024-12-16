import { Request, Response } from "express";
import { z } from "zod";
import Link from "../models/Link.model";
import { random } from "../utils/utils";
import User from "../models/user.model";
import Content, { IContent } from '../models/content.model';  // Import the IContent type
import Tag, {ITag} from "../models/tag.model";

export const createContent = async (req: Request, res: Response): Promise<void> => {
    try {
        // TODO zod validation for content
        const requiredBody = z.object({
            link: z.string()
                .url({message: "Invalid url"}), 
            type: z.enum(["twitter", "youtube"]),
            
            title: z.string()
                .min(10, {message: "title must be at least 10 character long"})
                .max(100, {message: "title can not be more than 100 character"}),
            tags: z.string()
                .array()
        });

        const parseResult = requiredBody.safeParse(req.body);
        
        if(!parseResult.success) {
            res.status(400).json({
                error: parseResult.error
            })
            return;
        } else {
            const { link, title, type, tags } = parseResult.data;
            
            const tagIds = await Promise.all(
                tags.map( async (tagName) => {
                    const existingTag = await Tag.findOne({tagName: tagName});
                    
                    if(existingTag){
                        return existingTag?._id;
                    } else {
                        const newTag = await Tag.create({tagName: tagName});
                        return newTag?._id;
                    }
                })
            )

            const newContent = await Content.create({
                link: link,
                title: title,
                type: type,
                tags: tagIds,
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
        const { userId } = req.body;

        const contentList = await Content.find({userId: userId})
            .populate("userId", "username")
            .populate("tags", "tagName");
        
        // Map the content list and return only the tagNames for tags
        const modifiedContentList = contentList.map((content) => {
            const tagList = content.tags.map((tag: ITag) => tag.tagName);  // Extract only tagName from tags
            return { ...content.toObject(), tags: tagList };  // Convert content to plain object and update tags
        });

        if(contentList){
            res.status(200).json({
                data: modifiedContentList
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

export const deleteContent = async (req: Request, res:Response): Promise<void> => {
    try {
        const isContentPresent = await Content.findOne({_id: req.params.contentId});
        if(isContentPresent) {
            
            if (isContentPresent.userId.toString() === req.body.userId) {
                const deletedContent = await Content.deleteOne({_id: isContentPresent._id});

                if(deletedContent.deletedCount > 0){
                    res.status(200).json({
                        message: "Content deleted successfully!"
                    })
                    return;
                }
            } else {
                res.status(401).json({
                    message: "You are not autherize for deleting this content"
                })
                return;
            }
        } else {
            res.status(400).json({
                message: `content not found with ${req.params.contentId} id!`
            })
            return;
        }
    } catch (error: any) {
        res.status(500).json({
            error: error.message
        })
        return;
    }
} 

export const createShareLink = async (req: Request, res:Response): Promise<void> => {
    try {
        const {share} = req.body;

        if(share) {
            const existingLink = await Link.findOne({userId: req.body.userId});
            if (existingLink) {
                res.status(200).json({
                    message: "link already exists!",
                    hash: existingLink.hash
                });
                return
            }
            const newHash = random(10);
            const newLink = await Link.create({
                hash: newHash,
                userId: req.body.userId
            });

            if (newLink) {
                res.status(200).json({
                    message: "link created",
                    hash: newLink.hash
                });
                return
            }

        } else {
            
            const existingLink = await Link.deleteOne({userId: req.body.userId});
            
            if (existingLink.deletedCount > 0) {
                res.status(200).json({
                    message: "Removed link"
                });
                return
            } else {
                res.status(200).json({
                    message: "Linked not found!"
                });
                return
            }
        }
    } catch (error:any) {
        res.status(500).json({
            error: error.message
        })
        return;
    }
}

export const getContentByShareableLink = async (req: Request, res:Response) =>{
    try {
        const { shareLink } = req.params;

        const isLinkExist = await Link.findOne({hash: shareLink});
        if (isLinkExist) {
            const exisitingContent = await Content.find({userId: isLinkExist.userId});
            const user = await User.findOne({_id: isLinkExist.userId});

            if (exisitingContent && user) {
                res.status(200).json({
                    username: user.username,
                    content: exisitingContent
                });
                return; 
            }
            
        } else {
            res.status(404).json({
                message: "incorrect Link!"
            })
        }
    } catch (error: any) {
        res.status(500).json({
            error: error.message
        })
        return;
    }
}
