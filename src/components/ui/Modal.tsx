"use client";

import clsx from "clsx";
import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl",
          className
        )}
      >
        <button
          className="absolute right-4 top-4 text-sm text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        {title && (
          <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
        )}
        <div className="text-sm text-zinc-300">{children}</div>
      </div>
    </div>
  );
}
