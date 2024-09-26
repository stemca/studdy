import { api } from "~/trpc/server";

export default async function RegisterPage() {
  return (
    <div>
      <h1>Create an account</h1>
      <form action={signUp}></form>
    </div>
  );
}

async function signUp() {}
