import postRepo from '../repository/PostRepository.js';
import TagUtils from '../../src/utils/TagUtils.js'


export const addPost = async (content, userId) => {
    content.ownerId = userId;
    return await postRepo.add(content)
}


export const tagCreate = async (content) => {
    return postRepo.tag(content);

}

export const getPostById = async (id, userId) => {
    return postRepo.getTagsByPostId(id, userId);
}

export const deletePostById = async (id, userId,idTag) => {
    return postRepo.deleteTagsByPostId(id, userId,idTag);
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

export const getPostStatusUpdate = async (id,content) => {
    if (content.tag) {
            content.tag = await TagUtils.createTagUtils(content.tag)
        }
    return postRepo.patchPostStatus(id, content);
}


