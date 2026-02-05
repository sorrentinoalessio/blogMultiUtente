import { tagCreate } from "../services/postService.js";


class TagUtils {
  async createTagUtils(tag) {
    const tags = tag.map(tag => tag.toLowerCase());
    const tagsRepo = await tagCreate(tags);
    const tagUpdate = tagsRepo.map(t => ({ id: t._id.toString(), tag: t.nameTag }));
    return tagUpdate
  }

}

export default new TagUtils();
