import Link from "next/link";

type StatusResp = {
  has_uploaded: boolean;
  has_voted: boolean;
};

async function getStatus(): Promise<StatusResp> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/status`, {
      cache: "no-store",
    });
    if (!res.ok) return { has_uploaded: false, has_voted: false };
    return res.json();
  } catch (error) {
    // If API fails (e.g., Supabase not configured), return default values
    return { has_uploaded: false, has_voted: false };
  }
}

export default async function Home() {
  const status = await getStatus();

  return (
    <main style={{ 
      maxWidth: 980, 
      margin: "0 auto", 
      padding: "20px 16px", 
      minHeight: "100vh",
      paddingBottom: "40px"
    }}>
      <header style={{ 
        display: "flex", 
        flexDirection: "column",
        gap: 16,
        marginBottom: 24,
        textAlign: "center"
      }}>
        <div style={{ width: "100%" }}>
          <div style={{ 
            fontSize: 14, 
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 16
          }}>
            <span>🎄</span>
            <span>Live voting</span>
            <span>🎅</span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-hops.png"
              alt="Hops Logo"
              style={{
                maxWidth: "clamp(120px, 30vw, 180px)",
                width: "auto",
                height: "auto",
                objectFit: "contain"
              }}
            />
          </div>
          <h1 className="christmas-title" style={{ 
            margin: "0 auto", 
            fontSize: "clamp(28px, 8vw, 48px)", 
            lineHeight: 1.2,
            textAlign: "center"
          }}>
            Ugliest Christmas Sweater
          </h1>
        </div>
      </header>

      <section className="christmas-card" style={{ marginTop: 20, textAlign: "center" }}>
        <p style={{ 
          marginTop: 16, 
          opacity: 0.9, 
          lineHeight: 1.6,
          fontSize: "clamp(14px, 4vw, 16px)",
          textAlign: "center"
        }}>
          Reguli: poți face <b style={{ color: "#fbbf24" }}>un singur upload</b>. Votează pe oricine, înafară de tine. 📱
        </p>

        <div style={{ 
          display: "flex",
          flexDirection: "column",
          gap: 16, 
          marginTop: 24 
        }}>
          <CTA
            href={status.has_uploaded ? "#" : "/upload"}
            title={status.has_uploaded ? "✅ Ai încărcat deja" : "Încarcă puloverul meu"}
            subtitle={status.has_uploaded ? "Done! Ești în concurs 🎅" : "Fă poză + urcă o singură dată"}
            disabled={status.has_uploaded}
            image="/images/plover.png"
          />
          <CTA
            href={status.has_voted ? "#" : "/vote"}
            title={status.has_voted ? "✅ Ai votat deja" : "Votează un pulover"}
            subtitle={status.has_voted ? "Done! Votul tău contează 🎄" : "Alege cel mai urât (cu drag)"}
            disabled={status.has_voted}
            emoji="🗳️"
          />
        </div>
        <Link 
          href="/tv" 
          className="christmas-button"
          style={{ 
            padding: "14px 20px", 
            fontSize: 15,
            textDecoration: "none",
            display: "block",
            textAlign: "center",
            width: "100%",
            marginTop: 16
          }}
        >
          Vezi concurenta sau uita-te pe TV-ul din pub
        </Link>
      </section>

      <footer style={{
        marginTop: 40,
        padding: "20px",
        textAlign: "center",
        opacity: 0.7,
        fontSize: "clamp(12px, 3vw, 14px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap"
        }}>
          <span>aplicatie dezvoltata de</span>
          <a
            href="https://thecon.ro/"
            target="_blank"
            rel="noopener noreferrer"
            className="thecon-logo-link"
            style={{
              display: "inline-block",
              textDecoration: "none",
              transition: "opacity 0.3s ease"
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Thecon-Logo-white.png"
              alt="Thecon Logo"
              style={{
                height: "clamp(21px, 5.2vw, 26px)",
                width: "auto",
                objectFit: "contain",
                cursor: "pointer"
              }}
            />
          </a>
        </div>
      </footer>
    </main>
  );
}

function Badge({ label, done }: { label: string; done: boolean }) {
  return (
    <span className={`christmas-badge ${done ? "done" : "pending"}`}>
      {done ? "✅" : "⏳"} {label}
    </span>
  );
}

function CTA({ 
  href, 
  title, 
  subtitle, 
  disabled,
  emoji,
  image
}: { 
  href: string; 
  title: string; 
  subtitle: string; 
  disabled?: boolean;
  emoji?: string;
  image?: string;
}) {
  return (
    <Link
      href={href}
      aria-disabled={disabled}
      className={disabled ? "cta-disabled" : "cta-link"}
      style={{
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.5 : 1,
        padding: 24,
        borderRadius: 20,
        border: disabled 
          ? "2px solid rgba(220, 38, 38, 0.2)" 
          : "2px solid rgba(220, 38, 38, 0.4)",
        background: disabled
          ? "rgba(10, 14, 19, 0.6)"
          : "linear-gradient(135deg, rgba(26, 31, 46, 0.8) 0%, rgba(10, 14, 19, 0.8) 100%)",
        display: "block",
        transition: "all 0.3s ease",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {image ? (
        <div style={{ 
          marginBottom: 12,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            style={{
              height: "clamp(40px, 10vw, 60px)",
              width: "auto",
              objectFit: "contain"
            }}
          />
        </div>
      ) : emoji && (
        <div style={{ 
          fontSize: "clamp(28px, 8vw, 40px)", 
          marginBottom: 12,
          textAlign: "center"
        }}>
          {emoji}
        </div>
      )}
      <div style={{ 
        fontSize: "clamp(18px, 5vw, 22px)", 
        fontWeight: 700,
        marginBottom: 8,
        color: disabled ? "rgba(254, 243, 199, 0.6)" : "#fef3c7"
      }}>
        {title}
      </div>
      <div style={{ 
        marginTop: 8, 
        opacity: 0.85,
        fontSize: "clamp(13px, 3.5vw, 15px)",
        color: "rgba(254, 243, 199, 0.8)",
        lineHeight: 1.4
      }}>
        {subtitle}
      </div>
    </Link>
  );
}
