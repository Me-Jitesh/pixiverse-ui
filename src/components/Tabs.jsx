export default function Tabs({ activeTab, onSwitch }) {
  return (
    <div className="flex items-end gap-2 mb-6 justify-start">
      <button
        onClick={() => onSwitch("photo")}
        className={`px-4 py-2 rounded-t-2xl transition-all duration-200 ${
          activeTab === "photo"
            ? "bg-white/20 text-gray-900 border-b-2 border-indigo-500 shadow-md backdrop-blur-sm"
            : "text-white bg-white/10 backdrop-blur-sm hover:text-gray-100"
        }`}
      >
        Photo to Art
      </button>
      <button
        onClick={() => onSwitch("text")}
        className={`px-4 py-2 rounded-t-2xl transition-all duration-200 ${
          activeTab === "text"
            ? "bg-white/20 text-gray-900 border-b-2 border-indigo-500 shadow-md backdrop-blur-sm"
            : "text-white bg-white/10 backdrop-blur-sm hover:text-gray-100"
        }`}
      >
        Text to Art
      </button>
    </div>
  );
}
