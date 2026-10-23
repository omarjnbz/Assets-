# Collection Surfer

Scroll-driven 3D strip of image cards that loops. Variants: `magnetic` (default), `uplift`, `simple`.

- Copy to `components/ui/collection-surfer.tsx` (shadcn default, matches the `@/components/ui/...` import).
- Needs: `npm i framer-motion`, Tailwind CSS, TypeScript.
- Props: `items?: { id, image, title }[]`, `variant?`. Ships with 16 default images (cdn.21st.dev).
- It is a full-page piece: a 50,000px spacer plus a fixed full-screen stage. Use it as the page, not inside a section.
- Heading text ("HERITAGE FW25/26") is hardcoded in the component; edit it for real use.
- Card index uses `i % 16`, so a different item count needs that number changed.
