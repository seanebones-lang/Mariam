"use client";

import { useRef, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field-error";
import { useToast } from "@/components/ui/toast";
import {
  addFlashPiece,
  addTourDate,
  deleteTourDate,
} from "@/app/actions/admin";

export function DeleteTourButton({ id, label }: { id: string; label: string }) {
  const toast = useToast();
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function go() {
    const fd = new FormData();
    fd.set("id", id);
    start(async () => {
      await deleteTourDate(fd);
      toast.success(`${label} removed.`);
    });
  }

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setConfirming(true)}
        className="w-full sm:w-auto"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        Remove
      </Button>
    );
  }

  return (
    <div className="flex w-full gap-2 sm:w-auto">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(false)}
        className="flex-1 sm:flex-none"
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        aria-busy={pending}
        onClick={go}
        className="flex-1 sm:flex-none"
      >
        {pending ? <Spinner /> : null}
        Confirm
      </Button>
    </div>
  );
}

export function AddTourForm() {
  const toast = useToast();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [pending, start] = useTransition();
  const [errors, setErrors] = useState<{ city?: string; startsOn?: string }>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const city = String(fd.get("city") ?? "").trim();
    const startsOn = String(fd.get("startsOn") ?? "");
    const next: typeof errors = {};
    if (!city) next.city = "City is required.";
    if (!startsOn) next.startsOn = "Start date is required.";
    else if (new Date(startsOn).getTime() < Date.now() - 86_400_000)
      next.startsOn = "Date must not be in the past.";
    setErrors(next);
    if (Object.keys(next).length) return;
    start(async () => {
      await addTourDate(fd);
      formRef.current?.reset();
      toast.success("Tour date added.");
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="mt-8 grid gap-4 border border-bone/10 p-4 sm:p-5"
    >
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" required className="mt-2" />
        <FieldError message={errors.city} />
      </div>
      <div>
        <Label htmlFor="venue">Venue (optional)</Label>
        <Input id="venue" name="venue" className="mt-2" />
      </div>
      <div>
        <Label htmlFor="startsOn">Starts</Label>
        <Input
          id="startsOn"
          name="startsOn"
          type="datetime-local"
          required
          className="mt-2"
        />
        <FieldError message={errors.startsOn} />
      </div>
      <Button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full sm:w-auto"
      >
        {pending ? (
          <>
            <Spinner className="text-bandage" />
            Adding…
          </>
        ) : (
          "Add tour date"
        )}
      </Button>
    </form>
  );
}

export function AddFlashForm() {
  const toast = useToast();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [pending, start] = useTransition();
  const [errors, setErrors] = useState<{
    title?: string;
    imageUrl?: string;
    priceUsd?: string;
  }>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    const imageUrl = String(fd.get("imageUrl") ?? "").trim();
    const priceUsd = Number(fd.get("priceUsd") ?? 0);
    const next: typeof errors = {};
    if (!title) next.title = "Title is required.";
    try {
      new URL(imageUrl);
    } catch {
      next.imageUrl = "Enter a full image URL (https://…).";
    }
    if (!priceUsd || priceUsd <= 0) next.priceUsd = "Price must be greater than 0.";
    setErrors(next);
    if (Object.keys(next).length) return;
    start(async () => {
      await addFlashPiece(fd);
      formRef.current?.reset();
      toast.success("Flash piece added.");
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="mt-6 grid gap-4 border border-bone/10 p-4 sm:p-5"
    >
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required className="mt-2" />
        <FieldError message={errors.title} />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          inputMode="url"
          required
          className="mt-2"
          placeholder="https://…"
        />
        <FieldError message={errors.imageUrl} />
      </div>
      <div>
        <Label htmlFor="priceUsd">Price (USD)</Label>
        <Input
          id="priceUsd"
          name="priceUsd"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          required
          className="mt-2"
        />
        <FieldError message={errors.priceUsd} />
      </div>
      <Button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full sm:w-auto"
      >
        {pending ? (
          <>
            <Spinner className="text-bandage" />
            Adding…
          </>
        ) : (
          "Add flash piece"
        )}
      </Button>
    </form>
  );
}
