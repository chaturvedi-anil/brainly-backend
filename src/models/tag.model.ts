import mongoose, { Document, Schema } from 'mongoose';

interface ITag extends Document {
  tagName: string;
}

const tagSchema = new Schema<ITag>({
  tagName: { type: String, required: true, unique: true },
});

const Tag = mongoose.model<ITag>('Tag', tagSchema);

export default Tag;
export { ITag };
