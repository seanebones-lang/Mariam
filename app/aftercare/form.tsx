"use client";

import { useState } from "react";
import { subscribeAftercare } from "@/app/actions/aftercare";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AftercareForm() {
  const [email, setEmail] = useState("");
  const [tattooDate, setTattooDate] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const r = await subscribeAftercare({ email, tattooDate });
    setLoading(false);
    if (r.ok) {
      setMsg(`Saved. Private timeline: /aftercare/track/${r.token}`);
    } else setMsg(r.error);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 border border-bone/10 bg-char p-5 sm:p-6"
    >
      <div>
        <Label htmlFor="em">Email</Label>
        <Input
          id="em"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="td">Tattoo date</Label>
        <Input
          id="td"
          type="date"
          required
          value={tattooDate}
          onChange={(e) => setTattooDate(e.target.value)}
          className="mt-2"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "…" : "Start reminders"}
      </Button>
      {msg ? (
        <p className="break-words text-sm leading-relaxed text-bone/80">
          {msg}
        </p>
      ) : null}
    </form>
  );
}
