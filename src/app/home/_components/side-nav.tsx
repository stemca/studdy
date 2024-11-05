import {
  HouseIcon,
  Library,
  MessageCircle,
  ScrollText,
  Settings,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "~/components/ui/card";
import SideNavElements from "./side-nav-elements";

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
        <SideNavElements links={links} />
      </CardContent>
    </Card>
  );
}
