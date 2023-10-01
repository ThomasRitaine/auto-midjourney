import bcrypt from "bcrypt";

/**
 * Hash a given password using bcrypt.
 *
 * @param password - The password to be hashed.
 *
 * @returns The bcrypt hashed password.
 *
 * @example
 * const hashedPassword = await hashPassword("plaintext_password");
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err: unknown) {
    throw new Error(err as string);
  }
};

/**
 * Compare a hashed password with a plaintext password.
 *
 * @param hash - The hashed password.
 * @param password - The plaintext password.
 *
 * @returns True if the passwords match, false otherwise.
 *
 * @example
 * const isMatch = await comparePassword(storedHashedPassword, "input_password");
 * if (isMatch) {
 *   // user authenticated
 * }
 */
export const comparePassword = async (
  hash: string,
  password: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err: unknown) {
    throw new Error(err as string);
  }
};

/**
 * Generate a unique random token using bcrypt.
 *
 * This function hashes the current timestamp with a generated salt from bcrypt,
 * ensuring a unique token every time it is called. The resulting token will be
 * of the desired length, determined by the `length` parameter.
 *
 * @param length - Desired length of the generated token.
 *
 * @returns Promise which resolves to the generated unique token.
 *
 * @example
 * const token = await generateToken(32);  // Returns a unique token of length 20.
 */
export const generateToken = async (length: number): Promise<string> => {
  const salt = await bcrypt.genSalt(length);
  const hash = await bcrypt.hash(String(Date.now()), salt);
  return hash.slice(-length);
};
