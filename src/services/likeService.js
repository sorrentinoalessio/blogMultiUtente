import likeRepo from '../repository/LikeRepository.js';



export const addLike = async (content, userId) => {
    content.userId = userId;
    return await likeRepo.add(content)
    
}



