/* eslint-disable @next/next/no-img-element */
"use client";

import { useUserStore, FarcasterUser } from "../store/userStore";
import { useEffect, useState } from "react";

const TRENDING_USERS = [
  { fid: "239", username: "ted", avatar: "https://i.imgur.com/wgpZSDW.jpeg" },
  { fid: "993072", username: "wakaflocka", avatar: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/cb9d7870-ce33-4d1e-442d-4063b3e38700/rectcrop3" },
  { fid: "217248", username: "myk.eth", avatar: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/5ab39123-9da1-408c-ae95-6bbd1ae65500/original" },
];

export function TrendingUsers() {
  const { setSelectedUser } = useUserStore();
  const [users, setUsers] = useState<FarcasterUser[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userPromises = TRENDING_USERS.map(async (user) => {
        try {
          const response = await fetch(`/api/users/get?fids=${user.fid}`);
          const data = await response.json();
          if (data.users?.length) {
            return data.users[0];
          }
          return null;
        } catch (error) {
          console.error(`Error fetching user ${user.fid}:`, error);
          return null;
        }
      });

      const fetchedUsers = await Promise.all(userPromises);
      setUsers(fetchedUsers.filter((user): user is FarcasterUser => user !== null));
    };

    fetchUserDetails();
  }, []);

  const handleUserClick = async (fid: string) => {
    try {
      const response = await fetch(`/api/users/get?fids=${fid}`);
      const data = await response.json();
      if (data.users?.length) {
        setSelectedUser(data.users[0]);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Trending Users</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {users.map((user) => (
          <button
            key={user.fid}
            onClick={() => handleUserClick(user.fid.toString())}
            className="flex flex-col items-center gap-1 min-w-[80px]"
          >
            <img
              src={user.pfp_url}
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-xs text-gray-600 truncate max-w-[80px]">
              {user.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 