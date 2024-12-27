"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "~/app/_components/logout-btn";
import { Button } from "~/components/ui/button";

type SideNavElementsProps = {
  links: {
    title: string;
    href: string;
    icon: JSX.Element;
  }[];
};

export default function SideNavElements({ links }: SideNavElementsProps) {
  const pathname = usePathname();

  return (
    <ul className="space-y-4">
      {links.map(({ title, href, icon }) => (
        <li key={title}>
          <Button
            variant={pathname !== href ? "neutral" : "default"}
            asChild
            className="w-full"
          >
            <Link href={href}>
              {icon}
              {title}
            </Link>
          </Button>
        </li>
      ))}
      <LogoutButton className="mt-4 w-full" />
    </ul>
  );
}
