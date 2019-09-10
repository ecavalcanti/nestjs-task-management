import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
  });

  describe('Validate password', () => {
    it('returns true as password is valid', async () => {
      Object.defineProperty(bcrypt, 'compare', { value: jest.fn().mockReturnValue(true) });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.validadePassword('123456');
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'testPassword');
      expect(result).toEqual(true);
    });
    it('returns false as password is invalid', async () => {
      Object.defineProperty(bcrypt, 'compare', { value: jest.fn().mockReturnValue(false) });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.validadePassword('wrongPassword');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'testPassword');
      expect(result).toEqual(false);
    });
  });
});
