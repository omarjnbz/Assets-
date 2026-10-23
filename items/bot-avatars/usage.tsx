import { BotAvatar } from 'bot-avatars';

function Agent({ busy }: { busy: boolean }) {
  return <BotAvatar type="clover" state={busy ? 'working' : 'default'} />;
}

<BotAvatar type="clover" />    {/* sky */}
<BotAvatar type="flower" />    {/* green */}
<BotAvatar type="triangle" />  {/* magenta */}
<BotAvatar type="square" />    {/* sky */}
<BotAvatar type="blob" />      {/* green */}
<BotAvatar type="ghost" />     {/* white */}
<BotAvatar type="circle" />    {/* lavender */}
<BotAvatar type="drop" />      {/* teal */}
<BotAvatar type="star" />      {/* yellow */}
<BotAvatar type="droid" />     {/* pale, antenna ball, round ears */}
<BotAvatar type="mech" />      {/* slate, wide head, two antennae */}
<BotAvatar type="alien" />     {/* lime, wide brow, narrow chin */}
<BotAvatar type="hexagon" />   {/* coral nut */}
<BotAvatar type="cat" />       {/* apricot, round head, two ears */}
<BotAvatar type="cloud" />     {/* pale sky, five puffs */}
<BotAvatar type="pill" />      {/* indigo, a wide capsule */}
<BotAvatar type="pebble" />    {/* sage, a wide flat stone */}
<BotAvatar type="puddle" />    {/* pink, a taller lumpy blob */}

const heart = 'M50 88C50 88 12 64 12 38C12 24 23 14 35 14C42 14 47 18 50 23C53 18 58 14 65 14C77 14 88 24 88 38C88 64 50 88 50 88Z';

<BotAvatar type="circle" path={heart} color="#ff5c8a" />
