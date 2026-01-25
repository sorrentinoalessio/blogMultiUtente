import postRepo from '../repository/PostRepository.js';



export const addPost = async (content, userId) => {
    content.ownerId = userId;
    return await postRepo.add(content).catch((err) => {
        return null;
    });
}

export class TagCreate {

    async tagCreate(val) {
        const tag = await postRepository.getTag(val);

    }

}
