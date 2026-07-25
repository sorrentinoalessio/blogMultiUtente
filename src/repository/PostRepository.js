import { postStatus } from '../constants/const.js';
import MongoInternalException from '../exceptions/MongoInternalException.js';
import postSchema from "../schemas/postSchema.js";
import tagSchemas from "../schemas/tagSchema.js";
import commentSchema from "../schemas/commentSchema.js";
import likeSchema from "../schemas/likeSchema.js";
import userSchema from "../schemas/userSchema.js";


class PostRepository {
    async add(content) {
        const res = await postSchema.create(content).catch((err) => {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        });
        return res.toObject();
    }

    async tag(listTag) {
        try {
            const tagExisting = await tagSchemas.find({ nameTag: { $in: listTag } });
            const nameTags = tagExisting.map(t => t.nameTag);// estrai i nomi dei tag esistenti
            // 2. crea solo quelli mancanti
            const toCreate = listTag.filter(tag => !nameTags.includes(tag)).map(tag => ({ nameTag: tag }));//
            if (toCreate.length) {
                await tagSchemas.insertMany(toCreate, { ordered: false });
            }
            // 3. ritorna TUTTI i tag
            return await tagSchemas.find({ nameTag: { $in: listTag } });
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

    async deleteTagsByPostId(postId, userId, idTag) {
        const post = await postSchema.findOneAndUpdate({ _id: postId.toString(), ownerId: userId }, { $pull: { tag: { _id: idTag } } }, { new: true });
        if (!post) {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        }
        return post;
    }

    async getByPostsId(userId) {
        const posts = await postSchema.find({ ownerId: userId });
        const postIds = posts.map((p) => p._id);

        // commenti
        const comments = await commentSchema.find({ postId: { $in: postIds } });
        const commentOwnerIds = comments.map((c) => c.ownerId);
        const commentOwners = await userSchema
            .find({ _id: { $in: commentOwnerIds } })
            .select("name");
        const commentOwnerMap = new Map(
            commentOwners.map((o) => [o._id.toString(), o.name])
        );

        // likes
        const likesdocs = await likeSchema.find({ postId: { $in: postIds } });
        const likesMap = new Map(likesdocs.map((l) => [l.postId.toString(), l]));

        return posts.map((item) => {
            const likeDoc = likesMap.get(item._id.toString());
            return {
                ...item.toObject(),
                comments: comments
                    .filter((c) => c.postId.toString() === item._id.toString())
                    .map((c) => ({
                        ...c.toObject(),
                        authorName: commentOwnerMap.get(c.ownerId?.toString()) ?? "Utente",
                    })),
                likes: likeDoc?.likes ?? [],
                likesCount: likeDoc?.likes?.length ?? 0,
            };
        });
    }

    async getPost(id, userId) {
        const post = await postSchema.findOne({ _id: id, ownerId: userId });
        return post;
    }

    async getPostsStatus() {
        const posts = await postSchema.find({ status: postStatus.PUBLIC });
        const postIds = posts.map((p) => p._id);

        // owner names
        const owners = await userSchema
            .find({ _id: { $in: posts.map((p) => p.ownerId) } })
            .select("name");
        const ownerMap = new Map(owners.map((o) => [o._id.toString(), o.name]));

        // commenti
        const comments = await commentSchema.find({ postId: { $in: postIds } });
        const commentOwnerIds = comments.map((c) => c.ownerId);
        const commentOwners = await userSchema
            .find({ _id: { $in: commentOwnerIds } })
            .select("name");
        const commentOwnerMap = new Map(
            commentOwners.map((o) => [o._id.toString(), o.name])
        );

        // likes
        const likesdocs = await likeSchema.find({ postId: { $in: postIds } });
        const likesMap = new Map(likesdocs.map((l) => [l.postId.toString(), l]));

        // ← mancava questo
        return posts.map((item) => {
            const likeDoc = likesMap.get(item._id.toString());
            return {
                ...item.toObject(),
                ownerName: ownerMap.get(item.ownerId.toString()) ?? null,
                comments: comments
                    .filter((c) => c.postId.toString() === item._id.toString())
                    .map((c) => ({
                        ...c.toObject(),
                        authorName: commentOwnerMap.get(c.ownerId?.toString()) ?? "Utente",
                    })),
                likes: likeDoc?.likes ?? [],
                likesCount: likeDoc?.likes?.length ?? 0,
            };
        });
    }

    async getPostStatusDetails(postId) {
        const [post, comments, likes] = await Promise.all([
            postSchema.findOne({ _id: postId, status: postStatus.PUBLIC }),
            commentSchema.find({ postId: postId }),
            likeSchema.findOne({ postId: postId })
        ]);
        if (!post) {
            return null;
        }
        return { ...post.toObject(), comments: comments.map(c => c.toObject()), likes: likes ? likes.toObject() : { likes: [], likesCount: 0 } };
    }


    async patchPost(id, content) {
        const post = await postSchema.findOneAndUpdate({ _id: id, }, { $set: { status: content.status, title: content.title, description: content.description, tag: content.tag }, }, { new: true });
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
