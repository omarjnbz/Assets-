import { BorderBeam } from 'border-beam';

function App() {
  return (
    <BorderBeam>
      <div style={{ padding: 32, borderRadius: 16, background: '#1d1d1d' }}>
        Your content here
      </div>
    </BorderBeam>
  );
}

<BorderBeam size="md">  {/* Full border glow (default) */}
  <Card />
</BorderBeam>

<BorderBeam size="sm">  {/* Compact glow for small elements */}
  <IconButton />
</BorderBeam>

<BorderBeam size="line">  {/* Bottom-only traveling glow */}
  <SearchBar />
</BorderBeam>

<BorderBeam size="pulse-inner">    {/* Contained breathing border glow */}
  <Card />
</BorderBeam>

<BorderBeam size="pulse-outside">  {/* Outward-blooming halo around the element */}
  <Card />
</BorderBeam>
