import {
  HouseIcon,
  Library,
  MessageCircle,
  ScrollText,
  Settings,
} from "lucide-react";
import Link from "next/link";

import { LogoutButton } from "~/app/_components/logout-btn";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

const links = [
  {
    title: "Home",
    href: "/home",
    icon: <HouseIcon className="mr-3 h-4 w-4" />,
  },
  {
    title: "Chat",
    href: "/home/chat",
    icon: <MessageCircle className="mr-3 h-4 w-4" />,
  },
  {
    title: "Courses",
    href: "/home/courses",
    icon: <Library className="mr-3 h-4 w-4" />,
  },
  {
    title: "Assignments",
    href: "/home/assignments",
    icon: <ScrollText className="mr-3 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/home/settings",
    icon: <Settings className="mr-3 h-4 w-4" />,
  },
];

export default function SideNav() {
  return (
    <Card className="h-full">
      <CardHeader className="text-center text-2xl tracking-tighter">
        stüddy club
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {links.map(({ title, href, icon }) => (
            <li key={title}>
              <Button variant="neutral" asChild className="w-full">
                <Link href={href}>
                  {icon}
                  {title}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
        <LogoutButton className="mt-4 w-full" />
      </CardContent>
    </Card>
  );
}
