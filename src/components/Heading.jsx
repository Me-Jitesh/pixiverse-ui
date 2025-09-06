import React from "react";

export default function Heading() {
  return (
    <div className="text-center mb-2 relative overflow-hidden">

      <h1
        className="pixiverse-heading pixi-animate relative z-10"
        aria-label="PixiVerse"
      >
        PixiVerse
        {/* Shimmer Overlay Effect */}
        <span className="pixi-shimmer" />
      </h1>

      <p className="mt-4 text-lg md:text-xl text-gray-200 font-bold opacity-0 animate-fade-in">
        ✨ Transform Imagination INTO Stunning Ghibli Style Art ✨
      </p>
    </div>
  );
}
