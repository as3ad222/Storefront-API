import { Request } from "express";
import { verify, JwtPayload, sign } from "jsonwebtoken";

const secretKey = process.env.TOKEN_SECRET as string;

function Verify(req:Request, userId?:number){
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader!.split(' ')[1];
    const decoded = verify(token as string, secretKey) as JwtPayload;
    if (userId && decoded.user.userId !== userId) {
        throw new Error(`User id in not match!`);
    }
}

function Sign(userId: number){
    return sign({ user: { userId }}, secretKey);
}

export {Verify, Sign}
