import { VoiceBeam, useMicrophone } from 'voice-glow';

function Composer() {
  const mic = useMicrophone();

  return (
    <>
      <VoiceBeam stream={mic.stream}>
        <div style={{ padding: 32, borderRadius: 20, background: '#1d1d1d' }}>
          Listening…
        </div>
      </VoiceBeam>
      <button onClick={mic.state === 'live' ? mic.stop : mic.start}>
        {mic.state === 'live' ? 'Stop' : 'Listen'}
      </button>
    </>
  );
}

<VoiceBeam type="pill">      {/* a ~150×44 recording pill: glow pulled in, shallow bend, thin band */}
  <RecordingPill />
</VoiceBeam>

<VoiceBeam type="mobile">    {/* the bottom of a phone screen: wider range, taller rise, broad band */}
  <VoiceScreen />
</VoiceBeam>

<VoiceBeam type="pill" scale={1.3}>
