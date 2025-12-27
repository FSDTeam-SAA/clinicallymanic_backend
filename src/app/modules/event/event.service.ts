import pagination, { IOption } from '../../helper/pagenation';
import User from '../user/user.model';
import { IEvent } from './event.interface';
import Event from './event.model';

const createEvent = async (userId: string, payload: IEvent) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const result = await Event.create({ ...payload, createdBy: user._id });
  return result;
};

const getAllEvents = async (params: any, options: IOption) => {
  const { limit, page, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = ['title', 'description', 'location', 'status'];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const query = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Event.find(query)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email');

  const total = await Event.countDocuments(query);

  return { data: result, meta: { page, limit, total } };
};

const singleEvent = async (id: string) => {
  const result = await Event.findById(id).populate('createdBy', 'name email');
  return result;
};

const updateEvent = async (id: string, payload: Partial<IEvent>) => {
  const result = await Event.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteEvent = async (id: string) => {
  const result = await Event.findByIdAndDelete(id);
  return result;
};

export const EventService = {
  createEvent,
  getAllEvents,
  singleEvent,
  updateEvent,
  deleteEvent,
};
