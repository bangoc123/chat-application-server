class User {
  constructor() {
    this.users = [
      {
        email: 'cmc@cmc.com.vn',
        username: 'cmc',
        hashedPassword: '12345',
      },
    ];
  }
  add(user) {
    this.users.push(user);
    return this;
  }

  list() {
    return this.users;
  }

  remove(username) {
    this.users = this.users.filter(item => item.username !== username);
    return this;
  }
}

export default User;

