
import { getPostById ,deletePostById } from '../../services/postService.js';

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

export const deleteTag = async (req, res) => {
    const idPost = req.body.postId;
    const userId = req.userId
    const idTag = req.params.id;
     try {
        const listTagByPost = await deletePostById(idPost, userId,idTag);

        res.status(201).json(listTagByPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}