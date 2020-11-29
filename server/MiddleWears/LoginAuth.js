module.exports = (req,res,next)=>{
    //the req header would contain the jwt access token
    const authHeader = req.header('Authorization');
    console.log(`The auth head is ${authHeader}`);
    next();
}