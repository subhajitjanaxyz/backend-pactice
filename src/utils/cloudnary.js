import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME,
        api_key:process.env.API_KEY,
        api_secret: process.env.API_SECRECT
    });

const uploadOnCloudinary= async (localFilePath)=>{
try {
    if(!localFilePath) return null// if file does not exit just return
    //now upload file on cloudinary
   const response=await cloudinary.uploader.upload(localFilePath,{
        resource_type:'auto'
    })
    //file has been uploaded successfully
    console.log("file uploaded successfully"+response.url);
    return response
    
} catch (error) {
    fs.unlinkSync(localFilePath);//remove locally saved temporary file after upload failed
    return null

    
}
}