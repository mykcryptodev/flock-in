/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import React from 'react';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fid = searchParams.get('fid');

  try {
    // If we have an fid, fetch user data
    let userData = null;
    if (fid) {
      const response = await fetch(`https://api.warpcast.com/v2/user?fid=${fid}`);
      if (response.ok) {
        userData = await response.json();
      }
    }

    console.log(JSON.stringify(userData, null, 2));

    // Load fonts
    const [boldFont, mediumFont] = await Promise.all([
      fetch(new URL('/fonts/Segment/Segment-Bold.otf', request.url)).then((res) => res.arrayBuffer()),
      fetch(new URL('/fonts/Segment/Segment-Medium.otf', request.url)).then((res) => res.arrayBuffer()),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #FF6B6B 0%, rgba(255, 217, 61, 0.5) 100%)',
            padding: '40px',
            fontFamily: 'Segment',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <img
                src="https://flock-in.vercel.app/fire.png"
                width={64}
                height={64}
                alt="logo"
                style={{
                  objectFit: 'contain'
                }}
              />
              {process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}
            </h1>
            {userData && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '100%',
                    overflow: 'hidden',
                    width: '80px',
                    height: '80px',
                  }}
                >
                  <img
                    src={fid === "239" ? "https://i.imgur.com/wgpZSDW.jpeg" : userData.result.user.pfp?.url}
                    width={80}
                    height={80}
                    style={{
                      borderRadius: '100%',
                    }}
                    alt={userData.result.user.displayName}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <p style={{ fontSize: '32px', fontWeight: 'bold' }}>
                    {userData.result.user.displayName}
                  </p>
                </div>
              </div>
            )}
            <p
              style={{
                fontSize: '24px',
                color: '#666',
                textAlign: 'center',
                maxWidth: '600px',
              }}
            >
              Pay for videos from your favorite Farcaster creators or become a creator yourself!
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Segment',
            data: boldFont,
            weight: 700,
            style: 'normal',
          },
          {
            name: 'Segment',
            data: mediumFont,
            weight: 500,
            style: 'normal',
          },
        ],
      }
    );
  } catch (error) {
    console.error('Error generating frame image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
} 