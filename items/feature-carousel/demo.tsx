import React from 'react';
import { HeroSection } from '@/components/ui/feature-carousel'; // Adjust the import path as needed

const App: React.FC = () => {
  const images = [
    {
      src: 'https://cdn.21st.dev/assets/mirror/3d/3db702a1ed76683584d89bd83ad183704d215a5070d642be28a28a224acc3f5c.jpg',
      alt: 'Professional portrait of a woman',
    },
    {
      src: 'https://cdn.21st.dev/assets/mirror/a2/a274943ea7b284ffcb66214957d1fde9db8b73b1d6830ebc804bea9a47c69fc7.jpg',
      alt: 'Scenic landscape with mountains and a lake',
    },
    {
      src: 'https://cdn.21st.dev/assets/mirror/66/66a230562aa63505d3089a2040fd63a69f123bd9a36377b5c27f9bfa10de0ac2.jpg',
      alt: 'Artistic photo of a girl with flowers',
    },
    {
      src: 'https://cdn.21st.dev/assets/mirror/61/6172e1733d7481ef0c4d97869883ed274c76a2ec712ad2ffd4443f5c8de0db78.jpg',
      alt: 'A dog wearing sunglasses',
    },
    {
      src: 'https://cdn.21st.dev/assets/mirror/03/03ae1dfe758f85ffc2e1b35168819781697dff334890b7e5be6bae9eee06df8b.jpg',
      alt: 'Creative shot of a person from behind',
    },
  ];

  const title = (
    <>
      Edit Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Photos </span> on the Go
    </>
  );

  return (
    <div className="w-full">
      <HeroSection
        title={title}
        subtitle="Use all our AI-powered photo editing tools on your phone, available for all iOS and Android."
        images={images}
        appStoreLink="#"
        googlePlayLink="#"
      />
    </div>
  );
};

export default App;
