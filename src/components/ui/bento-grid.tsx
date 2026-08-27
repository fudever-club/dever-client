import React, { type ComponentPropsWithoutRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export interface BentoCardProps {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
  badge?: string;
  style?: React.CSSProperties;
}

export const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-auto sm:auto-rows-[20rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  badge,
  style,
}: BentoCardProps) => (
  <Link
    href={href}
    key={name}
    style={style}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-5 sm:p-7 border border-slate-200/90 transition-all duration-300 block text-left no-underline min-h-[16rem] sm:min-h-0",
      "shadow-[0_4px_20px_-2px_rgba(0,102,204,0.04)] hover:shadow-[0_14px_36px_-4px_rgba(0,102,204,0.14)] hover:border-blue-400 hover:-translate-y-1 cursor-pointer",
      className
    )}
  >
    {/* Ambient Background Graphic Layer */}
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80 group-hover:opacity-100 transition-all duration-500">
      {background}
    </div>

    {/* Top Row: Icon Capsule + Optional Badge */}
    <div className="relative z-10 flex items-center justify-between gap-3 w-full">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0066CC] border border-blue-100/90 shadow-xs transform-gpu transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:bg-[#0066CC] group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>

      {badge && (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200/90 px-3 py-1 text-xs font-black text-slate-700 shadow-2xs">
          {badge}
        </span>
      )}
    </div>

    {/* Bottom Content Area */}
    <div className="relative z-10 mt-auto flex flex-col gap-2.5 pt-4">
      <div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight m-0 group-hover:text-[#0066CC] transition-colors">
          {name}
        </h3>
        <p className="max-w-md text-xs sm:text-sm text-slate-600 font-medium leading-relaxed m-0 mt-1 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Action CTA Bar */}
      <div className="flex items-center gap-1.5 pt-1 text-xs font-black text-[#0066CC] group-hover:text-[#004C99]">
        <span>{cta}</span>
        <ArrowRight className="h-3.5 w-3.5 transform-gpu transition-transform duration-300 group-hover:translate-x-1.5" />
      </div>
    </div>

    {/* Soft Hover Overlay Glow */}
    <div className="pointer-events-none absolute inset-0 z-0 transform-gpu transition-all duration-300 group-hover:bg-blue-500/[0.015]" />
  </Link>
);
