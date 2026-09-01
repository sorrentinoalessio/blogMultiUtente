import postRepo from '../repository/PostRepository.js';
import TagUtils from '../../src/utils/TagUtils.js'
import { userLevelScore } from '../services/userService.js';


export const addPost = async (content, userId) => {
    let levelScore = content.levelScore;

    if (!levelScore || levelScore <= 0) {
        levelScore = await userLevelScore(userId);
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
    return postRepo.getPostStatusDetails(postId);
}

export const getPostUpdate = async (id, content = {}) => {
    if (Array.isArray(content.tag)) {
        content.tag = await TagUtils.createTagUtils(content.tag)
    } else if (typeof content.tag === 'string') {
        content.tag = await TagUtils.createTagUtils([content.tag])
    }
    return postRepo.patchPost(id, content);
}


