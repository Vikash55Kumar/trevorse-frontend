// 


import {
  LayoutDashboard,
  LineChart,
  Wallet,
  BookOpen,
  Users,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { NavLink, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Logo from "../../assets/logo.svg";
import { authClient } from "../../lib/auth-client";
import type { UserWithRole } from "../../types/auth";

// ==============================
// 🔹 Types
// ==============================
type MenuItem = {
  name: string;
  icon: LucideIcon;
  path: string;
};

interface SidebarProps {
  userName?: string;
}

// ==============================
// 🔹 Menu Items
// ==============================
const baseItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/home" },
  { name: "Trade", icon: LineChart, path: "/home/trade" },
  { name: "Positions", icon: Wallet, path: "/home/positions" },
  { name: "Learn", icon: BookOpen, path: "/home/learn" },
  { name: "Mentorship", icon: Users, path: "/home/mentorship" },
  { name: "Behavioral Analytics", icon: Activity, path: "/home/analytics" },
];

// ==============================
// 🔹 Component
// ==============================
export default function Sidebar({
  userName = "User Name",
}: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { data } = authClient.useSession();
  const user = data?.user;
  const role = (user as UserWithRole | undefined)?.role;
  const displayName = user?.name ?? userName;
  const items = useMemo(() => {
    if (role === "ADMIN") {
      return [...baseItems, { name: "Admin", icon: Settings, path: "/admin" }];
    }
    return [...baseItems];
  }, [role]);
  const initials = useMemo(() => {
    if (!displayName) return "U";
    const parts = displayName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "U";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  }, [displayName]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } finally {
      setOpen(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow md:hidden"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed md:static top-0 left-0 h-full bg-white border-r flex flex-col justify-between z-50 transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="px-4 py-6">
          {/* ============================== */}
          {/* Logo + Toggle */}
          {/* ============================== */}
          <div className="flex items-center justify-between mb-6">
            {/* ✅ Logo becomes expand button when collapsed */}
            <div
              onClick={() => collapsed && setCollapsed(false)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2",
                collapsed && "justify-center cursor-pointer"
              )}
            >
              <img src={Logo} alt="Logo" className="w-8 h-8" />
              {!collapsed && (
                <span className="font-semibold text-xl">Trevoros</span>
              )}
            </div>

            {/* ✅ Arrow ONLY visible when expanded */}
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="hidden md:flex p-1.5 rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {/* Mobile Close */}
            <button
              onClick={() => setOpen(false)}
              className="md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* ============================== */}
          {/* Navigation */}
          {/* ============================== */}
          <nav className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      collapsed && "justify-center"
                    )
                  }
                >
                  <Icon size={18} />
                  {!collapsed && (
                    <span className="text-sm">{item.name}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* ============================== */}
        {/* Bottom Section */}
        {/* ============================== */}
        <div className="px-4 py-4 space-y-3">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-slate-500 hover:bg-slate-100",
                collapsed && "justify-center"
              )
            }
          >
            <Settings size={18} />
            {!collapsed && <span className="text-sm">Settings</span>}
          </NavLink>

          {/* Profile */}
          <button
            onClick={() => {
              navigate("/home/profile");
              setOpen(false);
            }}
            className={clsx(
              "flex items-center gap-3 p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors",
              collapsed && "justify-center"
            )}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold shadow">
              {initials}
            </div>
            {!collapsed && (
              <span className="text-sm font-medium">{displayName}</span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              collapsed && "justify-center"
            )}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
