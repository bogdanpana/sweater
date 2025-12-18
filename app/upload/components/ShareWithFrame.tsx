"use client";

import { useState } from "react";
import { shareToFacebook, shareToInstagram, downloadImage } from "@/lib/shareUtils";
import ImageEditor from "./ImageEditor";

interface ShareWithFrameProps {
  photoUrl: string;
  nickname: string;
}

export default function ShareWithFrame({ photoUrl, nickname }: ShareWithFrameProps) {
  const [framedImage, setFramedImage] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleImageSaved(imageUrl: string) {
    setFramedImage(imageUrl);
    setShowEditor(false);
  }

  function handleEditorCancel() {
    setShowEditor(false);
  }

  async function handleFacebookShare() {
    if (framedImage) {
      const text = `Am participat la concursul Ugliest Christmas Sweater! Votează-mă! 🎄🧥`;
      await shareToFacebook(framedImage, text);
    }
  }

  async function handleInstagramShare() {
    if (framedImage) {
      await shareToInstagram(framedImage);
    }
  }

  function handleDownload() {
    if (framedImage) {
      downloadImage(framedImage, `pulover-${nickname}-${Date.now()}.png`);
    }
  }

  return (
    <div className="christmas-card" style={{ marginTop: 24, textAlign: "center" }}>
      <h2 style={{ 
        fontSize: "clamp(20px, 5vw, 24px)", 
        marginBottom: 20,
        color: "#fef3c7"
      }}>
        📱 Sharează cu frame
      </h2>

      {error && (
        <div style={{ 
          padding: "16px",
          background: "rgba(220, 38, 38, 0.2)",
          border: "2px solid rgba(220, 38, 38, 0.4)",
          borderRadius: 12,
          color: "#fca5a5",
          marginBottom: 20
        }}>
          {error}
        </div>
      )}

      {showEditor && !framedImage ? (
        <ImageEditor
          imageUrl={photoUrl}
          frameUrl="/images/frame.png"
          onSave={handleImageSaved}
          onCancel={handleEditorCancel}
        />
      ) : framedImage ? (
        <>
          <div style={{ 
            marginBottom: 24,
            borderRadius: 16,
            overflow: "hidden",
            border: "2px solid rgba(220, 38, 38, 0.3)",
            background: "#0b0f14"
          }}>
            <img 
              src={framedImage} 
              alt="Framed photo" 
              style={{ 
                width: "100%", 
                maxWidth: "500px",
                height: "auto",
                display: "block",
                margin: "0 auto"
              }} 
            />
          </div>

          <div style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: 12
          }}>
            <button
              onClick={handleFacebookShare}
              className="christmas-button"
              style={{
                width: "100%",
                fontSize: "clamp(16px, 4vw, 18px)",
                padding: "16px 24px",
                minHeight: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
            >
              📘 Share pe Facebook
            </button>

            <button
              onClick={handleInstagramShare}
              className="christmas-button"
              style={{
                width: "100%",
                fontSize: "clamp(16px, 4vw, 18px)",
                padding: "16px 24px",
                minHeight: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)"
              }}
            >
              📷 Share pe Instagram
            </button>

            <button
              onClick={handleDownload}
              className="christmas-button"
              style={{
                width: "100%",
                fontSize: "clamp(16px, 4vw, 18px)",
                padding: "16px 24px",
                minHeight: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "linear-gradient(135deg, var(--christmas-green) 0%, #16a34a 100%)"
              }}
            >
              💾 Descarcă poza cu frame
            </button>

            <button
              onClick={() => {
                setShowEditor(true);
                setFramedImage(null);
              }}
              className="christmas-button"
              style={{
                width: "100%",
                fontSize: "clamp(16px, 4vw, 18px)",
                padding: "16px 24px",
                minHeight: "56px",
                marginTop: 12,
                background: "rgba(10, 14, 19, 0.6)",
                border: "2px solid rgba(220, 38, 38, 0.3)"
              }}
            >
              ✏️ Reajustează poza
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

