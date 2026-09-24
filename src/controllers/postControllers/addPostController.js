
import { addPost, getPostsById, getPost, getPostsPublic, getPostUpdate ,getPostPublic } from '../../services/postService.js';
import TagUtils from '../../utils/TagUtils.js';
import { getWeatherForDate } from '../../services/weatherService.js';

const getCoordinates = (content) => {
    const latitude = Number(content.latitude ?? content.coordinates?.latitude ?? content.coordinates?.[0]);
    const longitude = Number(content.longitude ?? content.coordinates?.longitude ?? content.coordinates?.[1]);

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude };

    const locality = String(content.locality ?? '');
    const match = locality.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    return match ? { latitude: Number(match[1]), longitude: Number(match[2]) } : null;
};

const addWeatherToPost = async (content) => {
    const coordinates = getCoordinates(content);
    const date = String(content.eventDate ?? '').slice(0, 10);
    if (!coordinates || !date) return content;

    try {
        const weather = await getWeatherForDate({ ...coordinates, date });
        return { ...content, ...coordinates, weather, weatherUpdatedAt: new Date() };
    } catch {
        return { ...content, ...coordinates };
    }
};

export const createPost = async (req, res) => {
    let content = req.body ?? {};
    if (content.tag) {
        content.tag = await TagUtils.createTagUtils(content.tag)
    }

    try {
        content = await addWeatherToPost(content);
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
export const getListPublicPosts = async (req, res) => {
    try {
        const listPostsPublic = await getPostsPublic();
        res.status(201).json(listPostsPublic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getListPublicPost = async (req, res) => {
    const {id} = req.params
    try {
        const listPostPublic = await getPostPublic(id);
        res.status(201).json(listPostPublic);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const updatePost = async (req, res) => {

    const idPost = req.params.id;
    const content = req.body ?? {};

    try {
        const post = await getPostUpdate(idPost, content);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

