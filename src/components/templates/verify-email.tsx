interface VerifyEmailProps {
  email: string;
  code: string;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, code }) => {
  return (
    <div>
      <h1>Welcome, {email}!</h1>
      <p>
        Your email verification code is <strong>{code}</strong>
      </p>
      <p>
        Please enter this code in the verification form to verify your email
        address.
      </p>
    </div>
  );
};
