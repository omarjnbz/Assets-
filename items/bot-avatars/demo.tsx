import { BotAvatar } from "bot-avatars"

const TYPES = ["clover","flower","triangle","square","blob","ghost","circle","drop","star","droid","mech","alien","hexagon","cat","cloud","pill","pebble","puddle"] as const

export default function Demo() {
  return (
    <div style={{ display:"grid",placeItems:"center",minHeight:"100vh",background:"#0b0b0d",color:"#ecebe7",fontFamily:"ui-sans-serif,system-ui", padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 72px)", gap: 20 }}>
        {TYPES.map((t, i) => <BotAvatar key={t} type={t} state={i % 3 === 0 ? "working" : "default"} />)}
      </div>
    </div>
  )
}
