"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { router.push("/login"); return; }
      if (userData.user.email !== "mubinashaik916@gmail.com") { router.push("/"); return; }

      const { data, error } = await supabase
        .from("registrations")
        .select(`id, events (title), profiles (name, roll_number)`);

      if (error) { console.log("ERROR:", error); }
      else { setRegistrations(data); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const grouped = registrations.reduce((acc, item) => {
    const t = item.events?.title || "Unknown Event";
    if (!acc[t]) acc[t] = [];
    acc[t].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen relative z-10" style={{ color: "var(--foreground)" }}>

      {/* ── NAVBAR ── */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(13,13,15,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1.5px solid var(--border-strong)",
        }}
      >
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold btn-brutal flex-shrink-0"
              style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
              title="Back"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs"
                style={{
                  background: "var(--primary)",
                  border: "1.5px solid var(--primary-light)",
                  boxShadow: "2px 2px 0px var(--primary-dark)",
                }}
              >
                VT
              </div>
              <div>
                <p className="font-black text-sm leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Admin Panel
                </p>
                <p className="text-xs leading-none mt-0.5" style={{ color: "var(--text-muted)" }}>Vel Tech CEMS</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1.5px solid var(--success)",
                color: "var(--success)",
                boxShadow: "2px 2px 0px rgba(16,185,129,0.3)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              ADMIN
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold btn-brutal"
              style={{
                background: "rgba(239,68,68,0.08)",
                color: "var(--danger)",
                borderColor: "var(--danger)",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── PAGE HEADER ── */}
        <div className="mb-8 animate-fade-in">
          <span
            className="inline-block px-3 py-1 text-xs font-black tracking-widest uppercase rounded-md mb-4"
            style={{
              background: "var(--primary)",
              color: "#fff",
              border: "1.5px solid var(--primary-light)",
              boxShadow: "2px 2px 0px var(--primary-dark)",
            }}
          >
            Vel Tech University
          </span>
          <h1
            className="text-4xl sm:text-5xl font-black leading-none tracking-tight mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Student<br />
            <span className="gradient-text">Registrations.</span>
          </h1>
          <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
            All event registrations across campus.
          </p>
        </div>

        {/* ── STATS ── */}
        {!loading && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 animate-fade-in">
            {[
              { label: "Total", value: registrations.length, icon: "📋", color: "var(--primary)", shadow: "var(--primary-dark)" },
              { label: "Events", value: Object.keys(grouped).length, icon: "🎉", color: "var(--accent)", shadow: "rgba(6,182,212,0.5)" },
              {
                label: "Students",
                value: new Set(registrations.map((r) => r.profiles?.roll_number)).size,
                icon: "🎓",
                color: "var(--success)",
                shadow: "rgba(16,185,129,0.4)",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-4 sm:p-5 flex flex-col gap-1 brutal-card"
              >
                <span className="text-xl sm:text-2xl">{stat.icon}</span>
                <p
                  className="text-2xl sm:text-3xl font-black leading-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: stat.color }}
                >
                  {stat.value}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div
              className="w-9 h-9 rounded-full border-2 animate-spin"
              style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
            />
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              Loading registrations...
            </p>
          </div>
        )}

        {/* ── EMPTY ── */}
        {!loading && registrations.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-28 rounded-xl brutal-card"
            style={{ borderStyle: "dashed" }}
          >
            <span className="text-5xl mb-4">📭</span>
            <p className="font-black text-lg mb-1">No registrations yet</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Students will appear here once they register.
            </p>
          </div>
        )}

        {/* ── GROUPED TABLES ── */}
        {!loading && registrations.length > 0 && (
          <div className="flex flex-col gap-5">
            {Object.entries(grouped).map(([eventTitle, items], gi) => (
              <div
                key={eventTitle}
                className="rounded-xl overflow-hidden animate-fade-in brutal-card"
                style={{ animationDelay: `${gi * 80}ms` }}
              >
                {/* Group header */}
                <div
                  className="flex items-center justify-between px-4 sm:px-5 py-3.5"
                  style={{
                    background: "var(--surface-2)",
                    borderBottom: "1.5px solid var(--border-strong)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                      style={{
                        background: "var(--primary)",
                        border: "1.5px solid var(--primary-light)",
                        boxShadow: "2px 2px 0px var(--primary-dark)",
                      }}
                    >
                      🎉
                    </div>
                    <h2
                      className="font-black text-sm sm:text-base"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {eventTitle}
                    </h2>
                  </div>
                  <span
                    className="text-xs font-black px-2.5 py-1 rounded-full"
                    style={{
                      background: "var(--primary)",
                      color: "#fff",
                      border: "1.5px solid var(--primary-light)",
                      boxShadow: "2px 2px 0px var(--primary-dark)",
                    }}
                  >
                    {items.length} student{items.length !== 1 ? "s" : ""}
                  </span>
                </div>
              
                {/* ── DIVIDER between stats and tables ── */}
{!loading && registrations.length > 0 && (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex-1 h-px" style={{ background: "var(--border-strong)" }} />
    <span
      className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
      style={{
        background: "var(--surface-2)",
        border: "1.5px solid var(--border-strong)",
        color: "var(--text-muted)",
      }}
    >
      Registrations
    </span>
    <div className="flex-1 h-px" style={{ background: "var(--border-strong)" }} />
  </div>
)}

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1.5px solid var(--border-strong)" }}>
                        {["#", "Student Name", "Roll Number"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-5 py-3 text-xs font-black tracking-widest uppercase"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: idx !== items.length - 1 ? "1px solid var(--border)" : "none",
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <td className="px-5 py-3.5 text-xs font-mono font-bold" style={{ color: "var(--text-subtle)" }}>
                            {String(idx + 1).padStart(2, "0")}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                                style={{
                                  background: "var(--primary)",
                                  border: "1.5px solid var(--primary-light)",
                                  boxShadow: "1px 1px 0px var(--primary-dark)",
                                }}
                              >
                                {item.profiles?.name?.[0]?.toUpperCase() ?? "?"}
                              </div>
                              <span className="font-semibold">{item.profiles?.name || "N/A"}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className="px-2.5 py-1 rounded-md text-xs font-mono font-bold"
                              style={{
                                background: "var(--surface-2)",
                                border: "1.5px solid var(--border-strong)",
                                color: "var(--accent-light)",
                                boxShadow: "2px 2px 0px var(--border-strong)",
                              }}
                            >
                              {item.profiles?.roll_number || "N/A"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden flex flex-col">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3.5"
                      style={{ borderBottom: idx !== items.length - 1 ? "1px solid var(--border)" : "none" }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                        style={{
                          background: "var(--primary)",
                          border: "1.5px solid var(--primary-light)",
                          boxShadow: "2px 2px 0px var(--primary-dark)",
                        }}
                      >
                        {item.profiles?.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="text-sm font-black truncate">{item.profiles?.name || "N/A"}</p>
                        <p className="text-xs font-mono font-bold" style={{ color: "var(--accent-light)" }}>
                          {item.profiles?.roll_number || "N/A"}
                        </p>
                      </div>
                      <span className="ml-auto text-xs font-mono font-bold" style={{ color: "var(--text-subtle)" }}>
                        #{String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="mt-20 py-6 text-center text-xs"
        style={{ borderTop: "1.5px solid var(--border-strong)", color: "var(--text-subtle)" }}
      >
        © {new Date().getFullYear()} Vel Tech University · CEMS Admin
      </footer>
    </div>
  );
}