
class UserNormalizer {
 get(user) {
    const { name, email , avatar  } = user;
    return { name, email , avatar};
  }

  getUser(user) {
     return this.get(user);
  }
}


export default new UserNormalizer();




