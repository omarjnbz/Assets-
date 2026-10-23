import { MetalFx } from 'metal-fx';

function App() {
  return (
    <MetalFx variant="button">
      <button className="upgrade-pill">Upgrade to Pro</button>
    </MetalFx>
  );
}

<MetalFx variant="button">  {/* Pill silhouette, 1 px ring, scale 1.6 */}
  <button>Upgrade to Pro</button>
</MetalFx>

<MetalFx variant="circle">  {/* Compact circle, 2 px ring, scale 1.3 */}
  <button>↑</button>
</MetalFx>

<MetalFx preset="chromatic" />  {/* Iridescent rainbow (default) */}
<MetalFx preset="silver" />     {/* Cool steel */}
<MetalFx preset="gold" />       {/* Warm gold */}
