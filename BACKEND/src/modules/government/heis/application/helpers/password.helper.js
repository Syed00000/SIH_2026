/**
 * Helper to generate strong readable passwords for universities
 */
export function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let pwd = 'HEI@';
  for (let i = 0; i < length - 4; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

export default generatePassword;
