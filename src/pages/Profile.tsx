import { useEffect, useState } from "react";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ActivityHeatMap from "../components/Profile/ActivityHeatMap";
import QuickActions from "../components/Profile/QuickActions";
import { getCurrentUser } from "../lib/api";
import { authClient } from "../lib/auth-client";

// ============================
// MOCK DATA
// ============================

const activityData = Array.from({ length: 180 }, (_, i) => ({
  id: i,
  level: Math.floor(Math.random() * 5),
}));

// ============================
// COMPONENT
// ============================

export default function Profile() {
  const { data: session } = authClient.useSession();
  const [user, setUser] = useState<any>(session?.user ?? null);

  useEffect(() => {
    let mounted = true;

    getCurrentUser()
      .then((res) => {
        if (!mounted) return;
        const current = res?.data?.user ?? null;
        setUser(current);
      })
      .catch(() => {
        // Fallback to session user if API is unavailable
        if (mounted && session?.user) {
          setUser(session.user);
        }
      });

    return () => {
      mounted = false;
    };
  }, [session?.user]);

  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "user@example.com";

  return (
    <main className="p-6 space-y-8 max-w-6xl mx-auto w-full">

      {/* Profile Header */}
      <ProfileHeader
        name={displayName}
        email={displayEmail}
        avatar=""
      />

      {/* Activity */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-slate-500">
          Activity
        </h3>

        <ActivityHeatMap data={activityData} />
      </section>

      {/* Quick Actions */}
      <QuickActions />

    </main>
  );
}
