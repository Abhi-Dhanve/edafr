import { Drawer } from "vaul";

interface IProps {
  children: React.ReactNode;
  element: React.ReactNode;
}

export default function (props: IProps) {
  return (
    <Drawer.Root>
      <Drawer.Trigger>{props.children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-background/40 backdrop-blur-sm" />
        <Drawer.Content className="flex flex-col rounded-t-xl border-t h-min fixed bottom-0 w-full bg-card p-4">
          {props.element}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
