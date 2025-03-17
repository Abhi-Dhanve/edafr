import { usePrivy } from "@privy-io/react-auth";
import { Drawer } from "vaul";
import api from "../hooks/api";
import Icon from "./Icon";
import { useRef } from "react";

export default function (props: { open: boolean }) {
  const privy = usePrivy();

  const nameRef = useRef<HTMLInputElement>(null);
  const { mutate: createSelfUser } = api.useCreateSelfUser();

  return (
    <Drawer.Root open={props.open} dismissible={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-background/40 backdrop-blur-sm" />

        <Drawer.Content className="flex flex-col rounded-t-xl border-t h-min fixed bottom-0 w-full bg-card p-4">
          <Drawer.Title className="text-lg font-semibold">Please input your full name</Drawer.Title>

          <input
            ref={nameRef}
            defaultValue={privy.user?.google?.name}
            placeholder="Eg: Peter Griffin"
            className="w-full p-2 mt-3 bg-background border rounded-md text-foreground/80 text-sm placeholder:text-foreground/50"
          />

          <button
            className="bg-primary text-primary-foreground rounded-xl py-2 mt-4 flex items-center justify-center gap-x-1"
            onClick={() => {
              if (!nameRef.current) return;
              const name = nameRef.current.value;
              createSelfUser({ name });
            }}
          >
            <Icon name="check" className="translate-y-[2px]" strokeWidth={3} /> Confirm
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
