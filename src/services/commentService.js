import commentRepo from '../repository/CommentRepository.js';



export const addComment = async (content, userId) => {
    content.ownerId = userId;
    console.log(content)
    return await commentRepo.add(content)
    
}



