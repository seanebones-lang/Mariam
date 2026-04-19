import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  message?: string | null;
  className?: string;
};

export function FieldError({ id, message, className }: Props) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn(
        "mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-blood",
        className
      )}
    >
      <span aria-hidden className="mt-[3px] h-1 w-1 shrink-0 rounded-full bg-blood" />
      {message}
    </p>
  );
}
