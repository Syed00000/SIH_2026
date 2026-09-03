import mongoose from 'mongoose';
import { citizenChallengeSchema } from './schemas/challenge.schema.js';
import { citizenMediaSchema } from './schemas/citizen-media.schema.js';

export { milestoneSchema } from './schemas/milestone.schema.js';
export { citizenChallengeSchema } from './schemas/challenge.schema.js';
export { citizenMediaSchema } from './schemas/citizen-media.schema.js';

export const CitizenChallenge =
  mongoose.models.CitizenChallenge || mongoose.model('CitizenChallenge', citizenChallengeSchema);

export const CitizenMedia =
  mongoose.models.CitizenMedia || mongoose.model('CitizenMedia', citizenMediaSchema);

export default CitizenChallenge;

