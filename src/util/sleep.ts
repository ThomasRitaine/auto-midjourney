/**
 * Sleeps for the specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep.
 */
export default async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
