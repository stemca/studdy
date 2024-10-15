import Link from "next/link";

import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-3">
      <h1 className="text-3xl tracking-tighter">Create an account</h1>
      <RegisterForm />
      <Link href="/auth/login">Already have an account?</Link>
    </div>
  );
}
