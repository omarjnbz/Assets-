"use client"

import { ThinkingOrb } from "thinking-orbs"

const STATES = ["working", "searching", "solving", "listening", "connecting", "weaving", "composing", "breathing", "shaping"] as const

// All nine states at both tuned sizes: 64 (chat avatar) and 20 (inline text).
export default function Demo() {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0d", color: "#ecebe7", padding: 32, fontFamily: "ui-sans-serif, system-ui" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 24 }}>
        {STATES.map((s) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <ThinkingOrb state={s} size={64} dark />
            <span style={{ fontSize: 12, opacity: 0.7, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ThinkingOrb state={s} size={20} dark /> {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
