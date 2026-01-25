import postRepo from '../repository/PostRepository.js';



export const addPost = async (content, userId) => {
    content.ownerId = userId;
    return await postRepo.add(content).catch((err) => {
        return null;
    });
}

export const tagCreate = async (content) => {
    return postRepo.tag(content);

}
