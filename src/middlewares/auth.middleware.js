
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        //get the token 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new apiError(401, "Unauthorized request")
        }
         //verify the token 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    

        //find document and first remove password and refreshTokone field and save to new variable
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new apiError(401, "Invalid Access Token")
        }
    


        //save to req object
        req.user = user;
        next()
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }
    
})