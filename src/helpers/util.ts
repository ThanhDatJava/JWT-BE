const bcrypt = require('bcrypt');

const saltRounds = 10;

export const hashPasswordHelper = async (
  plainPassword: string,
): Promise<string | null> => {
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    console.error('Error hashing password:', error); // Log the error
    throw new Error('Error hashing password'); // Rethrow the error or handle it as needed
  }
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hashPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error); // Log the error
    return false; // Return false in case of an error (instead of throwing an exception)
  }
};
