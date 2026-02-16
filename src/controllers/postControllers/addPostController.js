
import { addPost, getPostsById, getPost, getPostsPublic, getPostStatusUpdate } from '../../services/postService.js';
import TagUtils from '../../utils/TagUtils.js';

export const createPost = async (req, res) => {
    const content = req.body;
    if (content.tag) {
        content.tag = await TagUtils.createTagUtils(content.tag)
    }

    try {
        const post = await addPost(content, req.userId);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getPosts = async (req, res) => {
    try {
        const listPost = await getPostsById(req.userId);
        res.status(201).json(listPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
export const getPostByIdPostAndUserId = async (req, res) => {
    const idPost = req.params.id;
    try {
        const post = await getPost(idPost, req.userId);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
export const getListPublicPost = async (req, res) => {
    try {
        const listPostPublic = await getPostsPublic();
        res.status(201).json(listPostPublic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const updatePostStatus = async (req, res) => {

    const idPost = req.params.id;
    const content = req.body;

    try {
        const post = await getPostStatusUpdate(idPost, content);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

