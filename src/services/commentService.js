import commentRepo from '../repository/CommentRepository.js';



export const addComment = async (content, userId) => {
    content.ownerId = userId;
    return await commentRepo.add(content)
    
}

export const listComment = async (userId) => {
        return await commentRepo.list(userId)
    
}



