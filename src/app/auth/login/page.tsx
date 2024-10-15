import Link from "next/link";

import LoginForm from "./form";

export default function Login() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-3">
      <h1 className="text-3xl tracking-tighter">Welcome back</h1>
      <LoginForm />
      <Link href="/auth/register">Don't have an account?</Link>
    </div>
  );
}
