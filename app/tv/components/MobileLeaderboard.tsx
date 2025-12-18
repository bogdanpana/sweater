"use client";

import type { Participant } from "@/lib/types";

interface MobileLeaderboardProps {
  participants: Participant[];
}

export default function MobileLeaderboard({ participants }: MobileLeaderboardProps) {
  const sorted = [...participants].sort((a, b) => b.votes_count - a.votes_count);

  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "16px"
    }}>
      {sorted.map((p, idx) => (
        <div 
          key={p.id} 
          className="christmas-card"
          style={{ 
            overflow: "hidden",
            padding: 0,
            position: "relative",
            borderRadius: 16
          }}
        >
          {idx < 3 && (
            <div style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: idx === 0 
                ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                : idx === 1
                ? "linear-gradient(135deg, #94a3b8, #64748b)"
                : "linear-gradient(135deg, #f97316, #ea580c)",
              color: "white",
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 900,
              zIndex: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              border: "2px solid white"
            }}>
              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
            </div>
          )}
          <div style={{ aspectRatio: "1/1", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={p.photo_url} 
              alt={p.nickname} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                display: "block"
              }} 
            />
            {idx >= 3 && (
              <div style={{
                position: "absolute",
                top: 8,
                left: 8,
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 800
              }}>
                #{idx + 1}
              </div>
            )}
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              gap: 8
            }}>
              <div style={{ 
                fontWeight: 800, 
                fontSize: "14px", 
                overflow: "hidden", 
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "#fef3c7",
                flex: 1
              }}>
                {p.nickname}
              </div>
              <div style={{ 
                opacity: 0.95, 
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "#fbbf24",
                fontWeight: 700,
                flexShrink: 0
              }}>
                🗳️ {p.votes_count}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

