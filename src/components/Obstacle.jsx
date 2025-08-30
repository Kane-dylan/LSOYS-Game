export default function Obstacle({ data }) {
  const getObstacleColor = () => {
    switch(data.type) {
      case "duck": return 'bg-red-600';
      case "jump": return 'bg-gray-800';
      default: return 'bg-gray-800';
    }
  };

  return (
    <div
      className={`absolute bottom-16 ${getObstacleColor()} border border-gray-900`}
      style={{
        left: `${data.x}px`,
        width: `${data.width}px`,
        height: `${data.height}px`,
      }}
    >
      {/* Visual indicator for obstacle type */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
        {data.type === "duck" ? "↓" : "↑"}
      </div>
    </div>
  );
}
