import mongoose from 'mongoose';
import { industrySchema } from './schemas/industry.schema.js';

export { industrySchema } from './schemas/industry.schema.js';

export const MongooseIndustry =
  mongoose.models.Industry || mongoose.model('Industry', industrySchema, 'industries');

export default MongooseIndustry;
