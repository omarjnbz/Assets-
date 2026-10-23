import { Liquid } from 'liquid-gooey'

<Liquid blur={6} contrast={18} fill="#fff" shadow="0 2px 6px rgba(0,0,0,.08)">
  {/* MORPH (default): give items x/y and the library animates element and
      liquid in perfect sync — a plus-menu that splits like droplets */}
  <Liquid.Item x={open ? -54 : 0} y={open ? -34 : 0} transition="bouncy">
    <button className="round-btn">…</button>
  </Liquid.Item>
  <Liquid.Item x={0} y={open ? -64 : 0} transition="bouncy" delay={40}>
    <button className="round-btn">…</button>
  </Liquid.Item>
</Liquid>

// Shape change: the liquid mass flows toward the new centre first, then size
// and corner radius adapt — content cross-blurs inside the moving liquid.
<Liquid.Item morph={{ shape: true }}>
  <div className={open ? 'panel-open' : 'panel-closed'}>…</div>
</Liquid.Item>

<Liquid.Item dissolve />                      // the tuned look
<Liquid.Item dissolve={0.5} />                // scaled intensity
<Liquid.Item dissolve={{ mix: 0.7, active: dragging }} />   // full DissolveOptions
