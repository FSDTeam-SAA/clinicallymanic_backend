import pagination, { IOption } from '../../helper/pagenation';
import { IContact } from './contact.interface';
import Contact from './contact.model';

const createContact = async (payload: IContact) => {
  const result = await Contact.create(payload);
  return result;
};

const getAllContacts = async (pramas: any, options: IOption) => {
  const { limit, page, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = pramas;

  const andCondition: any[] = [];
  const userSearchableFields = [
    'name',
    'email',
    'phoneNumber',
    'subject',
    'message',
  ];
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

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Contact.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit)
    .exec();
  const total = await Contact.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleContact = async (id: string) => {
  await Contact.updateOne({ _id: id }, { $set: { isRead: true } });
  const result = await Contact.findById(id);
  return result;
};

const updateContact = async (id: string, payload: IContact) => {
  const result = await Contact.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteContact = async (id: string) => {
  const result = await Contact.deleteOne({ _id: id });
  return result;
};

export const contactService = {
  createContact,
  getAllContacts,
  getSingleContact,
  updateContact,
  deleteContact,
};
