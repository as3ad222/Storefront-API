// import { Request } from "express";
// import { verify, JwtPayload, sign } from "jsonwebtoken";

// const secretKey = process.env.TOKEN_SECRET as string;

// function Verify(req:Request, userId?:number){
//     const authorizationHeader = req.headers.authorization;
//     const token = authorizationHeader?.split(' ')[1];
//     const decoded = verify(token as string, process.env.TOKEN_SECRET as string) as JwtPayload;
//     if (userId && decoded.user.userId !== userId) {
//         throw new Error(`User id in not match!`);
//     }
// }

// function Sign(userId: number){
//     return sign({ user: { userId }}, process.env.TOKEN_SECRET as string);
// }

// export {Verify, Sign}


import { Request } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

export default function Authorize(req: Request, user_id: string | null = null) {
	const authorizationHeader = req.headers.authorization;
	const token = authorizationHeader?.split(" ")[1];
	const decoded = verify(token as string, process.env.TOKEN_SECRET as string) as JwtPayload;
	if (user_id && decoded.user.id !== user_id) {
		throw new Error("User id does not match!");
	}
}