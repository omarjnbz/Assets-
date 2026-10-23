import { useRef } from "react"
import { ImageGeneration, type ImageGenerationHandle } from "img-fx"

const CDN = "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images"

export default function Demo() {
  const ref = useRef<ImageGenerationHandle>(null)
  return (
    <div style={{ display:"grid",placeItems:"center",minHeight:"100vh",background:"#0b0b0d",color:"#ecebe7",fontFamily:"ui-sans-serif,system-ui", gap: 20, alignContent: "center" }}>
      <ImageGeneration ref={ref} preset="pixels-organic" images={[CDN + "/767d99bb371a54d0d36751e8cecae43c.jpg", CDN + "/821d815affa6496c39cbdeeec7a84603.jpg"]}>
        <div style={{ width: 320, height: 320, borderRadius: 20, background: "#1d1d1d" }} />
      </ImageGeneration>
      <button onClick={() => ref.current?.triggerReveal()} style={{ padding: "10px 22px", borderRadius: 999, border: "1px solid #444", background: "none", color: "inherit", cursor: "pointer" }}>Reveal image</button>
    </div>
  )
}
