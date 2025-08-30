export default function Scoreboard({ score, best }) {
  return (
    <div className="absolute top-2 left-2 text-xl font-bold">
      <p>Score: {score}</p>
      <p>Best: {best}</p>
    </div>
  );
}
