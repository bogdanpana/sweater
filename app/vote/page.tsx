"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Participant } from "@/lib/types";

export default function VotePage() {
  const [items, setItems] = useState<Participant[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Participant | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/leaderboard?limit=200", { cache: "no-store" });
        if (!res.ok) {
          setItems([]);
          return;
        }
        const json = await res.json();
        const items = json.items || [];
        
        // Check for demo votes in localStorage and update counts
        const votedDemos = JSON.parse(localStorage.getItem("demo_votes") || "[]");
        const updatedItems = items.map((p: Participant) => {
          if (p.id.startsWith("demo-") && votedDemos.includes(p.id)) {
            // Count how many times this demo was voted (for now, just add 1)
            return { ...p, votes_count: p.votes_count + 1 };
          }
          return p;
        });
        
        setItems(updatedItems);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => b.votes_count - a.votes_count);
  }, [items]);

  async function vote(participantId: string) {
    setMsg(null);
    const ok = confirm("🎄 Votezi acest pulover? Nu poți vota de două ori.");
    if (!ok) return;

    setBusyId(participantId);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Vote failed");
      
      // If demo vote, update local state
      if (json.demo || participantId.startsWith("demo-")) {
        setItems(prev => prev.map(p => 
          p.id === participantId 
            ? { ...p, votes_count: p.votes_count + 1 }
            : p
        ));
        // Store demo vote in localStorage to prevent double voting
        const votedDemos = JSON.parse(localStorage.getItem("demo_votes") || "[]");
        if (!votedDemos.includes(participantId)) {
          votedDemos.push(participantId);
          localStorage.setItem("demo_votes", JSON.stringify(votedDemos));
        }
      }
      
      setMsg("✅ Vot înregistrat! Mulțumim! 🎅");
    } catch (err: any) {
      setMsg(err?.message || "❌ Eroare");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main style={{ 
      maxWidth: 1200, 
      margin: "0 auto", 
      padding: "20px 16px", 
      minHeight: "100vh",
      paddingBottom: "40px"
    }}>
      <header style={{ 
        display: "flex", 
        flexDirection: "column",
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{ width: "100%" }}>
          <div style={{ 
            fontSize: "clamp(14px, 4vw, 16px)", 
            opacity: 0.9, 
            marginBottom: 8 
          }}>
            🗳️ Alege câștigătorul
          </div>
          <h1 className="christmas-title" style={{
            margin: 0,
            fontSize: "clamp(28px, 8vw, 36px)"
          }}>
            Votează Pulover
          </h1>
        </div>
        <Link 
          href="/" 
          className="christmas-button"
          style={{ 
            padding: "14px 20px", 
            fontSize: 15,
            textDecoration: "none",
            display: "block",
            textAlign: "center",
            width: "100%"
          }}
        >
          ← Înapoi
        </Link>
      </header>

      {msg && (
        <div style={{ 
          marginBottom: 24,
          padding: "16px 20px", 
          borderRadius: 16, 
          border: msg.includes("✅")
            ? "2px solid rgba(22, 163, 74, 0.4)"
            : "2px solid rgba(220, 38, 38, 0.4)",
          background: msg.includes("✅")
            ? "rgba(22, 163, 74, 0.2)"
            : "rgba(220, 38, 38, 0.2)",
          color: msg.includes("✅") ? "#86efac" : "#fca5a5",
          fontWeight: 600,
          fontSize: 15
        }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          fontSize: 18,
          opacity: 0.7
        }}>
          ⏳ Se încarcă pulovere...
        </div>
      ) : sorted.length === 0 ? (
        <div className="christmas-card" style={{
          textAlign: "center",
          padding: "60px 20px"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎄</div>
          <p style={{ fontSize: 18, opacity: 0.8 }}>
            Încă nu sunt pulovere încărcate. Fii primul! 🧥
          </p>
        </div>
      ) : (
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
          className="vote-grid"
        >
          {sorted.map((p, idx) => (
            <div 
              key={p.id} 
              className="christmas-card"
              style={{ 
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                padding: 0,
                margin: 0,
                borderRadius: 16,
                alignItems: "stretch"
              }}
            >
              {idx < 3 && (
                <div style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: idx === 0 
                    ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                    : idx === 1
                    ? "linear-gradient(135deg, #94a3b8, #64748b)"
                    : "linear-gradient(135deg, #f97316, #ea580c)",
                  color: "white",
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 800,
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                }}>
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                </div>
              )}
              <div 
                style={{ 
                  width: "120px",
                  minWidth: "120px",
                  background: "linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(22, 163, 74, 0.1))",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "stretch",
                  margin: 0,
                  padding: 0
                }}
                onClick={() => setSelectedImage(p)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={p.photo_url} 
                  alt={p.nickname} 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    display: "block",
                    minHeight: "120px",
                    margin: 0,
                    padding: 0,
                    verticalAlign: "bottom",
                    alignSelf: "stretch"
                  }} 
                />
              </div>
              <div style={{ 
                padding: 16, 
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minWidth: 0,
                alignSelf: "stretch"
              }}>
                <div>
                  <div style={{ 
                    fontWeight: 800, 
                    fontSize: "clamp(16px, 4vw, 18px)",
                    color: "#fef3c7",
                    marginBottom: 8,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {p.nickname}
                  </div>
                  <div style={{ 
                    opacity: 0.9, 
                    fontSize: "clamp(14px, 3.5vw, 16px)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#fbbf24",
                    fontWeight: 700,
                    marginBottom: 12
                  }}>
                    🗳️ {p.votes_count} voturi
                  </div>
                </div>
                <button
                  onClick={() => vote(p.id)}
                  disabled={busyId === p.id || (p.id.startsWith("demo-") && JSON.parse(localStorage.getItem("demo_votes") || "[]").includes(p.id))}
                  className="christmas-button"
                  style={{
                    width: "100%",
                    fontSize: "clamp(15px, 4vw, 17px)",
                    padding: "16px 12px",
                    minHeight: "52px",
                    opacity: (p.id.startsWith("demo-") && JSON.parse(localStorage.getItem("demo_votes") || "[]").includes(p.id)) ? 0.5 : 1,
                    fontWeight: 700
                  }}
                >
                  {busyId === p.id 
                    ? "⏳ Se trimite…" 
                    : (p.id.startsWith("demo-") && JSON.parse(localStorage.getItem("demo_votes") || "[]").includes(p.id))
                    ? "✅ Votat"
                    : "⭐ Votează"}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      <footer style={{ 
        marginTop: 40, 
        opacity: 0.7, 
        fontSize: 14,
        textAlign: "center",
        padding: "20px",
        borderRadius: 12,
        background: "rgba(10, 14, 19, 0.5)",
        border: "1px solid rgba(220, 38, 38, 0.2)"
      }}>
        <p style={{ margin: 0 }}>
          Ai un singur vot. Dacă trișezi o sa fii pe lista de copii obraznici a lui Moșu. 🎅
        </p>
      </footer>

      {/* Image Modal */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.3s ease"
          }}
          onClick={() => setSelectedImage(null)}
        >
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(220, 38, 38, 0.8)",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
              fontWeight: "bold"
            }}
          >
            ×
          </button>
          <div
            style={{
              maxWidth: "100%",
              maxHeight: "85vh",
              width: "auto",
              height: "auto",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(220, 38, 38, 0.4)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.photo_url}
              alt={selectedImage.nickname}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block"
              }}
            />
          </div>
          <div
            style={{
              marginTop: "20px",
              color: "white",
              fontSize: "clamp(18px, 5vw, 24px)",
              fontWeight: 800,
              textAlign: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage.nickname}
          </div>
          <div
            style={{
              marginTop: "8px",
              color: "#fbbf24",
              fontSize: "clamp(16px, 4vw, 20px)",
              fontWeight: 700,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            🗳️ {selectedImage.votes_count} voturi
          </div>
        </div>
      )}
    </main>
  );
}
