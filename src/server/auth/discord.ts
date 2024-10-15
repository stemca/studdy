import { Discord } from "arctic";

import { env } from "~/env";

export const discord = new Discord(
  env.DISCORD_CLIENT_ID,
  env.DISCORD_CLIENT_SECRET,
  `${env.NODE_ENV === "production" ? "https://www.studdy.club" : "http://localhost:3000"}/auth/login/discord/callback`,
);
