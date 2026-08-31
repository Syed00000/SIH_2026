/**
 * Generates unique challenge tracking code in format CHL-JH-YYYY-XXXX
 */
export function generateChallengeId() {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CHL-JH-${year}-${randomSuffix}`;
}

export default generateChallengeId;
