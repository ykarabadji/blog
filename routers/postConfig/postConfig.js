import authMiddleware from '../../middleWare/userMiddleware.js';
import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GETTING POSTS FROM THE DATABASE
router.get('/posts', authMiddleware, async (req, res) => {
    const { userId } = req.user; // Assuming user is added to the request by authMiddleware

    try {
        // Fetch posts for the authenticated user
        const allPosts = await prisma.post.findMany({
            where: {
                userId: userId, // Filter posts by userId
            }
        });

        // If no posts found, send 404
        if (allPosts.length === 0) {
            console.log('No posts found');
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        // Return the posts if found
        return res.status(200).json({ message: 'Posts found successfully', allPosts });

    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Internal server error while fetching posts', error: error.message });
    }
});

// CREATING A NEW POST
router.post('/posts/create', authMiddleware, async (req, res) => {
    console.log('User from middleware:', req.user); // Debugging, can be removed in production

    const { userId } = req.user; // User ID from the authenticated user
    const { title, content } = req.body;

    // Validation: Ensure title and content are provided
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        // Create a new post in the database
        const post = await prisma.post.create({
            data: { userId, title, content }
        });

        // Return the newly created post
        return res.status(201).json({ message: 'Post created successfully', post });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

router.delete('/posts/delete/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Assuming user is correctly attached to req.user by authMiddleware
    const { id } = req.params;  // Get the post id from the URL params

    try {
        // Ensure the post exists before attempting to delete
        const post = await prisma.post.findUnique({
            where: {
                id: id,  // Find the post by id
                userId: userId,  // Ensure it belongs to the current user
            },
        });

        if (!post) {
            // If the post doesn't exist or doesn't belong to the user
            return res.status(404).json({ message: 'Post not found or not authorized' });
        }

        // Proceed with deleting the post if it exists and belongs to the user
        await prisma.post.delete({
            where: {
                id: id,
            },
        });

        return res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
});


// PUT /posts/edit/:id - Edit a post
router.get('/posts/edit/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Assuming user is correctly attached to req.user by authMiddleware
    const { id } = req.params;  // Get the post id from the URL params

    try {
        // Ensure the post exists before attempting to delete
        const post = await prisma.post.findUnique({
            where: {
                id: id,  // Find the post by id
                userId: userId,  // Ensure it belongs to the current user
            },
        });

        if (!post) {
            // If the post doesn't exist or doesn't belong to the user
            return res.status(404).json({ message: 'Post not found or not authorized' });
        }

        // Proceed with deleting the post if it exists and belongs to the user
       
        
        console.log(post);
        return res.status(200).json({ message: 'Post found successfully' ,post});

    } catch (error) {
        console.error('Error edeting  post:', error);
        return res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
});
router.put('/posts/edit2/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Assuming user is correctly attached to req.user by authMiddleware
    const { id } = req.params;  // Get the post id from the URL params
    const {title,content} = req.body
    
    try {
        // Ensure the post exists before attempting to delete
        const post = await prisma.post.update({
            where: {
                id: id,  // Find the post by id
                  // Ensure it belongs to the current user
            },
            data:{
                title : title,
                content : content,
            }
        });

        if (!post) {
            // If the post doesn't exist or doesn't belong to the user
            return res.status(404).json({ message: 'Post not found or not authorized' });
        }

        // Proceed with deleting the post if it exists and belongs to the user
       
        
        console.log(post);
        return res.status(200).json({ message: 'Post found successfully' ,post});

    } catch (error) {
        console.error('Error edeting  post:', error);
        return res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
});
export default router ;