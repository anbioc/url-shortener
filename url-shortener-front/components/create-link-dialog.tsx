import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";

export function CreateLinkDialog({
  onCreateLink,
}: {
  onCreateLink: (link: string) => void;
}) {
  const [content, setContent] = useState("");
  const buttonRef = useRef(null);
  return (
    <Dialog>
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Prevent any default form behavior
            onCreateLink(content);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="px-8 py-6 cursor-pointer
                   hover:shadow-xl hover:shadow-blue-800/10"
          >
            <h1 className="text-xl">Create Link</h1>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle className="text-3xl">Create Link</DialogTitle>
            <DialogDescription className="text-xl">
              Enter URL to create the short version
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="url-1" className="text-xl">
                URL
              </Label>
              <Input
                // value={content}
                onChange={(s) => {
                  setContent(s.target.value || "");
                }}
                id="url-1"
                name="url"
                defaultValue=""
                className="text-2xl"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 mb-4">
            <DialogClose asChild>
              <Button variant="outline" className="text-xl">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                ref={buttonRef}
                onClick={() => {
                  onCreateLink(content);
                }}
                className="text-xl"
              >
                create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
