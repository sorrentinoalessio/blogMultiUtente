import NotFoundException from '../exceptions/NotFoundException.js';
import postRepo from '../repository/PostRepository.js';
import { postStatus, userStatus } from '../constants/const.js';


export const addPost = async (content, userId) => {
    content.ownerId = userId;
    return await postRepo.add(content).catch((err) => {
        return null;
    });
}

export const getPostById = async (id, userId) => {
    return await postRepo.getById(id, userId);
}

export const updatePostById = async (id, params, userId) => {
    const post = await postRepo.update(id, params, userId);
    if (!post) {
        throw new NotFoundException(`error: post ${id} not found`)
    }
    return post;
}

export const deletePostById = async (id, userId) => {
    await postRepo.update(id, { status: postStatus.DELETED }, userId);
}

export const getActivities = async (userId, status) => {
    return await postRepo.getManyByUserId(userId, status);
}

export const completePostById = async (id, userId) => {
    const post = await postRepo.complete(id, userId);
    if (!post) {
        throw new NotFoundException(`error: post ${id} not found`)
    }
    return post;
}
export const openPostById = async (id, userId) => {
    const post = await postRepo.open(id, userId);
    if (!post) {
        throw new NotFoundException(`error: post ${id} not found`)
    }
    return post;
}
export const archivedPostById = async (id, userId) => {
    const post = await postRepo.archived(id, userId);
    if (!post) {
        throw new NotFoundException(`error: post ${id} not found`)
    }
    return post;
}

/* 
export const removePostById = async(id) => {
    return await new Promise((resolve, reject) => {
        const readlineInterface = readline.createInterface({
            input: fs.createReadStream(dbFile),
            crlfDelay: Infinity
        });
        const activities = [];
        readlineInterface.on('line', (line) => {
            const post = JSON.parse(line);
            if(post.id != id) {
                activities.push(JSON.stringify(post) + '\n');
            }
        });
        readlineInterface.on('close', () => {
            fs.writeFile(dbFile, activities.join(''), (err) => {
                if (err) {
                    reject(null);
                }
            resolve({id})
            });
        })
    })
}
*/