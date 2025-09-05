export default function Tabs({ activeTab, onSwitch }) {
  return (
    <div className="flex items-end gap-2 mb-6">
      <button
        onClick={() => onSwitch("photo")}
        className={`px-4 py-2 rounded-t-2xl ${activeTab === "photo"
            ? "bg-white text-gray-900 border-b-2 border-indigo-500 shadow"
            : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Photo to Art
      </button>
      <button
        onClick={() => onSwitch("text")}
        className={`px-4 py-2 rounded-t-2xl ${activeTab === "text"
            ? "bg-white text-gray-900 border-b-2 border-indigo-500 shadow"
            : "text-gray-600 hover:text-gray-900"
          }`}
      >
        Text to Art
      </button>
    </div>
  );
}
