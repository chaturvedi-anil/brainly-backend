import mongoose, { Document, Schema } from 'mongoose';
import { ITag } from './tag.model';  // Import the ITag interface

interface IContent extends Document {
  title: string;
  link: string;
  type: string;
  tags: ITag[];  // Use the ITag interface for the tags array
  userId: mongoose.Types.ObjectId;
}

const contentSchema = new Schema<IContent>({
  title: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Content = mongoose.model<IContent>('Content', contentSchema);

export default Content;
export { IContent };
