import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "success";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export function buttonStyles({
  variant = "primary",
  size = "md",
  block = false,
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; block?: boolean; className?: string } = {}) {
  return cn(
    "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-[-0.005em]",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-[var(--ease-out-soft)]",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-text",
    {
      xs: "h-8 rounded-sm px-2.5 text-xs",
      sm: "h-9 rounded-md px-3.5 text-sm",
      md: "h-11 rounded-md px-5 text-sm",
      lg: "h-13 rounded-lg px-6 text-[0.9375rem]",
    }[size],
    {
      primary:
        "bg-brand text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_6px_20px_-8px_rgb(47_95_240/0.7)] hover:bg-brand-hover",
      secondary: "bg-surface-3 text-fg border border-line-strong hover:bg-surface-4 hover:border-[#3a404a]",
      outline: "border border-line-strong text-fg hover:border-fg-subtle hover:bg-surface-2",
      ghost: "text-fg-muted hover:text-fg hover:bg-surface-3",
      danger: "bg-danger-soft text-danger border border-danger/30 hover:bg-danger/20",
      success: "bg-success text-[#04130c] hover:bg-success/90",
    }[variant],
    block && "w-full",
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, block, className, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonStyles({ variant, size, block, className })} {...props} />;
});

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize; block?: boolean };

export function ButtonLink({ variant, size, block, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, block, className })} {...props} />;
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "surface" | "overlay";
  pressed?: boolean;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, size = "md", variant = "ghost", pressed, className, type = "button", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-md transition-[background-color,color,border-color,transform] duration-150 active:scale-95",
        { sm: "size-8", md: "size-10", lg: "size-11" }[size],
        {
          ghost: "text-fg-muted hover:bg-surface-3 hover:text-fg",
          surface: "border border-line bg-surface-2 text-fg-muted hover:border-line-strong hover:text-fg",
          overlay: "bg-bg/70 text-fg-muted backdrop-blur-sm ring-1 ring-white/5 hover:bg-surface-3 hover:text-fg",
        }[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
