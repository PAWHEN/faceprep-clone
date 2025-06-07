export default function TopicCard({ topic, completed, onToggle }) {
  return (
    <div className={`border rounded p-4 transition shadow-md ${completed ? "bg-green-100 border-green-600" : "bg-white"}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{topic.title}</h3>
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="w-5 h-5"
        />
      </div>
      <p className="text-sm text-gray-600">Page {topic.pageStart}</p>
      <a
        href={`./rsagarwal.pdf#page=${topic.pageStart +9}`}
        target="_blank"
        className="text-blue-500 underline text-sm"
      >
        Open PDF
      </a>
    </div>
  );
}