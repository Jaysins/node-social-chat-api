import { Schema, Document, Types } from 'mongoose';

export function addBaseSchemaConfig(schema: Schema) {
  schema.virtual('id').get(function (this: Document & { _id: Types.ObjectId }) {
    return this._id.toHexString();
  });

  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (_doc, ret) {
      delete ret.password;
    }
  });
}
