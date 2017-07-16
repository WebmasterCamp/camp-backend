import { Unique } from '../models';
import randomstring from 'randomstring';

export const generateUniqueString = async (len = 8) => {
  const string = randomstring.generate(len);
  const found = await Unique.findOne({ string });
  if (found) return await generateUniqueString(len);
  const unique = new Unique({ string });
  await unique.save();
  return string;
};
