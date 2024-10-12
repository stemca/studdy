import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm";

import type { Session, User } from "~/server/db/schema";
import { db } from "~/server/db";
import { sessionTable, userTable } from "~/server/db/schema";

export const generateSessionToken = (): string => {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
};

export const createSession = async (
  token: string,
  userId: string,
): Promise<Session> => {
  const sessionId = encodeHexLowerCase(new TextEncoder().encode(token));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime(),
  };

  await db.insert(sessionTable).values(session);
  return session;
};

export const validateSessionToken = async (
  token: string,
): Promise<SessionValidationResult> => {
  const sessionId = encodeHexLowerCase(new TextEncoder().encode(token));
  const result = await db
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));

  if (result.length < 1 || !result[0]) {
    return { session: null, user: null };
  }

  const { session, user } = result[0];
  if (Date.now() >= session.expiresAt) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30,
    ).getTime();
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionTable.id, session.id));
  }
  return { session, user };
};

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
