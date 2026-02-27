// 

import React, { useMemo, useState } from "react";
import { Search, Bell, RefreshCw, Shuffle } from "lucide-react";
import clsx from "clsx";
import { authClient } from "../../lib/auth-client";

interface TopbarProps {
  value?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onShuffle?: () => void;
  onRefresh?: () => void;
  onNotify?: () => void;
}

export default function Topbar({
  value = "",
  onSearchChange,
  onSearchSubmit,
  onShuffle,
  onRefresh,
  onNotify,
}: TopbarProps) {
  const [search, setSearch] = useState(value);
  const { data } = authClient.useSession();
  const user = data?.user;
  const initials = useMemo(() => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "U";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  }, [user?.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    onSearchChange?.(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(search);
  };

  return (
    <div className="sticky top-0 z-40 px-4 md:px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      
      <div className="flex items-center gap-4">
        
        {/* ============================== */}
        {/* 🔹 Search (Flexible Full Width) */}
        {/* ============================== */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 bg-white shadow-sm px-5 py-3 rounded-2xl border border-gray-200 
                     flex-1 max-w-3xl mx-auto
                     focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-300"
        >
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Search stocks, indices..."
            className="outline-none w-full text-sm md:text-base bg-transparent placeholder:text-gray-400"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                onSearchChange?.("");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </form>

        {/* ============================== */}
        {/* 🔹 Actions */}
        {/* ============================== */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          
          <IconButton onClick={onShuffle}>
            <Shuffle size={18} />
          </IconButton>

          <IconButton onClick={onRefresh} rotate>
            <RefreshCw size={18} />
          </IconButton>

          <IconButton onClick={onNotify}>
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </IconButton>

          {/* Profile */}
          <div className="hidden sm:flex items-center pl-2 border-l border-gray-200">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name ?? "User"}
                className="w-9 h-9 rounded-full object-cover shadow"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow">
                {initials}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ============================== */
/* 🔹 Icon Button */
/* ============================== */
function IconButton({
  children,
  onClick,
  rotate = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  rotate?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative p-3 rounded-xl bg-white border border-gray-200 shadow-sm",
        "hover:shadow-md hover:-translate-y-0.5 active:scale-90",
        "transition-all duration-200",
        rotate && "hover:rotate-180 duration-300"
      )}
    >
      {children}
    </button>
  );
}
