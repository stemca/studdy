import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="text-2xl tracking-tight">Create an account</h1>
      <RegisterForm />
    </div>
  );
}
