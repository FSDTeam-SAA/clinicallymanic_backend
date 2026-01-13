import mongoose, { Schema } from 'mongoose';
import { IContent } from './content.interface';

const contentSchema = new Schema<IContent>(
  {
    category: {
      type: String,
      required: true,
      index: true,
    },

    contentType: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    thumbnail: String,

    body: String,

    media: [
      {
        type: {
          type: String,
          required: true,
        },
        data: {
          type: Schema.Types.Mixed,
          required: true,
        },
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    strict: false, 
    minimize: false,
  },
);

const Content = mongoose.model<IContent>('Content', contentSchema);

export default Content;
