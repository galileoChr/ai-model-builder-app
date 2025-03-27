"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Brain } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const routes = [
  {
    href: "/builder",
    label: "Builder",
  },
  {
    href: "/features",
    label: "Features",
  },
  {
    href: "/models",
    label: "Models",
  },
  {
    href: "/logs",
    label: "Logs",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span className="font-bold">AI Model Builder</span>
        </Link>
        <NavigationMenu className="mx-6">
          <NavigationMenuList>
            {routes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <Link href={route.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === route.href &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    {route.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}