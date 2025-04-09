import { FC, useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useUserStore, FarcasterUser } from "../store/userStore";

export const UserSearch: FC = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<FarcasterUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { selectedUser, setSelectedUser } = useUserStore();
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedSearch) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(debouncedSearch)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.result.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchUsers();
  }, [debouncedSearch]);

  const handleUserSelect = (user: FarcasterUser) => {
    setSelectedUser(user);
    setSearch("");
    setUsers([]);
  };

  return (
    <div className="w-full max-w-md">
      {selectedUser ? (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedUser.pfp_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={selectedUser.pfp_url} 
                  alt={selectedUser.username} 
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <div className="font-medium">{selectedUser.display_name}</div>
                <div className="text-sm text-gray-500">@{selectedUser.username}</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Change User
            </button>
          </div>
        </div>
      ) : (
        <>
          <input 
            type="text" 
            placeholder="Search for a user" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          />
          
          {isLoading && <div className="mt-2 text-gray-500">Loading...</div>}
          
          {error && <div className="mt-2 text-red-500">{error}</div>}
          
          {users.length > 0 && (
            <div className="mt-4 space-y-2">
              {users.map((user) => (
                <div 
                  key={user.fid} 
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  {user.pfp_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={user.pfp_url} 
                      alt={user.username} 
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">{user.display_name}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
