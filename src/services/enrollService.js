import enrollRepo from '../repository/EnrollRepository.js';

export const addLike = async (content, userId) => {
    content.userId = userId;
    return await enrollRepo.add(content)

}



