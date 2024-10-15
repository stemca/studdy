interface VerifyEmailProps {
  email: string;
  code: string;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, code }) => {
  return (
    <div>
      <p>Welcome, {email}!</p>
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
