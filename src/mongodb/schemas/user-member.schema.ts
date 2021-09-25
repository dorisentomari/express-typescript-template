import { Schema, model, Document } from 'mongoose';
import { formatDateTime } from 'easybus';

import { IMONGO_TABLE_NAME, commonFields } from '~src/mongodb/types';
import { IUserGender, IUserStatus } from '~src/modules/user/user.types';

export const UserMemberSchema = new Schema(
  {
    nickname: { type: String, required: false },
    avatarUrl: { type: String, required: false },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    gender: { type: String, required: false },
    password: { type: String, required: true },
    status: { type: String, required: false },
    ...commonFields,
  },
  {
    toObject: {
      transform(doc, ret) {
        ret.createTime = formatDateTime(ret.createTime);
        ret.updateTime = formatDateTime(ret.updateTime);
        delete ret.__v;
        delete ret.password;
      },
    },
  },
);

export interface IUserMember extends Document {
  nickname?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  gender?: IUserGender;
  password?: string;
  status?: IUserStatus;
}

const UserMemberModel = model<IUserMember>(IMONGO_TABLE_NAME.UserMember, UserMemberSchema);

export default UserMemberModel;
