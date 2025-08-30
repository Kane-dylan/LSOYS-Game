export default function Player({ data, flameReady }) {

  const getStateColor = () => {
    switch (data.state) {
      case "jumping":
        return "bg-blue-500";
      case "ducking":
        return "bg-yellow-500";
      case "dead":
        return "bg-red-500 animate-pulse";
      default:
        return flameReady ? "bg-green-400 animate-pulse" : "bg-green-500";
    }
  };


  return (
    <div
      className={`absolute bottom-16 w-10 bg-green-500 transition-all duration-100 ${getStateColor()}`}
      style={{
        left: `${data.x}px`,
        transform: `translateY(-${data.y}px)`,
        width: `${data.width}px`,
        height: `${data.height}px`,
      }}
    >
      {flameReady && data.state !== "dead" && (
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}

      {/* Flame aura when ready */}
      {flameReady && data.state !== "dead" && (
        <div className="absolute -inset-1 bg-red-400 rounded opacity-30 animate-pulse" />
      )}

      {/* Visual state indicator */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
        {data.state === "jumping" && "↑"}
        {data.state === "ducking" && "↓"}
        {data.state === "running" && (flameReady ? "🔥" : "→")}
        {data.state === "dead" && "💀"}
      </div>
    </div>
  );
}
