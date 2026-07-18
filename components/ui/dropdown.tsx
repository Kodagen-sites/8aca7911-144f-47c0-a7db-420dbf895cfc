"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

type Ctx = { open: boolean; toggle: () => void; close: () => void };
const DropdownCtx = React.createContext<Ctx | null>(null);

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownCtx.Provider value={{ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }}>
      <div className="relative inline-block">{children}</div>
    </DropdownCtx.Provider>
  );
}

export function DropdownTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const ctx = React.useContext(DropdownCtx);
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        ctx?.toggle();
      },
    });
  }
  return <button type="button" onClick={() => ctx?.toggle()}>{children}</button>;
}

export function DropdownContent({ className, children, align = "end" }: { className?: string; children: React.ReactNode; align?: "start" | "end" }) {
  const ctx = React.useContext(DropdownCtx);
  if (!ctx?.open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={ctx.close} />
      <div className={cn("absolute z-50 mt-1 min-w-[10rem] rounded-md border border-[#E5C9A8] bg-white shadow-md py-1", align === "end" ? "right-0" : "left-0", className)}>
        {children}
      </div>
    </>
  );
}

export function DropdownItem({ className, children, onSelect, asChild, ...props }: React.HTMLAttributes<HTMLButtonElement> & { onSelect?: () => void; asChild?: boolean }) {
  const ctx = React.useContext(DropdownCtx);
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string; onClick?: (e: React.MouseEvent) => void }>;
    return React.cloneElement(child, {
      className: cn("flex w-full items-center px-3 py-1.5 text-sm text-[#3B2418] hover:bg-[#F5EDE3] text-left", child.props.className, className),
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        onSelect?.();
        ctx?.close();
      },
    });
  }
  return (
    <button
      type="button"
      className={cn("flex w-full items-center px-3 py-1.5 text-sm text-[#3B2418] hover:bg-[#F5EDE3] text-left", className)}
      onClick={() => {
        onSelect?.();
        ctx?.close();
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-[#E5C9A8]" />;
}
