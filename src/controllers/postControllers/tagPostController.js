
import { getPostById } from '../../services/postService.js';

export const getTag = async (req, res) => {
    const idPost = req.params.id;
     try {
        const listTagByPost = await getPostById(idPost, req.userId);
        res.status(201).json(listTagByPost.tag);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
   