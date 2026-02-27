const API_BASE_URL = import.meta.env.VITE_API_URL;

export type ApiResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.message ?? "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export function getCurrentUser() {
  return apiFetch<ApiResponse<{ user: any; session: any }>>("/api/v1/users/me");
}

export function listUsers() {
  return apiFetch<ApiResponse<any[]>>("/api/v1/users/admin/users");
}

export function listInvitations() {
  return apiFetch<ApiResponse<any[]>>("/api/v1/users/admin/invitations");
}

export function inviteUser(payload: {
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "MENTOR";
}) {
  return apiFetch("/api/v1/users/invite", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resendInvitation(email: string) {
  return apiFetch("/api/v1/users/invite/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function updateUserRole(id: string, role: "ADMIN" | "USER" | "MENTOR") {
  return apiFetch(`/api/v1/users/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export function deleteInvitation(id: string) {
  return apiFetch(`/api/v1/users/admin/invitations/${id}`, {
    method: "DELETE",
  });
}

export function acceptInvitation(payload: {
  token: string;
  password: string;
  name?: string;
  callbackURL?: string;
  rememberMe?: boolean;
  image?: string;
}) {
  return apiFetch("/api/v1/users/accept-invitation", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function rejectInvitation(token: string) {
  return apiFetch("/api/v1/users/reject-invitation", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
