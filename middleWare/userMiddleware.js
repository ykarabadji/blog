import jwt from 'jsonwebtoken';

const authMiddleware =(req,res,next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'No token provided' });
      }
   
     const token = authHeader.split(' ')[1]; // Fixed token extraction
     try{
        const decoded = jwt.verify(token,process.env.SECRETKEY);
        req.user = decoded;
        const userId = req.user
        console.log(userId);
        next();
     }catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
}

export default authMiddleware;