import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import sendMailer from '../../helper/sendMailer';
import Newsletter from './newsletter.model';

const createNewsletter = async (email: string) => {
  const result = await Newsletter.create(email);
  return result;
};

const getAllNewsletters = async (prams: any, options: IOption) => {
  const { page, limit, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filtersData } = prams;
  const andCondition: any[] = [];
  const userSearchableFields = ['email'];
  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }
  if (Object.keys(filtersData).length > 0) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Newsletter.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(page)
    .limit(limit);

  const total = await Newsletter.countDocuments(whereCondition);

  return { data: result, meta: { page, limit, total } };
};

const getSingleNewsletter = async (id: string) => {
  const result = await Newsletter.findById(id);
  return result;
};

const updateNewsletter = async (id: string, payload: any) => {
  const result = await Newsletter.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteNewsletter = async (id: string) => {
  const result = await Newsletter.findByIdAndDelete(id);
  return result;
};

const broadcastNewsletter = async (payload: {
  subject?: string;
  html?: string;
}) => {
  const { subject, html } = payload;

  if (!subject?.trim() || !html?.trim()) {
    throw new AppError(400, 'Subject and HTML content are required');
  }

  const subscribers = await Newsletter.find();
  if (!subscribers.length) {
    throw new AppError(404, 'No newsletter subscribers found');
  }

  await Promise.all(
    subscribers.map((sub) =>
      sendMailer(sub.email, subject, html).catch((err) =>
        console.error(`❌ Failed to send email to ${sub.email}:`, err),
      ),
    ),
  );

  return { sentCount: subscribers.length };
};

export const newsletterService = {
  createNewsletter,
  getAllNewsletters,
  getSingleNewsletter,
  updateNewsletter,
  deleteNewsletter,
  broadcastNewsletter,
};
