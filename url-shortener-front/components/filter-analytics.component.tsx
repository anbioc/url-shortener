"use client";
import { useState } from "react";
import { FilterDropDownComponent } from "./filter.component";
import { toast } from "sonner";
import DatePickerComponent from "./date-picker.component";
import { Button } from "./ui/button";
import { CalendarDays, Download, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuShortcut } from "./ui/dropdown-menu";
import { logout } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default function FilterAnalyticsComponent() {
  const [filterContent, setFilterContent] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center justify-start gap-2">
        <FilterDropDownComponent
          signout={() => {
            logout()
            redirect("/sign-in")
          }}
          filter={(s) => {
            setFilterContent("");
            toast(s);
          }}
          filterContent={filterContent}
          filterChanged={(s: string) => {
            setFilterContent(s);
          }}
          open={openFilter}
          setOpen={(o: boolean) => {
            setOpenFilter(o);
          }}
        />

        <DatePickerComponent />
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" className="w-44 h-12 hover:cursor-pointer">
          <CalendarDays />
          <h1 className="text-xl font-normal">View Events</h1>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-10 h-12 hover:cursor-pointer"
            >
              <EllipsisVertical className="text-gray-400" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <div
                  className="flex items-center justify-center w-60
                 gap-2 ring-1 ring-gray-200 py-2 px-1 mt-2 me-4 cursor-pointer"
                >
                  <Download className="text-md size-5" />
                  <h1 className="text-xl text-gray-700 font-semibold">
                    Download as CSV
                  </h1>
                </div>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
