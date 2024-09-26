import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { verificationCodeTable } from "~/server/db/schema";

export const generateEmailVerificationCode = async (
  userId: string,
  email: string,
): Promise<string> => {
  await db
    .delete(verificationCodeTable)
    .where(eq(verificationCodeTable.userId, userId));

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await db.insert(verificationCodeTable).values({
    userId,
    email,
    code,
    expiresAt: Math.floor(Date.now() / 1000) + 15 * 60,
  });
  return code;
};
