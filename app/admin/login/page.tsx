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
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl text-bandage">Admin</h1>
      <p className="mt-3 text-xs text-muted">
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
            className="mt-1"
            autoComplete="current-password"
          />
        </div>
        <Button type="submit">Enter</Button>
      </form>
    </div>
  );
}
