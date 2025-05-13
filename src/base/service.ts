import { Model, Document } from 'mongoose';

export abstract class BaseService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return await document.save();
  }

  public async getById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  public async getAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  public async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  public async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
