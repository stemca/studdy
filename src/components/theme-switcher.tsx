"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Button
        size="icon"
        className="fixed right-10 top-10 z-50"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Sun className="w500:h-4 w500:w-4 hidden h-6 w-6 stroke-text dark:inline" />
        <Moon className="w500:h-4 w500:w-4 inline h-6 w-6 stroke-text dark:hidden" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}
