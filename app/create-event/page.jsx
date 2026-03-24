"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    const fileName = Date.now() + "-" + file.name;

    // UPLOAD IMAGE
    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(fileName, file);

    if (uploadError) {
      console.log(uploadError);
      alert("Image upload failed");
      setLoading(false);
      return;
    }

    // GET PUBLIC URL
    const { data: urlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(fileName);

    // INSERT EVENT
    const { error } = await supabase.from("events").insert({
      title: title,
      description: desc,
      image_url: urlData.publicUrl,
      created_by: user.id,
    });

    if (error) {
      console.log(error);
      alert("Error creating event");
      setLoading(false);
    } else {
      alert("Event created!");
      router.push("/");
    }
  };

  // image preview — purely UI
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--background)" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-lg rounded-2xl p-8 sm:p-10 flex flex-col gap-6 animate-fade-in"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.08)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200 flex-shrink-0"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
            title="Back"
          >
            ←
          </button>

          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase"
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
              Create{" "}
              <span className="gradient-text">Event</span>
            </h1>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ background: "var(--border)" }} />

        {/* Form */}
        <div className="flex flex-col gap-5">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Event Title
            </label>
            <input
              placeholder="e.g. Tech Fest 2025"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px var(--primary-glow)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Description
            </label>
            <textarea
              placeholder="Describe what this event is about..."
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 resize-none"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px var(--primary-glow)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Event Banner
            </label>

            {/* Drop zone */}
            <label
              htmlFor="file-upload"
              className="relative flex flex-col items-center justify-center w-full rounded-xl cursor-pointer transition-all duration-200 overflow-hidden"
              style={{
                border: "2px dashed var(--border)",
                background: "var(--surface-2)",
                minHeight: preview ? "auto" : "140px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.background = "var(--primary-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--surface-2)";
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-52 object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    🖼️
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    Click to upload banner
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>

            {/* File name pill */}
            {file && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs w-fit"
                style={{
                  background: "var(--primary-glow)",
                  border: "1px solid var(--primary)",
                  color: "var(--primary-light)",
                }}
              >
                <span>✓</span>
                <span className="truncate max-w-xs">{file.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreate}
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
              e.currentTarget.style.boxShadow =
                "0 8px 24px var(--primary-glow)";
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
              Creating Event...
            </>
          ) : (
            "✦ Publish Event"
          )}
        </button>
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