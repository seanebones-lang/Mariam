"use client";

import { startTransition, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const KEY = "mbb_cookie_consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      return;
    }
    startTransition(() => setShow(true));
  }, []);

  if (!show) return null;

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <div
      className="fixed left-0 right-0 top-14 z-[90] border-b border-bone/15 bg-char/95 px-5 py-3 backdrop-blur-md sm:bottom-4 sm:left-auto sm:right-4 sm:top-auto sm:max-w-md sm:rounded-sm sm:border sm:px-4 sm:py-4"
      style={{
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-[11px] leading-relaxed text-bone/85 sm:text-xs">
        We use essential cookies for the age gate, admin session, and optional
        analytics. See our{" "}
        <Link
          href="/privacy"
          className="text-blood underline underline-offset-2"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-2 flex gap-2 sm:mt-3">
        <Button size="sm" type="button" onClick={accept} className="flex-1 sm:flex-none">
          Accept
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => setShow(false)}
          className="flex-1 sm:flex-none"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}
