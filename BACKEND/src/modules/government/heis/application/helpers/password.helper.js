import crypto from 'crypto';

/**
 * Helper to generate strong readable passwords for universities
 */
export function generatePassword(length = 10) {
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
  const numberChars = '23456789';
  const specialChars = '!@#$%';
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

export default generatePassword;

