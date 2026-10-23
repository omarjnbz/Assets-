import { ImageGeneration } from 'img-fx';

export function Card() {
  return (
    <ImageGeneration
      preset="pixels-organic"
      images={['/img/a.jpg', '/img/b.jpg']}
      autoReveal
    >
      <div className="card" style={{ width: 320, height: 320, borderRadius: 20 }} />
    </ImageGeneration>
  );
}

import { useRef } from 'react';
import { ImageGeneration, type ImageGenerationHandle } from 'img-fx';

export function Card() {
  const ref = useRef<ImageGenerationHandle>(null);
  return (
    <>
      <ImageGeneration ref={ref} preset="pixels-organic" images={['/a.jpg', '/b.jpg']}>
        <div className="card" style={{ width: 320, height: 320, borderRadius: 20 }} />
      </ImageGeneration>
      <button onClick={() => ref.current?.triggerReveal()}>
        Reveal image
      </button>
    </>
  );
}

const onToggle = () => {
  const h = ref.current;
  if (!h) return;
  if (h.isImageActive()) h.triggerHide();
  else h.triggerReveal({ hold: 'manual' });
};
