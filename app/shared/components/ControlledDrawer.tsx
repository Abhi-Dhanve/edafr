import { useEffect, useState } from "react";
import { Drawer } from "vaul";

interface IProps {
  children: React.ReactNode;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export default function (props: IProps) {
  const [open, setOpen] = props.openState

  return (
    <Drawer.Root open={open} onOpenChange={() => setOpen(false)}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-background/40 backdrop-blur-sm" />
        <Drawer.Content className="flex flex-col rounded-t-xl border-t h-min fixed bottom-0 w-full bg-card p-4 items-center">
          <Drawer.Title></Drawer.Title>
          <figure className="mb-3 bg-foreground/50 rounded-full w-1/3 h-1" />

          {props.children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
