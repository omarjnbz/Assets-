import { MetalFx } from "metal-fx"

const pill = { padding: "14px 28px", borderRadius: 999, border: 0, fontSize: 16, fontWeight: 600, background: "#111", color: "#fff", cursor: "pointer" } as const

export default function Demo() {
  return (
    <div style={{ display:"grid",placeItems:"center",minHeight:"100vh",background:"#0b0b0d",color:"#ecebe7",fontFamily:"ui-sans-serif,system-ui", gap: 24, gridAutoFlow: "column" }}>
      <MetalFx variant="button"><button style={pill}>Upgrade to Pro</button></MetalFx>
      <MetalFx variant="button" preset="gold"><button style={pill}>Gold</button></MetalFx>
      <MetalFx variant="circle"><button style={{ ...pill, width: 52, height: 52, padding: 0 }}>↑</button></MetalFx>
    </div>
  )
}
