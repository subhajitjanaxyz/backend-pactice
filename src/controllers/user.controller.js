import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandles } from "../utils/asyncHandles.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
//genarate accessToken and Refresh Token function 
//take _id as paramiter 
const generateAccessAndRefereshTokens=async(userId)=>{
try {
    //find document by _id:
    const user = await User.findById(userId);
    //generate token 
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    //save token
    
    //modify value of refreshToken key
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return {accessToken, refreshToken}


    
} catch (error) {
    throw new apiError(500,"Something went wrong while generating referesh and access token")
}



}


 const registerUser=asyncHandles(async (req,res)=>{
 //step1 : get data from client
 const {username,email,password,fullName}=req.body
 //step 2: check data is valid or not and thorw a error
 console.log(req.body)


 if(
    [username,email,password,fullName].some((field)=>{
    return  field?.trim()===""
    })
 ){throw new apiError(400,"All field are required")

 }
//step 3:check user and email already exits ?

const existedUser=await User.findOne({
    $or:[
        {username},{email}
    ]  
})

if(existedUser){
    throw new apiError(409,"user with email or username already exits ")
}


//step 4:check avtar 

const avatarLocalPath=req.files?.avatar[0]?.path;
let coverImageLocalPatha;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.lenght>0  ){

    coverImageLocalPatha=req.files?.coverImage[0]?.path;

}


if(!avatarLocalPath){
    throw new apiError(400,"avatar file required")
} 


//step 5:uplaod on cloudinary

const avatar= await uploadOnCloudinary(avatarLocalPath)
const coverImage= await uploadOnCloudinary(coverImageLocalPatha)
console.log(avatar)



// step 6: check avatar is uploaded or not ?
if(!avatar){
    throw new apiError(400,"avatar file required")
} 



// step 7:create user  on database


const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),

})



//step 8: (i) check user is created (ii) remove password & refresh token feild then send as a res
const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
)
if(!createdUser){
    throw new apiError(500,"something went wrong while register the user")
}
//send response to client
return res.status(201).json(
    new ApiResponse(200,createdUser,"create user successfully")
)



})


//login controler
const loginUser= asyncHandles(async(req,res)=>{
//get data from ui
const  {email, username, password}=req.body
//check data is empty or not
if(!email && !username){
    throw new apiError(400, "username or email is required")
}
//user is exist
const user = await User.findOne({

    $or: [{username:"admin"}, {email:"admin"}]
})

if (!user) {
    throw new apiError(404, "User does not exist")
}
//check password is correct
const isPasswordValid = await user.isPasswordCorrect(password)
if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials")
    }
//genarate acesstoken and refreshtoken
const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

//store data for send to browser
const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//for cookies
const options = {
    httpOnly: true,
    secure: true
}
//send response 


return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
    new ApiResponse(
        200, 
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
    )
)


})
//log out user
const logoutUser = asyncHandles(async(req, res) => {
    await User.findByIdAndUpdate(
        //get _Id (its set by verifyJWT)
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            //reson : just return new updated value
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


export {registerUser,loginUser,logoutUser};