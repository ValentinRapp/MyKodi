import { useLayoutEffect, useState } from "react";
import "./App.css";

function App() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useLayoutEffect(() => {
    fetch("http://localhost:3000/medias/mongo.mp4")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch video");
        }
        return res.blob();
      })
      .then(blob => {
        const videoUrl = URL.createObjectURL(blob);
        setVideoSrc(videoUrl);
      })
      .catch(error => {
        console.error("Error fetching video:", error);
      });
  }, []);

  return (
    <main className="container">
      {videoSrc ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <video src={videoSrc} controls width="70%" />
          </div>
      ) : (
        <p>Loading video...</p>
      )}
    </main>
  );
}

export default App;
