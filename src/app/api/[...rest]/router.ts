import { signIn, signUp } from "~/app/actions/auth";
import { pub } from "~/server/api";

export const router = pub.router({
	auth: pub.tag("Authentication").router({
		signUp,
		signIn,
	}),
});
