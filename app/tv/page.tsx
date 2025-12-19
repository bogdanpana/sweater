"use client";

import { useEffect, useMemo, useState } from "react";
import type { Participant } from "@/lib/types";
import MobileLeaderboard from "./components/MobileLeaderboard";
import TvLeaderboard from "./components/TvLeaderboard";
import Countdown from "./components/Countdown";

// Demo participants pentru preview
const DEMO_PARTICIPANTS: Participant[] = [
  {
    id: "demo-1",
    nickname: "Renul Turbo",
    photo_url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=400&fit=crop",
    votes_count: 42,
    approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-2",
    nickname: "Moș Crăciun",
    photo_url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop",
    votes_count: 38,
    approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-3",
    nickname: "Elf Zburător",
    photo_url: "https://images.unsplash.com/photo-1482517967863-9e9926eea1a0?w=400&h=400&fit=crop",
    votes_count: 35,
    approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-4",
    nickname: "Bomba de Crăciun",
    photo_url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop",
    votes_count: 28,
    approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-5",
    nickname: "Stea Polară",
    photo_url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=400&fit=crop",
    votes_count: 24,
    approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-6",
    nickname: "Fulgi de Zăpadă",
    photo_url: "https://images.unsplash.com/photo-1482517967863-9e9926eea1a0?w=400&h=400&fit=crop",
    votes_count: 19,
    approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-7",
    nickname: "Brad Magic",
    photo_url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop",
    votes_count: 15,
    approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-8",
    nickname: "Căciulă Roșie",
    photo_url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=400&fit=crop",
    votes_count: 12,
    approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-9",
    nickname: "Jingle Bells",
    photo_url: "https://images.unsplash.com/photo-1482517967863-9e9926eea1a0?w=400&h=400&fit=crop",
    votes_count: 8,
    approved: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-10",
    nickname: "Cărbune Dulce",
    photo_url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop",
    votes_count: 5,
    approved: true,
    created_at: new Date().toISOString()
  }
];

export default function TvPage() {
  const [items, setItems] = useState<Participant[]>([]);
  const [ts, setTs] = useState<string>(new Date().toLocaleTimeString());
  const [useDemo, setUseDemo] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const qrUrl = "https://sweater-vercel.vercel.app/";

  useEffect(() => {
    let alive = true;

    async function tick() {
      try {
        const res = await fetch("/api/leaderboard?limit=10", { cache: "no-store" });
        if (!res.ok) {
          if (alive) {
            setUseDemo(true);
            setItems(DEMO_PARTICIPANTS);
            setTs(new Date().toLocaleTimeString());
          }
          return;
        }
        const json = await res.json();
        if (alive) {
          const fetchedItems = json.items || [];
          if (fetchedItems.length > 0) {
            setUseDemo(false);
            setItems(fetchedItems);
          } else {
            setUseDemo(true);
            setItems(DEMO_PARTICIPANTS);
          }
          setTs(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error("Error loading leaderboard:", err);
        if (alive) {
          setUseDemo(true);
          setItems(DEMO_PARTICIPANTS);
        }
      }
    }

    tick();
    const id = setInterval(tick, 2000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const sorted = useMemo(() => [...items].sort((a, b) => b.votes_count - a.votes_count), [items]);

  // Detect mobile vs TV
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <main className="tv-main" style={{
      padding: "40px",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e13 0%, #1a1f2e 50%, #0a0e13 100%)"
    }}>
      <div className="tv-container" style={{
        maxWidth: 1920,
        margin: "0 auto",
        height: "100%",
        display: "flex",
        gap: 32
      }}>
        {/* Left: Leaderboard */}
        <section className="christmas-card" style={{
          flex: 1,
          padding: "24px 32px",
          minHeight: "calc(100vh - 80px)",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 className="christmas-title" style={{
              margin: 0,
              fontSize: "48px",
              lineHeight: 1.1,
              marginBottom: 4
            }}>
              🏆 Leaderboard
            </h1>
            <div style={{
              fontSize: "20px",
              opacity: 0.85,
              marginBottom: 12,
              color: "#fbbf24",
              fontWeight: 600
            }}>
              Ugliest Christmas Sweater Contest
            </div>
            {!isMobile && (
              <div style={{
                opacity: 0.9,
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                borderRadius: 20,
                background: "rgba(220, 38, 38, 0.2)",
                border: "2px solid rgba(220, 38, 38, 0.3)",
                width: "fit-content",
                marginTop: 8
              }}>
                <span>🔴</span>
                <Countdown initialHours={5} />
              </div>
            )}
          </div>

          {/* Leaderboard Content */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            {isMobile ? (
              <div style={{ maxHeight: "100%", overflowY: "auto" }}>
                <MobileLeaderboard participants={sorted} />
              </div>
            ) : (
              <TvLeaderboard participants={sorted} />
            )}
          </div>
        </section>

        {/* Right: QR Code Card */}
        {!isMobile && (
          <aside className="tv-qr-card" style={{
            width: "380px",
            flexShrink: 0,
            padding: "32px",
            background: "rgba(10, 14, 19, 0.8)",
            borderRadius: 20,
            border: "2px solid rgba(220, 38, 38, 0.3)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 80px)"
          }}>
            <h2 className="christmas-title" style={{
              margin: 0,
              fontSize: "28px",
              marginBottom: 24,
              textAlign: "center"
            }}>
              📱 Scanează și votează
            </h2>

            {/* QR Code Image */}
            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: 16,
              marginBottom: 24
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrUrl)}`}
                alt="QR Code"
                width="280"
                height="280"
                style={{ display: "block" }}
              />
            </div>

            <p style={{
              marginTop: 0,
              opacity: 0.9,
              lineHeight: 1.6,
              fontSize: "16px",
              marginBottom: 24,
              textAlign: "center"
            }}>
              Un vot + un upload per device.
              <br />
              Fără conturi. Doar pulovere. 🎄
            </p>

            <div style={{
              padding: "16px",
              borderRadius: 12,
              border: "2px solid rgba(220, 38, 38, 0.2)",
              background: "rgba(0, 0, 0, 0.3)",
              width: "100%"
            }}>
              <div style={{
                fontSize: "13px",
                opacity: 0.8,
                marginBottom: 8,
                fontWeight: 600,
                color: "#fbbf24",
                textAlign: "center"
              }}>
                🔗 Link direct:
              </div>
              <div style={{
                fontWeight: 700,
                wordBreak: "break-all",
                fontSize: "14px",
                color: "#fef3c7",
                padding: "12px",
                background: "rgba(0, 0, 0, 0.4)",
                borderRadius: 8,
                fontFamily: "monospace",
                textAlign: "center",
                lineHeight: 1.5
              }}>
                {qrUrl}
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
