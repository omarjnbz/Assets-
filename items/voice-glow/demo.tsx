import { VoiceBeam, useMicrophone } from "voice-glow"

// Click Listen and allow the microphone: the glow follows your voice.
export default function Demo() {
  const mic = useMicrophone()
  return (
    <div style={{ display:"grid",placeItems:"center",minHeight:"100vh",background:"#0b0b0d",color:"#ecebe7",fontFamily:"ui-sans-serif,system-ui", gap: 20, alignContent: "center" }}>
      <VoiceBeam stream={mic.stream}>
        <div style={{ padding: 32, borderRadius: 20, background: "#1d1d1d", width: 320, textAlign: "center" }}>
          {mic.state === "live" ? "Listening…" : "Press Listen"}
        </div>
      </VoiceBeam>
      <button onClick={mic.state === "live" ? mic.stop : mic.start} style={{ padding: "10px 22px", borderRadius: 999, border: "1px solid #444", background: "none", color: "inherit", cursor: "pointer" }}>
        {mic.state === "live" ? "Stop" : "Listen"}
      </button>
    </div>
  )
}
