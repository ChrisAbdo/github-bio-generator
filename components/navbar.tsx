import React from "react";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Github } from "lucide-react";

export default function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <span className="sr-only">Github Bio Generator</span>
          <HoverCard>
            <HoverCardTrigger>
              <h1 className="text-2xl font-bold text-gray-900">
                Github Bio Generator
              </h1>
            </HoverCardTrigger>
            <HoverCardContent>
              Original idea and streaming by @nutlope.
              <br /> Upgraded to Next.js 13.4 by @abdo_eth
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button variant="outline">
            <Github size={24} className="mr-2" />
            Star on Github
          </Button>
        </div>
      </nav>
    </header>
  );
}
