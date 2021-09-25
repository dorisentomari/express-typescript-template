import { IsEmail, Length } from 'class-validator';

import USER_DTO_ERROR from './user.dto.error';
import IsMatchCustom from '~src/validator/is-match.custom';

const { EMAIL, PASSWORD } = USER_DTO_ERROR;

export class UserLoginDto {
  @IsEmail({}, { message: EMAIL.isEmail })
  public email: string = null;

  @Length(PASSWORD.minLength, PASSWORD.maxLength, {
    message: PASSWORD.length,
  })
  public password: string = null;
}

export class UserRegisterDto extends UserLoginDto {
  @Length(PASSWORD.minLength, PASSWORD.maxLength, {
    message: PASSWORD.length,
  })
  @IsMatchCustom('password', {
    message: PASSWORD.IsMatchCustom,
  })
  public repassword: string = null;
}
