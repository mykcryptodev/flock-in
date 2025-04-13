'use client';

import { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useAddFrame, useMiniKit } from "@coinbase/onchainkit/minikit";
import Check from "../svg/Check";

type Tab = 'users' | 'creators';

export const WelcomeModal: FC = () => {
  const { address } = useAccount();
  const { context } = useMiniKit();
  const addFrame = useAddFrame();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [frameAdded, setFrameAdded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame, setFrameAdded]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <button
          type="button"
          onClick={handleAddFrame}
          className="cursor-pointer bg-transparent font-semibold text-sm"
        >
          + GET NOTIFIED
        </button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-semibold animate-fade-out">
          <Check />
          <span>SAVED</span>
        </div>
      );
    }

    return null;
  }, [context, handleAddFrame, frameAdded]);

  useEffect(() => {
    const checkInstructions = async () => {
      if (address) {
        try {
          const response = await fetch(`/api/instructions?address=${address.toLowerCase()}`);
          const data = await response.json();
          const { hasSeen } = data;
          
          // Only show modal if hasSeen is explicitly false
          if (hasSeen === false) {
            setIsOpen(true);
          } else {
            setIsOpen(false);
          }
        } catch (error) {
          console.error('Failed to check instructions status:', error);
          setIsOpen(false);
        }
      }
    };
    checkInstructions();
  }, [address]);

  const handleClose = async () => {
    if (address) {
      setIsSaving(true);
      try {
        const response = await fetch('/api/instructions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address: address.toLowerCase() }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save instructions status');
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error('Failed to save instructions status');
        }
      } catch (error) {
        console.error('Failed to mark instructions as seen:', error);
        // We'll still close the modal even if saving fails
      } finally {
        setIsSaving(false);
      }
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fire.png" alt="Flock In Logo" className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Flock In!</h2>
          </div>
          {saveFrameButton}
        </div>
        
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 text-center font-medium ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pay
          </button>
          <button
            onClick={() => setActiveTab('creators')}
            className={`flex-1 py-2 px-4 text-center font-medium ${
              activeTab === 'creators'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Get Paid
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {activeTab === 'users' ? (
            <div>
              <p className="text-gray-700 mb-2">
                Flock In lets you pay for videos on Farcaster
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Make a request to someone on Farcaster for a video</li>
                <li>Wait for the creator to complete the video</li>
                <li>Review your experience to help others find great creators</li>
              </ol>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-2">
                Get paid for creating videos. Here is how to get started:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Go to your inbox to set up suggested payment amounts</li>
                <li>Wait for video requests from users</li>
                <li>Complete requests to get paid</li>
              </ul>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-blue-800 font-medium">💡 Pro Tip:</p>
            <button
              onClick={handleAddFrame}
              className="text-blue-700 mt-1 cursor-pointer text-left w-full"
            >
              <span className="underline">Save this mini app</span> to get notified about important updates for your videos and requests!
            </button>
          </div>

          <p className="text-gray-700">
            Ready to get started? Click the button below to begin!
          </p>
        </div>
        <button
          onClick={handleClose}
          disabled={isSaving}
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}; 