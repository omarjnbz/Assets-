import { ThinkingOrb } from 'thinking-orbs';

function Status() {
  return <ThinkingOrb state="searching" size={64} />;
}

<ThinkingOrb state="working" />     {/* particles on tilted orbits */}
<ThinkingOrb state="searching" />   {/* a scan meridian sweeps a dotted globe */}
<ThinkingOrb state="solving" />     {/* bands scramble, then click back solved */}
<ThinkingOrb state="listening" />   {/* a waveform rolls through the rings */}
<ThinkingOrb state="connecting" />  {/* a constellation wires itself */}
<ThinkingOrb state="weaving" />     {/* three strands plait around the sphere */}
<ThinkingOrb state="composing" />   {/* an undulating multi-band sash */}
<ThinkingOrb state="breathing" />   {/* a ring slowly morphing */}
<ThinkingOrb state="shaping" />     {/* dotted outline: circle → triangle → square */}

<ThinkingOrb state="working" size={64} />
<ThinkingOrb state="working" size={20} />
