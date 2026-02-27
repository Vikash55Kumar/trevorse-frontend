import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import type { UserWithRole } from "../types/auth";
import {
  deleteInvitation,
  inviteUser,
  listInvitations,
  listUsers,
  resendInvitation,
  updateUserRole,
} from "../lib/api";

type Role = "ADMIN" | "USER" | "MENTOR";

interface Invitation {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  createdAt: string;
  expiresAt: string;
}

interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  image?: string | null;
  createdAt: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;
  const role = (currentUser as UserWithRole | undefined)?.role;
  const isAdmin = role === "ADMIN";

  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("USER");

  useEffect(() => {
    if (!isPending && !isAdmin) {
      navigate("/home", { replace: true });
    }
  }, [isPending, isAdmin, navigate]);

  const initials = useMemo(() => {
    if (!currentUser?.name) return "A";
    const parts = currentUser.name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "A";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
  }, [currentUser?.name]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, inviteRes] = await Promise.all([
        listUsers(),
        listInvitations(),
      ]);
      setUsers(userRes?.data ?? []);
      setInvitations(inviteRes?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setToast(null);

    if (!inviteName || !inviteEmail) {
      setError("Name and email are required.");
      return;
    }

    setInviteLoading(true);
    try {
      await inviteUser({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
      });
      setSuccess("Invitation sent.");
      setToast({ type: "success", text: "Invitation sent." });
      setInviteName("");
      setInviteEmail("");
      setInviteRole("USER");
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send invitation";
      setError(message);
      setToast({ type: "error", text: message });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleResend = async (email: string) => {
    setError(null);
    setSuccess(null);
    setToast(null);
    setResendLoading(email);
    try {
      await resendInvitation(email);
      setSuccess("Invitation resent.");
      setToast({ type: "success", text: "Invitation resent." });
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to resend invitation";
      setError(message);
      setToast({ type: "error", text: message });
    } finally {
      setResendLoading(null);
    }
  };

  const handleRoleChange = async (id: string, role: Role) => {
    setError(null);
    setSuccess(null);
    setToast(null);
    setRoleLoading(id);
    try {
      await updateUserRole(id, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u))
      );
      setSuccess("Role updated.");
      setToast({ type: "success", text: "Role updated." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update role";
      setError(message);
      setToast({ type: "error", text: message });
    } finally {
      setRoleLoading(null);
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    setError(null);
    setSuccess(null);
    setToast(null);
    setDeleteLoading(id);
    try {
      await deleteInvitation(id);
      setInvitations((prev) => prev.filter((invite) => invite.id !== id));
      setSuccess("Invitation deleted.");
      setToast({ type: "success", text: "Invitation deleted." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete invitation";
      setError(message);
      setToast({ type: "error", text: message });
    } finally {
      setDeleteLoading(null);
    }
  };

  if (isPending) {
    return <div className="p-6 text-sm text-slate-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`rounded-lg px-4 py-3 text-sm shadow-lg border ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">Admin Console</h1>
            <p className="text-sm text-gray-500">
              Manage invitations and user roles
            </p>
          </div>
          <button
            onClick={() => navigate("/home")}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Back to dashboard
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
          {currentUser?.image ? (
            <img
              src={currentUser.image}
              alt={currentUser.name ?? "Admin"}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
              {initials}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">
              {currentUser?.name ?? "Admin"}
            </h2>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold">Invite New User</h2>
          <p className="text-sm text-gray-500 mt-1">
            Send an email invitation to onboard new members.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleInvite}>
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <select
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
              >
                <option value="USER">User</option>
                <option value="MENTOR">Mentor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              disabled={inviteLoading}
            >
              {inviteLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </span>
              ) : (
                "Send Invitation"
              )}
            </button>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-emerald-700 bg-emerald-50 rounded-md px-3 py-2">
                {success}
              </p>
            )}
          </form>
          </section>

        <section className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Pending Invitations</h2>
              <p className="text-sm text-gray-500">
                Track and resend invitations before they expire.
              </p>
            </div>
            <button
              onClick={loadData}
              className="text-sm text-gray-600 hover:text-gray-900"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2">User</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Expires</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {invitations.length === 0 && (
                  <tr>
                    <td className="py-4 text-gray-500" colSpan={5}>
                      No invitations found.
                    </td>
                  </tr>
                )}
                {invitations.map((invite) => (
                  <tr key={invite.id} className="border-b last:border-b-0">
                    <td className="py-3">
                      <div className="font-medium">{invite.name}</div>
                      <div className="text-gray-500">{invite.email}</div>
                    </td>
                    <td className="py-3">{invite.role}</td>
                    <td className="py-3">{invite.status}</td>
                    <td className="py-3 text-gray-500">
                      {new Date(invite.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleResend(invite.email)}
                          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-60"
                          disabled={resendLoading === invite.email}
                        >
                          {resendLoading === invite.email ? "Resending..." : "Resend"}
                        </button>
                        <button
                          onClick={() => handleDeleteInvitation(invite.id)}
                          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-60"
                          disabled={deleteLoading === invite.id}
                        >
                          {deleteLoading === invite.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">User Management</h2>
            <p className="text-sm text-gray-500">
              Update roles for existing users.
            </p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">User</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2 text-right">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-b-0">
                  <td className="py-3 font-medium">
                    {user.name ?? "Unnamed"}
                  </td>
                  <td className="py-3 text-gray-500">{user.email}</td>
                  <td className="py-3">
                    <div className="inline-flex items-center gap-2">
                      <select
                        className="rounded-md border border-gray-200 px-2 py-1 text-sm"
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as Role)
                        }
                        disabled={roleLoading === user.id}
                      >
                        <option value="USER">User</option>
                        <option value="MENTOR">Mentor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      {roleLoading === user.id && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-right text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </section>
      </div>
    </div>
  );
}
