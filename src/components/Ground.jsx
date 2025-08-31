import React from "react";

const Ground = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-green-800 to-green-500 border-t-4 border-green-600 shadow-lg">
      {/* Grass texture effect */}
      <div className="w-full h-full bg-gradient-to-t from-green-900 to-green-500 opacity-80"></div>

      {/* Ground pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="h-full w-full bg-repeat-x"
          style={{
            backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.1) 10px,
            rgba(0,0,0,0.1) 12px
          )`,
          }}
        ></div>
      </div>

      {/* Ground highlights */}
      <div className="absolute top-0 left-0 w-full h-1 bg-green-400 opacity-60"></div>

      {/* Small grass details */}
      <div className="absolute top-1 left-0 w-full h-2 opacity-40">
        <div
          className="h-full w-full bg-repeat-x"
          style={{
            backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 8px,
            rgba(34,197,94,0.8) 8px,
            rgba(34,197,94,0.8) 9px
          )`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Ground;
