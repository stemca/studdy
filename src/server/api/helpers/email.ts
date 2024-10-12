import { Resend } from "resend";

import { VerifyEmail } from "~/components/templates/verify-email";
import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

interface SendVerificationEmailParams {
  email: string;
  code: string;
}

export const sendVerificationEmail = async ({
  email,
  code,
}: SendVerificationEmailParams) => {
  return await resend.emails.send({
    from: "studdy <no-reply@studdy.com>",
    to: [email],
    subject: "Verify your email address",
    react: VerifyEmail({ email, code }),
  });
};
