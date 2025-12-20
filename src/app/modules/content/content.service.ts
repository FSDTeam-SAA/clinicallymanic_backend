import AppError from '../../error/appError';
import User from '../user/user.model';
import { IContent } from './content.interface';
import Content from './content.model';

const createContent = async (userId: string, payload: IContent) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const result = await Content.create({ ...payload,createdBy: user._id });
  return result;
};

export const contentService = {
  createContent,
};
