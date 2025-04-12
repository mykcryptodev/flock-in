export async function getUserAddresses(fids: number[]): Promise<Record<number, string>> {
  try {
    const response = await fetch(`/api/users/get?fids=${fids.join(',')}`);
    console.log({
      response
    })
    if (!response.ok) {
      throw new Error('Failed to fetch user addresses');
    }
    const data = await response.json();
    // Extract addresses from the users array
    return data.users.reduce((acc: Record<number, string>, user: any) => {
      acc[user.fid] = user.verified_addresses?.primary?.eth_address || user.custody_address;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return {};
  }
}

export async function getUserAddress(fid: number): Promise<string | null> {
  const addresses = await getUserAddresses([fid]);
  return addresses[fid] || null;
}