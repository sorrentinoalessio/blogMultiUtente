import postRepo from '../repository/PostRepository.js';
import TagUtils from '../../src/utils/TagUtils.js'
import { userLevelScore } from '../services/userService.js';
import { getWeatherForDate } from './weatherService.js';

const WEATHER_CACHE_MS = 30 * 60 * 1000;

const refreshWeatherIfNeeded = async (post) => {
    if (!post) return post;

    const date = String(post.eventDate ?? '').slice(0, 10);
    let latitude = Number(post.latitude);
    let longitude = Number(post.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        const match = String(post.locality ?? '').match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
        if (match) {
            latitude = Number(match[1]);
            longitude = Number(match[2]);
        }
    }
    const appointmentDate = new Date(`${date}T23:59:59`);
    const isCurrentOrFuture = date && !Number.isNaN(appointmentDate.getTime()) && appointmentDate >= new Date();
    const isStale = !post.weatherUpdatedAt || Date.now() - new Date(post.weatherUpdatedAt).getTime() > WEATHER_CACHE_MS;

    if (!isCurrentOrFuture || !Number.isFinite(latitude) || !Number.isFinite(longitude) || !isStale) {
        return post;
    }

    try {
        const weather = await getWeatherForDate({ latitude, longitude, date });
        const updated = await postRepo.updateWeather(post._id, weather);
        return updated ?? { ...post, weather, weatherUpdatedAt: new Date() };
    } catch (error) {
        console.error('Unable to refresh Open-Meteo data:', error.message);
        return post;
    }
};


export const addPost = async (content, userId) => {
    let levelScore = content.levelScore;

    if (!levelScore || levelScore <= 0) {
        try {
            levelScore = await userLevelScore(userId);
        } catch (error) {
            console.error('Unable to load user level score while creating post:', error.message);
            levelScore = 0;
        }
    }

    const post = {
        ...content,
        ownerId: userId,
        levelScore: levelScore
    };

    return await postRepo.add(post);
}

export const tagCreate = async (content) => {
    return postRepo.tag(content);

}

export const getPostById = async (id, userId) => {
    return postRepo.getTagsByPostId(id, userId);
}

export const deletePostById = async (id, userId, idTag) => {
    return postRepo.deleteTagsByPostId(id, userId, idTag);
}

export const getPostsById = async (userId) => {
    return postRepo.getByPostsId(userId);
}

export const getPost = async (id, userId) => {
    return postRepo.getPost(id, userId);
}

export const getPostsPublic = async () => {
    return postRepo.getPostsStatus();
}

export const getPostPublic = async (postId) => {
    const post = await postRepo.getPostStatusDetails(postId);
    return refreshWeatherIfNeeded(post);
}

export const getPostUpdate = async (id, content = {}) => {
    if (Array.isArray(content.tag)) {
        content.tag = await TagUtils.createTagUtils(content.tag)
    } else if (typeof content.tag === 'string') {
        content.tag = await TagUtils.createTagUtils([content.tag])
    }
    return postRepo.patchPost(id, content);
}


