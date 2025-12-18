"use client";

import { useEffect, useState } from "react";
import type { Participant } from "@/lib/types";

interface TvLeaderboardProps {
  participants: Participant[];
}

const ROTATION_INTERVAL = 6000; // 6 secunde pentru tranziții mai smooth

export default function TvLeaderboard({ participants }: TvLeaderboardProps) {
  const sorted = [...participants].sort((a, b) => b.votes_count - a.votes_count);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (sorted.length === 0) return;

    const interval = setInterval(() => {
      setFocusedIndex((prev) => (prev + 1) % sorted.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [sorted.length]);

  if (sorted.length === 0) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "120px 40px",
        opacity: 0.7
      }}>
        <div style={{ fontSize: "96px", marginBottom: 24 }}>🎄</div>
        <p style={{ fontSize: "32px" }}>
          Încă nu sunt participanți. Fii primul! 🧥
        </p>
      </div>
    );
  }

  // Get visible participants (focused + 2 on each side)
  const getVisibleParticipants = () => {
    const visible = [];
    const total = sorted.length;
    
    for (let i = -2; i <= 2; i++) {
      const index = (focusedIndex + i + total) % total;
      visible.push({ ...sorted[index], originalIndex: index });
    }
    
    return visible;
  };

  const visible = getVisibleParticipants();

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      padding: "20px 40px",
      minHeight: "600px",
      position: "relative"
    }}>
      {visible.map((p, displayIdx) => {
        const isFocused = displayIdx === 2;
        const scale = isFocused ? 1 : 0.65;
        const opacity = isFocused ? 1 : 0.35;
        const zIndex = isFocused ? 10 : displayIdx < 2 ? 3 - displayIdx : 3 - (displayIdx - 2);
        const translateY = isFocused ? 0 : 40;
        
        // Calculate overlap positioning
        const cardWidth = isFocused ? 600 : 250;
        const overlap = isFocused ? 0 : -80; // Negative gap creates overlap
        const leftOffset = displayIdx === 0 ? -cardWidth * 0.3 : 
                          displayIdx === 1 ? -cardWidth * 0.15 :
                          displayIdx === 2 ? 0 :
                          displayIdx === 3 ? cardWidth * 0.15 : cardWidth * 0.3;

        return (
          <div
            key={`${p.id}-${displayIdx}`}
            className="tv-focus-card"
            style={{
              flex: isFocused ? "1 1 600px" : "0 0 250px",
              maxWidth: isFocused ? "600px" : "250px",
              transform: `scale(${scale}) translateY(${translateY}px) translateX(${leftOffset}px)`,
              opacity: opacity,
              transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              zIndex: zIndex,
              position: "relative",
              willChange: "transform, opacity",
              marginLeft: displayIdx > 0 ? overlap : 0
            }}
          >
            <div 
              className="christmas-card"
              style={{ 
                overflow: "hidden",
                padding: 0,
                borderRadius: 32,
                boxShadow: isFocused 
                  ? "0 30px 80px rgba(220, 38, 38, 0.6), 0 0 0 4px rgba(220, 38, 38, 0.2)" 
                  : "0 8px 24px rgba(0, 0, 0, 0.3)",
                border: isFocused ? "3px solid rgba(251, 191, 36, 0.5)" : "none",
                transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              }}
            >
              {p.originalIndex < 3 && (
                <div style={{
                  position: "absolute",
                  top: isFocused ? 24 : 16,
                  right: isFocused ? 24 : 16,
                  background: p.originalIndex === 0 
                    ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                    : p.originalIndex === 1
                    ? "linear-gradient(135deg, #94a3b8, #64748b)"
                    : "linear-gradient(135deg, #f97316, #ea580c)",
                  color: "white",
                  padding: isFocused ? "14px 28px" : "10px 20px",
                  borderRadius: 32,
                  fontSize: isFocused ? "32px" : "18px",
                  fontWeight: 900,
                  zIndex: 10,
                  boxShadow: isFocused 
                    ? "0 12px 32px rgba(0,0,0,0.6)" 
                    : "0 6px 20px rgba(0,0,0,0.4)",
                  border: "4px solid white",
                  transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }}>
                  {p.originalIndex === 0 ? "🥇 #1" : p.originalIndex === 1 ? "🥈 #2" : "🥉 #3"}
                </div>
              )}
              <div style={{ 
                aspectRatio: "1/1", 
                position: "relative",
                background: "linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(22, 163, 74, 0.1))"
              }}>
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
                    {p.originalIndex >= 3 && (
                      <div style={{
                        position: "absolute",
                        top: isFocused ? 24 : 16,
                        left: isFocused ? 24 : 16,
                        background: "rgba(0, 0, 0, 0.85)",
                        color: "white",
                        padding: isFocused ? "12px 20px" : "8px 16px",
                        borderRadius: 28,
                        fontSize: isFocused ? "28px" : "16px",
                        fontWeight: 900,
                        border: isFocused ? "2px solid rgba(251, 191, 36, 0.5)" : "none",
                        transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                      }}>
                        #{p.originalIndex + 1}
                      </div>
                    )}
              </div>
              <div style={{ 
                padding: isFocused ? "32px" : "20px", 
                background: "rgba(10, 14, 19, 0.95)",
                transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  gap: 16
                }}>
                  <div style={{ 
                    fontWeight: 800, 
                    fontSize: isFocused ? "32px" : "18px", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#fef3c7",
                    flex: 1,
                    transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  }}>
                    {p.nickname}
                  </div>
                  <div style={{ 
                    opacity: 0.95, 
                    fontSize: isFocused ? "28px" : "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#fbbf24",
                    fontWeight: 800,
                    flexShrink: 0,
                    transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  }}>
                    🗳️ {p.votes_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

