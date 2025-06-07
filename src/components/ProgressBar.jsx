export default function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden">
      <div
        style={{ width: `${percentage}%` }}
        className="h-full bg-green-500 transition-all duration-500"
      />
    </div>
  );
}