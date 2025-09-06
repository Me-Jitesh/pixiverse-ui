export default function Tabs({ activeTab, onSwitch }) {
  return (
    <div className="flex items-end gap-2 mb-6 justify-start">
      <button
        onClick={() => onSwitch("photo")}
        className={`px-6 py-2 rounded-t-2xl transition-all duration-200 font-medium ${activeTab === "photo"
          ? "bg-white/20 text-gray-400 border-b-2 border-indigo-500 shadow-md backdrop-blur-sm"
          : "text-white bg-white/20 backdrop-blur-sm hover:text-gray-200"
          }`}
      >
        Photo To Art
      </button>
      <button
        onClick={() => onSwitch("text")}
        className={`px-6 py-2 rounded-t-2xl transition-all duration-200 font-medium ${activeTab === "text"
          ? "text-gray-400 border-b-2 border-indigo-200 shadow-md backdrop-blur-sm"
          : "text-white bg-white/10 backdrop-blur-sm hover:text-gray-100"
          }`}
      >
        Text to Art
      </button>
    </div>
  );
}
