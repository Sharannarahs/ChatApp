import User from "../models/User.js";
import jwt from 'jsonwebtoken';

// IF USER AUTHENTICATED THEN ONLY HE CAN ACCESS THE API POINT
// MIDDLEWARE TO PROTECT ROUTE

export const protectRoute = async (req, res, next) => {
    try{

        console.log("HEADERS:", req.headers);
        
        // const authHeader = req.headers.authorization;
        //if (!authHeader || !authHeader.startsWith("Bearer ")) {
         //   return res.json({ success: false, message: "Authorization header missing or malformed" });
        //}
        //const token = authHeader.split(" ")[1];

        const token = req.headers.token; // SEND TOKEN FROM FRONTEND IN THE HEADERS
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);
        

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        req.user = user; // now authenticated user access the next controller or middleware

        {/* It adds the logged-in user's information to the request so that other route handlers (that come after this middleware) can access the user without rechecking the token. */}
        
        next();

    } catch (error) {
        console.log(error.message);
        
        res.json({success: false, message: error.message});
    }
}