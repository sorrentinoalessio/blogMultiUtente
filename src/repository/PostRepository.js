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
            // 1. trova i tag esistenti
            const existing = await tagSchemas.find({
                nameTag: { $in: listTag }
            });

            const existingContents = existing.map(t => t.nameTag);

            // 2. crea solo quelli mancanti
            const toCreate = listTag.filter(tag => !existingContents.includes(tag)).map(tag => ({ nameTag: tag }));

            if (toCreate.length) {
                await tagSchemas.insertMany(toCreate, { ordered: false });
            }

            // 3. ritorna TUTTI i tag
            return tagSchemas.find({
                nameTag: { $in: listTag }
            });

        } catch (err) {
            throw new MongoInternalException(
                `something went wrong: ${err.message}`,
                err.code
            );
        }
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
