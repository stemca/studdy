import { redirect } from "next/navigation";

import { getCurrentSession } from "~/server/auth";
import SideNav from "./_components/side-nav";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await getCurrentSession();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="not-prose flex h-screen w-screen items-center justify-center border-2 border-border bg-white bg-[radial-gradient(#80808080_1px,transparent_1px)] px-4 py-8 shadow-light [background-size:16px_16px] dark:border-darkBorder dark:bg-secondaryBlack dark:shadow-dark">
      <SideNav />
      {children}
    </div>
  );
}
