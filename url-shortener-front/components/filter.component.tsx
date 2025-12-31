import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Folder,
  Globe2,
  Link2,
  ListFilter,
  Settings,
  Settings2,
  Sparkles,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FilterDropDownProps {
  filterContent: string;
  filterChanged: (s: string) => void;
  filter: (f: string) => void;
  signout: () => void;
  open: boolean;
  setOpen: (b: boolean) => void;
}

export function FilterDropDownComponent({
  filter,
  signout,
  filterContent,
  filterChanged,
  open,
  setOpen,
}: FilterDropDownProps) {
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-xl h-12 w-34">
          <div className="flex items-center justify-between gap-3">
            <ListFilter />
            <h1 className="">Filter</h1>
            <ChevronDown className={cn(!open ? "block" : "hidden")}/>
            <ChevronUp className={cn(open ? "block" : "hidden")}/>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <div
            className="flex items-center justify-between mb-1 px-1 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // e.preventDefault(); // Prevent any default form behavior
                filter(filterContent);
                setOpen(false);
                
              }
            }}
          >
            <input
              value={filterContent}
              onChange={(s) => {
                filterChanged(s.target.value || "");
              }}
              className="ps-2 focus:outline-none outline-none select-none w-36"
              placeholder="Filter..."
            />
            <div className="flex ring-1 ring-gray-300 h-8 w-8 items-center justify-center rounded-sm bg-gray-50">
              F
            </div>
          </div>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="px-2 py-4 text-xl">
            <div className="flex items-center justify-center gap-2 ps-2">
              <Sparkles />
              <h1 className="text-xl">Ask AI</h1>
            </div>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <div className="flex items-center justify-center gap-2 ps-2">
              <Folder />
              <h1 className="text-xl py-2">Folder</h1>
            </div>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center justify-center gap-2 ps-2">
              <Tag />
              <h1 className="text-xl py-1">Tag</h1>
            </div>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center justify-center gap-2 ps-2">
              <Globe2 />
              <h1 className="text-xl py-1">Domain</h1>
            </div>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <div className="flex items-center justify-center gap-2 ps-2">
              <Link2 />
              <h1 className="text-xl py-1">Link</h1>
            </div>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <div className="flex items-center justify-center gap-2 ps-2">
              <Settings2 />
              <h1 className="text-xl py-1">Link Type</h1>
            </div>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <div className="flex items-center justify-center gap-2 ps-2">
              <BriefcaseBusiness />
              <h1 className="text-xl py-1">Sale Type</h1>
            </div>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={`${process.env.NEXT_PUBLIC_GITHUB_URL}`}
            target="_blank"
            className="hover:underline text-md py-1"
          >
            Github
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={`${process.env.NEXT_PUBLIC_GITHUB_URL}`}
            target="_blank"
            className="hover:underline text-md py-1"
          >
            Support
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signout();
          }}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
