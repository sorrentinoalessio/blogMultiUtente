
import { getPostById } from '../../services/postService.js';

export const getTag = async (req, res) => {
    const idPost = req.params.id;
    const userId = req.userId
     try {
        const listTagByPost = await getPostById(idPost, userId);

        res.status(201).json(listTagByPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
   