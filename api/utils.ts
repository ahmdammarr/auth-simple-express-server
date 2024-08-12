import fs from 'fs-extra';
import path from 'path';
import { User } from './types';

const getUsersFilePath = (country: string) => {
  return path.join(__dirname, `../db/users.${country.toLowerCase()}.json`);
};

export const getUsers = async (country: string): Promise<User[]> => {
  const filePath = getUsersFilePath(country);
  try {
    if (await fs.pathExists(filePath)) {
      const data = await fs.readFile(filePath, 'utf-8');
      const users = JSON.parse(data);
      console.log(`Loaded users for ${country}:`, users); 
      return Array.isArray(users) ? users : [];
    }
  } catch (error) {
    console.error(`Error reading users file for ${country}:`, error);
  }
  return [];
};

export const saveUsers = async (country: string, users: User[]): Promise<void> => {
  const filePath = getUsersFilePath(country);
  try {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    console.log(`Saved users for ${country}:`, users); 
  } catch (error) {
    console.error(`Error writing users file for ${country}:`, error);
  }
};

export const generateAccountNumber = (): string => {
  return Math.random().toString().slice(2, 12);
};

export const generateBalance = (): number => {
  return parseFloat((Math.random() * 10000).toFixed(2));
};
