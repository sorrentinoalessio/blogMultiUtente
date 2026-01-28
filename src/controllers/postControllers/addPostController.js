
import { addPost, tagCreate, getPostsById, getPost} from '../../services/postService.js';

export const add = async (req, res) => {
    const content = req.body;
    let tags = []
    if (content.tag) {
        tags = content.tag.map(tag => tag.toLowerCase());
        const tagsRepo = await tagCreate(tags);
        content.tag = tagsRepo.map(t => ({id: t._id, tag: t.nameTag}));
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


