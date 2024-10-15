import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-3">
      <h1 className="text-3xl tracking-tight">Create an account</h1>
      <RegisterForm />
      <div>
        Have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
}
