import postRepo from '../repository/PostRepository.js';



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

export const getPostsById = async (userId) => {
    return postRepo.getByPostsId(userId);
}

export const getPost = async (id, userId) => {
    return postRepo.getPost(id, userId);
}

export const getPostsPublic = async () => {
    return postRepo.getPostsStatus();
}

export const getPostStatusUpdate = async (id,content) => {
    return postRepo.patchPostStatus(id, content);
}


