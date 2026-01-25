
import { addPost, tagCreate } from '../../services/postService.js';

export const add = async (req, res) => {
    const content = req.body;
    let tags = []
    if (content.tag) {
        tags = content.tag.map(tag => tag.toLowerCase());
        const tagsRepo = await tagCreate(tags);
        content.tag = tagsRepo.map(t => t.nameTag);
    } 
    
    try {
        const post = await addPost(content, req.userId);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
