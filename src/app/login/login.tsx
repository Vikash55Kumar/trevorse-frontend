import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../../components/auth/AuthCard";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Divider } from "../../components/ui/Divider";
import SocialLogin from "../../components/auth/SocialLogin";
import BrandingPanel from "../../components/auth/BrandingPanel";
import { authClient } from "../../lib/auth-client";

export default function LoginPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user) {
      navigate("/home", { replace: true });
    }
  }, [isPending, session, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (result?.error) {
        setError(result.error.message ?? "Login failed");
        return;
      }

      navigate("/home", { replace: true });
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 pl-20 bg-gradient-to-br from-cyan-500 to-blue-600">
        <BrandingPanel
          title="Learn • Trade • Grow"
          subtitle="Learn proven trading strategies. Practice risk-free. Grow with confidence."
        />
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          <AuthCard
            title="Welcome back"
            description="Sign in to continue to Trevoros."
          >
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Login"}
              </Button>

              <Divider text="Or Continue With" />

              <SocialLogin />

              <p className="text-sm text-center text-slate-600">
                New here? <span className="text-blue-600">Create an account</span>
              </p>
            </form>
          </AuthCard>
        </div>
      </div>
    </div>

  );
}
