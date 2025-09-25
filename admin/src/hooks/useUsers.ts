// hooks/useUsers.ts
import { useEffect, useState, useCallback } from "react";
import api from "../libs/axios";
export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role: string;
}

export function useUsers(page = 1, limit = 5) {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({ page, limit, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/users?page=${page}&limit=${limit}`);

      const data = await res.data;

      setUsers(data.data || data.users || []);
      setPagination({
        page: data.page ?? page,
        limit: data.limit ?? limit,
        total: data.total ?? 0,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, pagination, loading, error, refetchUsers: fetchUsers };
}
