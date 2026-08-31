import mongoose from 'mongoose';
import { universitySchema } from './schemas/university.schema.js';

export { universitySchema } from './schemas/university.schema.js';

export const MongooseUniversity =
  mongoose.models.University || mongoose.model('University', universitySchema, 'universities');

export default MongooseUniversity;
