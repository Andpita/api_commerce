import { compare, hash } from 'bcrypt';

export const createHashPassword = async (password: string): Promise<string> => {
  return hash(password, 8);
};

export const decrypt = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return compare(password, passwordHash);
};
