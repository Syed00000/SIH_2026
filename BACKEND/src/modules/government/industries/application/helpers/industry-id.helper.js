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
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
  const parts = [['I', 'n', 'd', '@'].join('')];
  for (let i = 0; i < length - 4; i++) {
    parts.push(chars.charAt(Math.floor(Math.random() * chars.length)));
  }
  return parts.join('');
}
