export const asyncHandles=(requestHandler)=>{
    return  (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err) =>next(err ))
    }
}