import { hashPassword } from '../../helper/utils';

class UserService {
  comparePassword(oldPassword, newPassword): boolean {
    return hashPassword(newPassword) === oldPassword;
  }
}

const userService = new UserService();

export default userService;
