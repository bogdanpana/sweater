"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ShareWithFrame from "./components/ShareWithFrame";

type Participant = {
  id: string;
  nickname: string;
  photo_url: string;
  votes_count: number;
};

export default function UploadPage() {
  const [nickname, setNickname] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedParticipant, setUploadedParticipant] = useState<Participant | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [changingPhoto, setChangingPhoto] = useState(false);

  useEffect(() => {
    checkUploadStatus();
  }, []);

  async function checkUploadStatus() {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      if (data.has_uploaded) {
        setHasUploaded(true);
        // Get participant data
        const participantRes = await fetch("/api/my-participant");
        const participantData = await participantRes.json();
        if (participantData.participant) {
          setUploadedParticipant(participantData.participant);
          setNickname(participantData.participant.nickname);
        }
      }
    } catch (err) {
      console.error("Error checking status:", err);
    }
  }

  // Simulate upload for testing (remove in production)
  function simulateUpload() {
    setUploadedParticipant({
      id: "demo-123",
      nickname: nickname || "Demo User",
      photo_url: preview || "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=400&fit=crop",
      votes_count: 0
    });
    setHasUploaded(true);
    setMsg("✅ Simulare: Ești în concurs 🎅🎄");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }

  async function handleChangePhoto() {
    if (!file) {
      setMsg("❌ Te rog selectează o poză nouă.");
      return;
    }

    setBusy(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/update-photo", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) throw new Error(json?.error || "Update failed");
      
      setMsg("✅ Poza a fost actualizată! 🎅");
      setChangingPhoto(false);
      setFile(null);
      setPreview(null);
      
      // Refresh participant data
      const participantRes = await fetch("/api/my-participant");
      const participantData = await participantRes.json();
      if (participantData.participant) {
        setUploadedParticipant(participantData.participant);
      }
    } catch (err: any) {
      setMsg(err?.message || "❌ Eroare");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!nickname.trim()) return setMsg("❌ Te rog un nume/poreclă.");
    if (!file) return setMsg("❌ Te rog încarcă o poză.");

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("nickname", nickname.trim());
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) throw new Error(json?.error || "Upload failed");
      setMsg("✅ Încărcat! Ești în concurs 🎅🎄");
      setHasUploaded(true);
      setUploadedParticipant(json.participant);
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      setMsg(err?.message || "❌ Eroare");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ 
      maxWidth: 720, 
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
            🧥 Încarcă puloverul tău
          </div>
          <h1 className="christmas-title" style={{
            margin: 0,
            fontSize: "clamp(28px, 8vw, 36px)"
          }}>
            Upload Pulover
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

      {hasUploaded && uploadedParticipant ? (
        <>
          {/* Success View - After Upload */}
          <div className="christmas-card" style={{ marginTop: 24, textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: 16 }}>🎉</div>
            <h2 style={{ 
              fontSize: "clamp(24px, 6vw, 32px)", 
              marginBottom: 12,
              color: "#fef3c7"
            }}>
              Ești în concurs! 🎅
            </h2>
            <p style={{ 
              fontSize: "clamp(16px, 4vw, 18px)",
              opacity: 0.9,
              marginBottom: 24
            }}>
              <strong style={{ color: "#fbbf24" }}>{uploadedParticipant.nickname}</strong>
              <br />
              🗳️ {uploadedParticipant.votes_count} voturi
            </p>

            <div style={{ 
              marginBottom: 24,
              borderRadius: 16,
              overflow: "hidden",
              border: "2px solid rgba(220, 38, 38, 0.3)"
            }}>
              <img 
                src={uploadedParticipant.photo_url} 
                alt={uploadedParticipant.nickname}
                style={{ 
                  width: "100%", 
                  maxWidth: "400px",
                  height: "auto",
                  display: "block",
                  margin: "0 auto"
                }} 
              />
            </div>

            {!changingPhoto ? (
              <button
                onClick={() => setChangingPhoto(true)}
                className="christmas-button"
                style={{
                  width: "100%",
                  fontSize: "clamp(16px, 4vw, 18px)",
                  padding: "16px 24px",
                  minHeight: "56px",
                  marginBottom: 16,
                  background: "linear-gradient(135deg, var(--christmas-green) 0%, #16a34a 100%)"
                }}
              >
                📸 Schimbă poza
              </button>
            ) : (
              <div className="christmas-card" style={{ marginTop: 20, textAlign: "left" }}>
                <label style={{ 
                  display: "block", 
                  fontSize: "clamp(14px, 4vw, 16px)", 
                  fontWeight: 600,
                  marginBottom: 12,
                  color: "#fef3c7"
                }}>
                  📸 Selectează poza nouă
                </label>
                <div className="christmas-file-input" style={{ padding: "20px" }}>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    disabled={busy}
                    style={{ 
                      width: "100%",
                      cursor: busy ? "not-allowed" : "pointer",
                      fontSize: "16px"
                    }}
                  />
                  {preview && (
                    <div style={{ 
                      marginTop: 16,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "2px solid rgba(220, 38, 38, 0.3)"
                    }}>
                      <img 
                        src={preview} 
                        alt="Preview" 
                        style={{ 
                          width: "100%", 
                          maxHeight: "300px",
                          objectFit: "contain",
                          display: "block"
                        }} 
                      />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  <button
                    onClick={handleChangePhoto}
                    disabled={busy || !file}
                    className="christmas-button"
                    style={{
                      flex: 1,
                      fontSize: "clamp(16px, 4vw, 18px)",
                      padding: "16px 24px",
                      minHeight: "56px"
                    }}
                  >
                    {busy ? "⏳ Se actualizează…" : "✅ Salvează"}
                  </button>
                  <button
                    onClick={() => {
                      setChangingPhoto(false);
                      setFile(null);
                      setPreview(null);
                    }}
                    className="christmas-button"
                    style={{
                      flex: 1,
                      fontSize: "clamp(16px, 4vw, 18px)",
                      padding: "16px 24px",
                      minHeight: "56px",
                      background: "rgba(10, 14, 19, 0.6)",
                      border: "2px solid rgba(220, 38, 38, 0.3)"
                    }}
                  >
                    Anulează
                  </button>
                </div>
              </div>
            )}

            {msg && (
              <div style={{ 
                marginTop: 20, 
                padding: "16px",
                borderRadius: 12,
                background: msg.includes("✅") 
                  ? "rgba(22, 163, 74, 0.2)" 
                  : "rgba(220, 38, 38, 0.2)",
                border: msg.includes("✅")
                  ? "2px solid rgba(22, 163, 74, 0.4)"
                  : "2px solid rgba(220, 38, 38, 0.4)",
                color: msg.includes("✅") ? "#86efac" : "#fca5a5",
                fontWeight: 600,
                fontSize: 15
              }}>
                {msg}
              </div>
            )}
          </div>

          {/* Share with Frame */}
          <ShareWithFrame 
            photoUrl={uploadedParticipant.photo_url} 
            nickname={uploadedParticipant.nickname}
          />
        </>
      ) : (
        /* Upload Form - First Time */
        <form onSubmit={onSubmit} className="christmas-card" style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ 
              display: "block", 
              fontSize: "clamp(14px, 4vw, 16px)", 
              fontWeight: 600,
              marginBottom: 12,
              color: "#fef3c7"
            }}>
              🎄 Nume / Poreclă
            </label>
            <input
              className="christmas-input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="ex: Renul Turbo, Moș Crăciun, etc."
              disabled={busy}
              autoComplete="off"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ 
              display: "block", 
              fontSize: "clamp(14px, 4vw, 16px)", 
              fontWeight: 600,
              marginBottom: 12,
              color: "#fef3c7"
            }}>
              📸 Poză (poți folosi camera)
            </label>
            <div className="christmas-file-input" style={{ padding: "20px" }}>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                disabled={busy}
                style={{ 
                  width: "100%",
                  cursor: busy ? "not-allowed" : "pointer",
                  fontSize: "16px"
                }}
              />
              {preview && (
                <div style={{ 
                  marginTop: 16,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "2px solid rgba(220, 38, 38, 0.3)"
                }}>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{ 
                      width: "100%", 
                      maxHeight: "300px",
                      objectFit: "contain",
                      display: "block"
                    }} 
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="christmas-button"
            style={{
              width: "100%",
              fontSize: "clamp(16px, 4.5vw, 18px)",
              padding: "18px 24px",
              minHeight: "56px"
            }}
          >
            {busy ? "⏳ Se încarcă…" : "🎅 Încarcă (o singură dată)"}
          </button>

          {msg && (
            <div style={{ 
              marginTop: 20, 
              padding: "16px",
              borderRadius: 12,
              background: msg.includes("✅") 
                ? "rgba(22, 163, 74, 0.2)" 
                : "rgba(220, 38, 38, 0.2)",
              border: msg.includes("✅")
                ? "2px solid rgba(22, 163, 74, 0.4)"
                : "2px solid rgba(220, 38, 38, 0.4)",
              color: msg.includes("✅") ? "#86efac" : "#fca5a5",
              fontWeight: 600,
              fontSize: 15
            }}>
              {msg}
            </div>
          )}

          <p style={{ 
            marginTop: 20, 
            opacity: 0.7, 
            fontSize: 13, 
            lineHeight: 1.6,
            textAlign: "center"
          }}>
            ⚠️ Notă: această acțiune este permisă o singură dată pe device.
          </p>

          {/* Simulare pentru testare */}
          {process.env.NODE_ENV === "development" && (
            <button
              type="button"
              onClick={simulateUpload}
              disabled={!preview}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "12px 20px",
                borderRadius: 12,
                border: "2px solid rgba(251, 191, 36, 0.4)",
                background: "rgba(251, 191, 36, 0.1)",
                color: "#fbbf24",
                fontWeight: 600,
                fontSize: 14,
                cursor: preview ? "pointer" : "not-allowed",
                opacity: preview ? 1 : 0.5
              }}
            >
              🧪 Simulează upload (pentru testare)
            </button>
          )}
        </form>
      )}
    </main>
  );
}
