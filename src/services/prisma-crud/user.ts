import { type User, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (infoData: any): Promise<User> => {
  return await prisma.user.create({ data: infoData });
};

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { id } });
};

export const getUserByUsername = async (
  username: string,
): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { username } });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { email } });
};

export const getUserByUsernameOrEmail = async (
  login: string,
): Promise<User | null> => {
  const userByName = await prisma.user.findUnique({
    where: { username: login },
  });
  if (userByName != null) {
    return userByName;
  }
  const userByEmail = await prisma.user.findUnique({ where: { email: login } });
  if (userByEmail != null) {
    return userByEmail;
  }
  return null;
};

export const getUserByResetPasswordToken = async (
  resetPasswordToken: string,
): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { resetPasswordToken } });
};

export const updateUser = async (
  id: string,
  updatedData: any,
): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: updatedData,
  });
};

export const updateLastLoginUser = async (id: string): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({ where: { id } });
};
