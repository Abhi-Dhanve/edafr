import { cn } from "../utils/utils";

type UserAvatarProps = {
  className?: string;
  name: string;
  avatarImageUrl?: string;
  width?: string;
  height?: string;
};

export default function (props: UserAvatarProps) {
  const useName = props.name || "😊";
  const placeholderUrl = `https://ui-avatars.com/api/?background=random&bold=true&name=${useName.replaceAll(
    " ",
    "+"
  )}`;

  const imageUrl = props.avatarImageUrl || placeholderUrl;

  return (
    <img
      src={imageUrl}
      width={props.width}
      height={props.height}
      className={props.className}
    />
  );
}
