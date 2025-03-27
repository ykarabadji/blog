
import { PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcryptjs';
import { userInfo } from 'os';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Register route
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  

  try {
    // Check if user already exists by email
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: 'User registered successfully',
      newUser: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Failed to register user:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});
 //// LOGIN AUTH SYSTEM 
router.post('/login', async (req,res)=>{
  const {email,password} = req.body;

  try{
    
    const  userExist = await prisma.user.findUnique({

      where:{
        email : email,
        
      }
    })
    
    if(userExist){
      const isMatch = await bcrypt.compare(password,userExist.password)
      if(!isMatch){
         return res.status(401).json({message: ' user  password not correct '});
      }
      const token = jwt.sign({userId: userExist.id,email:userExist.email},process.env.SECRETKEY, {expiresIn:'1h'});
       res.status(201).json({ message: 'Login successful', token });

    }else{
      return res.status(404).json({ message: 'User not found' });
    }
  }catch(error){
    return res.status(404).json({message: ' error unknown in asigning the token '});
  }
})

export default router;
