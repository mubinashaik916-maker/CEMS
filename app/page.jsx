"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);
      const { data: eventsData } = await supabase.from("events").select("*");
      setEvents(eventsData || []);
      setLoading(false);
    };
    init();
  }, []);

  const register = async (eventId) => {
    const { data } = await supabase.auth.getUser();
    const { error } = await supabase.from("registrations").insert({
      user_id: data.user.id,
      event_id: eventId,
    });
    if (error) { alert("You are already registered for this event!"); }
    else { alert("Registration successful!"); }
  };

  const deleteEvent = async (id) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { alert("Delete failed"); console.log(error); }
    else { alert("Deleted successfully"); location.reload(); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isAdmin = user?.email === "mubinashaik916@gmail.com";

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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{
                background: "var(--primary)",
                border: "1.5px solid var(--primary-light)",
                boxShadow: "2px 2px 0px var(--primary-dark)",
              }}
            >
              VT
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-sm leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Vel Tech
              </p>
              <p className="text-xs leading-none mt-0.5" style={{ color: "var(--text-muted)" }}>CEMS</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => router.push("/create-event")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold btn-primary"
                >
                  ＋ Create Event
                </button>
                <button
                  onClick={() => router.push("/admin")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold btn-brutal"
                  style={{
                    background: "rgba(16,185,129,0.12)",
                    color: "var(--success)",
                    borderColor: "var(--success)",
                  }}
                >
                  Admin Panel
                </button>
              </>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold btn-brutal"
              style={{
                background: "rgba(239,68,68,0.08)",
                color: "var(--danger)",
                borderColor: "var(--danger)",
              }}
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">↪</span>
            </button>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
              style={{
                background: "var(--primary)",
                border: "1.5px solid var(--primary-light)",
                boxShadow: "2px 2px 0px var(--primary-dark)",
              }}
              title={user?.email}
            >
              {user?.email?.[0]?.toUpperCase() ?? "U"}
            </div>
          </div>
        </div>

        {/* Mobile admin strip */}
        {isAdmin && (
          <div
            className="sm:hidden flex gap-2 px-4 pb-2.5"
          >
            <button
              onClick={() => router.push("/create-event")}
              className="flex-1 py-2 rounded-lg text-xs font-bold btn-primary"
            >
              ＋ Create Event
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="flex-1 py-2 rounded-lg text-xs font-bold btn-brutal"
              style={{
                background: "rgba(16,185,129,0.12)",
                color: "var(--success)",
                borderColor: "var(--success)",
              }}
            >
              Admin Panel
            </button>
          </div>
        )}
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── HERO ── */}
        <div className="mb-10 animate-fade-in">
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
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-none tracking-tight mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Upcoming<br />
            <span className="gradient-text">Events.</span>
          </h1>
          <p className="text-sm sm:text-base max-w-md" style={{ color: "var(--text-muted)" }}>
            Discover, register, and participate in campus events.
          </p>
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div
              className="w-9 h-9 rounded-full border-2 animate-spin"
              style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
            />
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              Loading events...
            </p>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && events.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-28 rounded-xl brutal-card"
            style={{ borderStyle: "dashed" }}
          >
            <span className="text-5xl mb-4">🎉</span>
            <p className="font-black text-lg mb-1">No events yet</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Check back soon for upcoming campus events.
            </p>
          </div>
        )}

        {/* ── EVENTS GRID ── */}
        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {events.map((event, i) => (
              <div
                key={event.id}
                className="brutal-card rounded-xl overflow-hidden flex flex-col animate-fade-in"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {/* Image */}
                <div className="relative w-full h-44 overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl"
                      style={{ background: "linear-gradient(135deg, var(--surface-2), var(--primary-dark))" }}
                    >
                      🎓
                    </div>
                  )}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(13,13,15,0.75) 0%, transparent 55%)" }}
                  />
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
                  <div className="flex-1">
                    <h2
                      className="text-base sm:text-lg font-black leading-snug mb-1"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {event.title}
                    </h2>
                    <p className="text-sm line-clamp-3" style={{ color: "var(--text-muted)" }}>
                      {event.description}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => register(event.id)}
                      className="flex-1 py-2.5 px-4 rounded-lg text-sm btn-primary"
                    >
                      Register →
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="py-2.5 px-3 rounded-lg text-sm font-bold btn-brutal"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          color: "var(--danger)",
                          borderColor: "var(--danger)",
                        }}
                        title="Delete event"
                      >
                        🗑
                      </button>
                    )}
                  </div>
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
        © {new Date().getFullYear()} Vel Tech University · College Event Management System
      </footer>
    </div>
  );
}