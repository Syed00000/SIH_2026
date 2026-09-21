import crypto from 'crypto';

/**
 * Helper to generate unique sequential Industry ID (e.g. IND-2026-0001)
 */
export async function generateNextIndustryId(industryRepository) {
  const year = new Date().getFullYear();
  const count = await industryRepository.count();
  const nextSeq = (count + 1).toString().padStart(4, '0');
  let candidateId = `IND-${year}-${nextSeq}`;

  let exists = await industryRepository.findByIndustryId(candidateId);
  let offset = 1;
  while (exists) {
    const candidateSeq = (count + 1 + offset).toString().padStart(4, '0');
    candidateId = `IND-${year}-${candidateSeq}`;
    exists = await industryRepository.findByIndustryId(candidateId);
    offset++;
  }
  return candidateId;
}

/**
 * Helper to generate cryptographically secure passwords
 */
export function generatePassword(length = 12) {
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
  const numberChars = '23456789';
  const specialChars = '!@#$%^&*';
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  const getRandomChar = (charset) => {
    const randomIndex = crypto.randomInt(0, charset.length);
    return charset.charAt(randomIndex);
  };

  const characters = [
    getRandomChar(uppercaseChars),
    getRandomChar(lowercaseChars),
    getRandomChar(numberChars),
    getRandomChar(specialChars)
  ];

  for (let i = 4; i < length; i++) {
    characters.push(getRandomChar(allChars));
  }

  for (let i = characters.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }

  return characters.join('');
}

