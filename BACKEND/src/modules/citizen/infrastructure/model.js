import mongoose from 'mongoose';
import { citizenChallengeSchema } from './schemas/challenge.schema.js';

export { milestoneSchema } from './schemas/milestone.schema.js';
export { citizenChallengeSchema } from './schemas/challenge.schema.js';

export const CitizenChallenge =
  mongoose.models.CitizenChallenge || mongoose.model('CitizenChallenge', citizenChallengeSchema);

export default CitizenChallenge;
