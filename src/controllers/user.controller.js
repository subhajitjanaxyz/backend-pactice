import { asyncHandles } from "../utils/asyncHandles.js";



 const registerUser=asyncHandles(async (req,res)=>{
    res.send("chai aur code")
})

export {registerUser};