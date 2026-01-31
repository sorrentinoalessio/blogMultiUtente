import { postStatus } from '../constants/const.js';
import MongoInternalException from '../exceptions/MongoInternalException.js';
import postSchema from "../schemas/postSchema.js";
import tagSchemas from "../schemas/tagSchema.js";


class PostRepository {
    async add(content) {
        const res = await postSchema.create(content).catch((err) => {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        });
        return res.toObject();
    }

    async tag(listTag) {
        try {
            const tagExisting = await tagSchemas.find({ // cerca quelli che sono presenti nel database
                nameTag: { $in: listTag }
            });

            const nameTags = tagExisting.map(t => t.nameTag);// estrai i nomi dei tag esistenti
            // 2. crea solo quelli mancanti
            const toCreate = listTag.filter(tag => !nameTags.includes(tag)).map(tag => ({ nameTag: tag }));//

            if (toCreate.length) {
                await tagSchemas.insertMany(toCreate, { ordered: false });
            }

            // 3. ritorna TUTTI i tag
            return await tagSchemas.find({
                nameTag: { $in: listTag }
            });

        } catch (err) {
            throw new MongoInternalException(
                `something went wrong: ${err.message}`,
                err.code
            );
        }
    }


    async getTagsByPostId(id, userId) {
        const post = await postSchema.findOne({ _id: id, ownerId: userId });
        if (!post) {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        }

        const tagsByPost = post.tag.map(t => ({ tag: t.tag, _id: t._id }));
        return tagsByPost;
    }


    async getByPostsId(userId) {
        const post = await postSchema.find({ ownerId: userId });
        return post;
    }

    async getPost(id, userId) {
        const post = await postSchema.findOne({ _id: id, ownerId: userId });
        return post;
    }

    async getPostsStatus() {
        const posts = await postSchema.find({ status: postStatus.PUBLIC });
        return posts.map((item) => item.toObject());
    }


    async patchPostStatus(id, userId, content) {
        const post = await postSchema.findOneAndUpdate({ _id: id, ownerId: userId }, { $set: { status: content.status } }, { new: true });
        return post;
    }




}
export default new PostRepository();



/*  async tag(listTag) {
        const result = [];
        try {
            for (const content of listTag) {

                let res = await tagSchemas.findOne({ content });
                if (!res) {
                    res = await tagSchemas.create({ content });
                }
                result.push(res.toObject());
            } return result;

        } catch (err) {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        }

    }

}

export default new PostRepository();*/
