"use client";

import clsx from "clsx";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Card({ title, children, footer, className }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/20 hover:shadow-lg hover:shadow-neonGreen/10",
        className
      )}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-white">
          {title}
        </h3>
      )}
      <div className="text-sm text-zinc-300">{children}</div>
      {footer && <div className="mt-6 border-t border-white/10 pt-4">{footer}</div>}
    </div>
  );
}
