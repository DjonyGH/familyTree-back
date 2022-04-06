import { mongoose } from '@typegoose/typegoose';

export const getObjectIdFromString = (id: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
};
