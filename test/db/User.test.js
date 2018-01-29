import { expect } from 'chai';
import User from './../../db/User';

describe('User', () => {
  describe('add', () => {
    it('should update users list after add successfully', () => {
      const users = new User();
      const newUser = {
        username: 'ngoc',
        email: 'ngoc@gmail.com',
        hashedPassword: '123444',
      };
      users.add(newUser);
      expect(users.users.length).to.equal(2);
      expect(users.users[users.users.length - 1].email).to.equal('ngoc@gmail.com');
      expect(users.users[users.users.length - 1]).deep.equal(newUser);
    });
  });
});
