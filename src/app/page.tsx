import Link from "next/link";

import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <header className="inset-0 flex min-h-[80dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] dark:bg-secondaryBlack">
      <div className="w-container mx-auto max-w-full px-5 py-[110px] text-center lg:py-[150px]">
        <h1 className="text-3xl font-heading tracking-tight md:text-4xl lg:text-5xl">
          stüddy club
        </h1>
        <p className="my-12 mt-8 text-lg font-normal leading-relaxed md:text-xl lg:text-2xl lg:leading-relaxed">
          studdy smarter, not harder.
        </p>
        <Link href="/auth/register">
          <Button
            size="lg"
            className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
          >
            Get started
          </Button>
        </Link>
      </div>
    </header>
  );
}
