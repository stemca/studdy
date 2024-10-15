import { OAuth2RequestError } from "arctic";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

import {
  createSession,
  generateSessionToken,
  setSessionCookie,
} from "~/server/auth";
import { discord } from "~/server/auth/discord";
import { db } from "~/server/db";
import { accountsTable, userTable } from "~/server/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("discord_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const discordUser = (await response.json()) as DiscordUser;

    // if account already exists, return
    const existingAccount = await db.query.accountsTable.findFirst({
      where: and(
        eq(accountsTable.providerId, "discord"),
        eq(accountsTable.providerUserId, discordUser.id),
      ),
    });
    if (existingAccount) {
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, existingAccount.userId);
      setSessionCookie(sessionToken, session.expiresAt);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/home",
        },
      });
    }

    await db.transaction(async (tx) => {
      const user = await tx
        .insert(userTable)
        .values({
          email: discordUser.email,
          emailVerified: true,
        })
        .returning();
      if (user.length < 1 || !user[0]?.id) {
        tx.rollback();
        return new Response(null, {
          status: 400,
          headers: {
            Location: "/",
          },
        });
      }

      const userId = user[0].id;
      await tx.insert(accountsTable).values({
        providerId: "discord",
        providerUserId: discordUser.id,
        userId: userId,
      });
    });

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, discordUser.email),
    });

    // this shouldn't happen
    if (!user) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    setSessionCookie(sessionToken, session.expiresAt);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/home",
      },
    });
  } catch (e) {
    console.error(e);
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface DiscordUser {
  id: string;
  email: string;
}
