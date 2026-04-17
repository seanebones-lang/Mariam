import { adminLogin } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const err =
    sp.error === "invalid"
      ? "Invalid password."
      : sp.error === "config"
        ? "Set ADMIN_PASSWORD or ADMIN_SESSION_SECRET in .env.local"
        : null;
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Studio
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl">
        Admin
      </h1>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Set <code className="text-bone">ADMIN_PASSWORD</code> and optionally{" "}
        <code className="text-bone">ADMIN_SESSION_SECRET</code> in{" "}
        <code className="text-bone">.env.local</code>.
      </p>
      {err ? <p className="mt-3 text-sm text-blood">{err}</p> : null}
      <form action={adminLogin} className="mt-8 space-y-4">
        <input type="hidden" name="next" value={sp.next ?? "/admin"} />
        <div>
          <Label htmlFor="pw">Password</Label>
          <Input
            id="pw"
            name="password"
            type="password"
            required
            className="mt-2"
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          Enter
        </Button>
      </form>
    </div>
  );
}
