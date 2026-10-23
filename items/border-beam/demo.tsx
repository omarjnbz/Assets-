import { BorderBeam } from "border-beam"

const card = { padding: 28, borderRadius: 16, background: "#1d1d1d", width: 260 }

export default function Demo() {
  return (
    <div style={{ display:"grid",placeItems:"center",minHeight:"100vh",background:"#0b0b0d",color:"#ecebe7",fontFamily:"ui-sans-serif,system-ui", gap: 28, gridAutoFlow: "column", padding: 24 }}>
      <BorderBeam><div style={card}>size md (default)</div></BorderBeam>
      <BorderBeam size="line"><div style={card}>size line</div></BorderBeam>
      <BorderBeam size="pulse-outside"><div style={card}>pulse outside</div></BorderBeam>
    </div>
  )
}
