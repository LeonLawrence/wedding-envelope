import React from "react";
import Envelope from "./Components/Envelope";
import "./App.css";


export default function App() {

    const params = new URLSearchParams(window.location.search);
  const name = decodeURIComponent(params.get("n") || "Kathy & Leon");
  
  return (
    <div className="app-wrapper">
      {/* Background particles */}
      <div className="background-particles">
        {Array.from({ length: 300 }).map((_, i) => {
          const size = Math.random() * 4 + 1;
          const left = Math.random() * 100 + "%";
          const top = Math.random() * 100 + "%";
          const duration = 5 + Math.random() * 5;
          return (
            <div
              key={i}
              className="particle"
              style={{
                width: size,
                height: size,
                left,
                top,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
      </div>

      {/* Envelope */}
       <Envelope name={name} />
    </div>
  );
}