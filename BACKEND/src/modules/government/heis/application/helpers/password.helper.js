/**
 * Helper to generate strong readable passwords for universities
 */
export function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const parts = [['H', 'E', 'I', '@'].join('')];
  for (let i = 0; i < length - 4; i++) {
    parts.push(chars.charAt(Math.floor(Math.random() * chars.length)));
  }
  return parts.join('');
}

export default generatePassword;
