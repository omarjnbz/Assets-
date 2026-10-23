import { useState } from "react"
import { Liquid } from "liquid-gooey"

const btn = { width: 56, height: 56, borderRadius: "50%", border: 0, background: "#fff", color: "#111", fontSize: 22, cursor: "pointer" } as const

export default function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display:"grid",placeItems:"center",minHeight:"100vh",background:"#0b0b0d",color:"#ecebe7",fontFamily:"ui-sans-serif,system-ui" }}>
      <Liquid blur={6} contrast={18} fill="#fff">
        <Liquid.Item x={open ? -64 : 0} y={open ? -40 : 0} transition="bouncy"><button style={btn}>✎</button></Liquid.Item>
        <Liquid.Item x={0} y={open ? -76 : 0} transition="bouncy" delay={40}><button style={btn}>★</button></Liquid.Item>
        <Liquid.Item x={open ? 64 : 0} y={open ? -40 : 0} transition="bouncy" delay={80}><button style={btn}>♥</button></Liquid.Item>
        <Liquid.Item><button style={btn} onClick={() => setOpen(o => !o)}>{open ? "×" : "+"}</button></Liquid.Item>
      </Liquid>
    </div>
  )
}
