"use client";

import Image from "next/image";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="AnyamAI"
      width={32}
      height={32}
      className={className ?? "h-6 w-6"}
      priority
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-6 w-6" />
      <span className="text-[15px] font-semibold tracking-tight text-white">
        Anyam<span className="text-mint">AI</span>
      </span>
    </span>
  );
}