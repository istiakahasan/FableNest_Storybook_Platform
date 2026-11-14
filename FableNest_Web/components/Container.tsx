import { cn } from "@/lib/utils";

type ContainerProp = {
  size?: "default" | "xl" | "lg";
} & React.ComponentProps<"div">;

export default function Container({
  size = "default",
  children,
  className,
  ...props
}: ContainerProp) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-6",
        {
          "max-w-[1360px]": size === "default",
          "max-w-343": size === "xl",
          "max-w-280": size === "lg",
        },
        className
      )}
      {...props}>
      {children}
    </div>
  );
}
