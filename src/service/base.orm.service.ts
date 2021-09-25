import { Document, Model, Schema } from 'mongoose';

import UserMemberModel from '~src/mongodb/schemas/user-member.schema';

type ObjectId = Schema.Types.ObjectId;

class BaseOrmService {
  // @ts-ignore
  private model: Document & Model;

  constructor(model) {
    this.model = model;
  }

  public async create<T>(data): Promise<T> {
    return this.model.create(data);
  }

  public async createMany<T>(list): Promise<Array<T>> {
    return this.model.insertMany(list);
  }

  public async find<T>(condition = {}, sort = {}, skip: number = 0, limit: number = 0): Promise<T> {
    return this.model
      .find(condition)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  public async findOne<T>(condition = {}): Promise<T> {
    return this.model.findOne(condition).exec();
  }

  public async findById<T>(id: string | ObjectId): Promise<T> {
    return this.model.findById(id);
  }

  public async findByIds<T>(ids: Array<string | ObjectId>): Promise<T> {
    return this.model.find({ _id: { $in: ids } });
  }

  public async findByIdAndUpdate<T>(id: string | ObjectId, data): Promise<T> {
    return this.model.findByIdAndUpdate(id, data);
  }

  public async removeById<T>(id: string | ObjectId, data): Promise<T> {
    return this.model.findByIdAndRemove(id, data);
  }
}

export const userMemberOrmService = new BaseOrmService(UserMemberModel);
