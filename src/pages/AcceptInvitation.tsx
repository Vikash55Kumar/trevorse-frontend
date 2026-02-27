import { useMemo, useState, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import BrandingPanel from "../components/auth/BrandingPanel";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { acceptInvitation, rejectInvitation } from "../lib/api";

export default function AcceptInvitation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Invitation token is missing.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await acceptInvitation({
        token,
        password,
        name,
        callbackURL: `${window.location.origin}/login`,
        rememberMe: true,
      });
      setMessage("Invitation accepted. You can now sign in.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Invitation token is missing.");
      return;
    }

    setLoading(true);
    try {
      await rejectInvitation(token);
      setMessage("Invitation declined.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 pl-20 bg-gradient-to-br from-cyan-500 to-blue-600">
        <BrandingPanel
          title="Join Trevorse"
          subtitle="Accept your invitation and get started in minutes."
        />
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md">
          <AuthCard
            title="Accept Invitation"
            description="Create your account password to continue."
          >
            <form className="space-y-4" onSubmit={handleAccept}>
              <Input
                label="Full name"
                placeholder="Your name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
              <Input
                label="Confirm password"
                type="password"
                placeholder="Confirm your password"
                value={confirm}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirm(e.target.value)
                }
              />

              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              {message && (
                <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {message}
                </p>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Accept Invitation"}
              </Button>

              <button
                type="button"
                onClick={handleReject}
                className="w-full rounded-sm border border-gray-300 py-2 text-sm text-gray-600 hover:text-gray-900"
                disabled={loading}
              >
                Decline Invitation
              </button>
            </form>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
