import { Request, Response } from "express";
import { z } from "zod";
import brcypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { JWT_KEY } from "../constant";

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const requireBody = z.object({
            username: z.string()
                .min(5, {message: "username must be at least 5 charecter long"})
                .max(100, {message: "username must be at most 100 charecter long"}),
            
            password: z.string()
                .min(5, {message: "password must be at least 5 charecter long"})
                .max(16, {message: "password must be at most 16 charecter long"}),

        })

        const parseResult = requireBody.safeParse(req.body);

        if(!parseResult.success) {
            res.status(411).json({
                error:  parseResult.error.errors 
            })
            return;
        } else {
            const {username, password} = req.body;
            const isEmailPresent = await User.findOne({username: username});

            if(isEmailPresent){
                res.status(409).json({
                    message: `User with ${username} username already exists!`
                })
                return;
            } else {
                const hashPassword = await brcypt.hash(password, 10);

                const newUser = await User.create({
                    username: username,
                    password: hashPassword
                });

                if(newUser){
                    res.status(200).json({
                        message: `Signup completed successfully`
                    })
                    return;
                }
            }
        }

    } catch (error: any) {
        res.status(500).json({
            error: error.message
        });
        return;
    }
}   


export const signin = async (req: Request, res: Response): Promise<void> => { 
    try {
        const requireBody = z.object({
            username: z.string()
                .min(5, {message: "username must be at least 5 charecter long"})
                .max(100, {message: "username must be at most 100 charecter long"}),

            password: z.string()
                .min(5, {message: "password must be at least 5 charecter long"})
                .max(16, {message: "password must be at most 16 charecter long"}),
            
        })

        const parseResult = requireBody.safeParse(req.body);
        if(!parseResult.success){
            res.status(400).json({
                message: "bad request"
            });
            return;
        } else {
            const {username, password} = req.body;

            const isUserPresent = await User.findOne({username: username});

            if (!isUserPresent) {
                res.status(400).json({
                    message: "username or password is wrong!"
                });
                return;
            } else {
                const isPasswordMatched = await brcypt.compare(password, isUserPresent.password);

                if(isPasswordMatched){
                    const token = await jwt.sign({
                        id: isUserPresent._id,
                    }, JWT_KEY, {expiresIn: "15d"});

                    res.status(200).json({
                        message: "Signin completed successfully",
                        token: token,
                    });
                    return;
                } else {
                    res.status(401).json({
                        message: "Unautherized"
                    })
                    return;
                }
                
            }
        }
    } catch (error: any) {
        res.status(500).json({
            error: error.message
        })
        return;
    }
} 