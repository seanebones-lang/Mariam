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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] border-t border-bone/15 bg-char/95 p-4 backdrop-blur-md md:left-auto md:right-4 md:bottom-4 md:max-w-md md:rounded-sm md:border">
      <p className="text-xs leading-relaxed text-bone/85">
        We use essential cookies for the age gate, admin session, and optional
        analytics. See our{" "}
        <Link href="/privacy" className="text-blood underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(KEY, "1");
            } catch {
              /* ignore */
            }
            setShow(false);
          }}
        >
          Accept
        </Button>
        <Button size="sm" variant="ghost" type="button" onClick={() => setShow(false)}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
