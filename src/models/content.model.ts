import mongoose, { Document, Schema } from 'mongoose';
import { ITag } from './tag.model'; 

interface IContent extends Document {
  title: string;
  link: string;
  type: string;
  tags: ITag[];
  userId: mongoose.Types.ObjectId;
}

const contentSchema = new Schema<IContent>({
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

const Content = mongoose.model<IContent>('Content', contentSchema);

export default Content;
export { IContent };
