"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      alert("User not found");
      setLoading(false);
      return;
    }

    const user = data.user;

    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name: name,
        roll_number: roll,
      });

    if (insertError) {
      console.log(insertError);
      alert("Error saving profile");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--background)" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl p-8 sm:p-10 flex flex-col gap-6 animate-fade-in"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.08)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{
              background: "linear-gradient(135deg, var(--primary-dark), var(--primary))",
              boxShadow: "0 8px 24px var(--primary-glow)",
            }}
          >
            🎓
          </div>

          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-1"
              style={{ color: "var(--primary-light)" }}
            >
              Vel Tech University
            </p>
            <h1
              className="text-2xl sm:text-3xl font-black leading-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "var(--foreground)",
              }}
            >
              Complete Your{" "}
              <span className="gradient-text">Profile</span>
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              Just a couple of details to get you started
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ background: "var(--border)" }} />

        {/* Form fields */}
        <div className="flex flex-col gap-4">
          {/* Name field */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Full Name
            </label>
            <input
              placeholder="e.g. Mubina Shaik"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-glow)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Roll Number field */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Roll Number
            </label>
            <input
              placeholder="e.g. 22BCE1234"
              onChange={(e) => setRoll(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--primary-glow)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 px-6 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background: loading
              ? "var(--surface-2)"
              : "linear-gradient(135deg, var(--primary), #4f46e5)",
            color: loading ? "var(--text-muted)" : "#fff",
            boxShadow: loading ? "none" : "0 4px 14px var(--primary-glow)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 24px var(--primary-glow)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = loading
              ? "none"
              : "0 4px 14px var(--primary-glow)";
          }}
        >
          {loading ? (
            <>
              <div
                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{
                  borderColor: "var(--text-muted)",
                  borderTopColor: "transparent",
                }}
              />
              Saving...
            </>
          ) : (
            <>
              Save & Continue →
            </>
          )}
        </button>

        {/* Footer note */}
        <p
          className="text-xs text-center"
          style={{ color: "var(--text-subtle)" }}
        >
          Your information is only used within the Vel Tech CEMS platform.
        </p>
      </div>

      {/* Bottom label */}
      <p
        className="absolute bottom-6 text-xs"
        style={{ color: "var(--text-subtle)" }}
      >
        © {new Date().getFullYear()} Vel Tech University · CEMS
      </p>
    </div>
  );
}