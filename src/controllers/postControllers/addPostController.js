
import { addPost } from '../../services/postService.js';

export const add = async (req, res) => {
    const content = req.body;
    try {
        const post = await addPost(content, req.userId);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
