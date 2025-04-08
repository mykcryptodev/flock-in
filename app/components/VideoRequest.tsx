import { TransactionButton } from "@coinbase/onchainkit/transaction";
import { FC, useState } from "react";

const MAX_CHARS = 300;

export const VideoRequest: FC = () => {
  const [videoDescription, setVideoDescription] = useState('');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setVideoDescription(text);
    }
  };

  return (
    <div>
      <h1>Video Request</h1>
      <textarea
        value={videoDescription}
        onChange={handleDescriptionChange}
        placeholder="Describe what you want to see (max 1000 characters)"
        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <div className="text-sm text-gray-500 mt-1">
        {videoDescription.length}/{MAX_CHARS} characters
      </div>

      <button className="bg-blue-500 text-white p-2 rounded-md">Request Video</button>
    </div>
  );
};