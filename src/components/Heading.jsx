import React from "react";

export default function Heading() {
  return (
    <div className="text-center mb-2 relative overflow-hidden">
      {/* Main Gradient Heading */}
      <h1
        className="pixiverse-heading pixi-animate relative z-10"
        aria-label="PixiVerse"
      >
        PixiVerse
        {/* Shimmer overlay */}
        <span className="pixi-shimmer" />
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-lg md:text-xl text-gray-700 font-medium opacity-0 animate-fade-in">
        ✨ Transform imagination into stunning Ghibli-style art ✨
      </p>
    </div>
  );
}
