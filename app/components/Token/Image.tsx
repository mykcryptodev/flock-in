import { CHAIN } from "@/app/constants";
import { useEffect, useState } from "react";

export const TokenImage = ({ token, className }: { token: string, className?: string }) => {
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    fetch(`/api/tokens/image?address=${token}&chain=${CHAIN.name}`).then(res => res.json()).then(data => setImage(data.image));
  }, [token]);

  return <img src={image ?? ""} alt={token} className={className} />;
};