// Minimal test component (for isolated debugging)
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    cornerstone: any;
    cornerstoneWebImageLoader: any;
  }
}

const MinimalViewer = ({ imageId }: { imageId: string }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const element = elementRef.current;
    let isInitialized = false;

    const init = async () => {
      try {
        await loadScript("https://unpkg.com/cornerstone-core@2.6.1/dist/cornerstone.min.js");
        await loadScript("https://unpkg.com/cornerstone-web-image-loader@2.1.1/dist/cornerstoneWebImageLoader.min.js");

        setTimeout(() => {
          if (window.cornerstone && window.cornerstoneWebImageLoader ) {
            window.cornerstoneWebImageLoader.external.cornerstone = window.cornerstone;
            window.cornerstone.registerImageLoader("http", window.cornerstoneWebImageLoader.loadImage);
            window.cornerstone.registerImageLoader("https", window.cornerstoneWebImageLoader.loadImage);

            window.cornerstone.enable(element);
            isInitialized = true;
            console.log("Minimal Cornerstone Enabled.");

            window.cornerstone.loadImage(imageId)
              .then((image: any) => {
                window.cornerstone.displayImage(element, image);
                setLoaded(true);
                console.log("Minimal image displayed.");
              })
              .catch((e: any) => {
                setError(`Failed to load image: ${e.message}`);
                console.error("Minimal image load error:", e);
              });

          } else {
            setError("Minimal: Cornerstone or loader not found.");
            console.error("Minimal: Cornerstone or loader not found.");
            console.log(window.cornerstone)
            console.log(window.cornerstoneWebImageLoader)
            console.log(element)
          }
        }, 2000);
      } catch (err: any) {
        setError(`Minimal: Script load error: ${err.message}`);
        console.error("Minimal script load error:", err);

      }
    };

    init();

    return () => {
      if (isInitialized && element && window.cornerstone) {
        try {
          window.cornerstone.disable(element);
          console.log("Minimal Cornerstone Disabled.");
        } catch (err) {
          console.error("Minimal cleanup error:", err);
        }
      }
    };
  }, [imageId]);

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!loaded) return <div>Loading Minimal Viewer...</div>;

  return (
    <div
      ref={elementRef}
      style={{ width: '500px', height: '500px', border: '1px solid blue', backgroundColor: 'black' }}
    >
      {/* Canvas will be rendered here by Cornerstone */}
    </div>
  );
};

export default MinimalViewer;

// Usage in your app:
// <MinimalViewer imageId="https://tools.cornerstonejs.org/examples/assets/image_01.jpg" />