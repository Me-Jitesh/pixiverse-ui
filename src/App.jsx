import { useState } from "react";
import Swal from "sweetalert2";
import Tabs from "./components/Tabs";
import Heading from "./components/Heading";
import Footer from "./components/Footer";
import PhotoToArt from "./components/PhotoToArt";
import TextToArt from "./components/TextToArt";

export default function App() {
  const [activeTab, setActiveTab] = useState("photo");

  const handleTabSwitch = async (targetTab) => {
    if (targetTab === activeTab) return;

    const result = await Swal.fire({
      title: "Switch feature?",
      text: "Your current progress will be lost if you switch. Continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, switch",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#3b82f6",
    });

    if (!result.isConfirmed) return;
    setActiveTab(targetTab);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800 selection:bg-purple-200 selection:text-gray-900">

      {/* Header */}
      <header className="p-2 flex-shrink-0">
        <Heading />
      </header>

      {/* Tabs */}
      <div className="flex-shrink-0 p-2 bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 rounded-2xl shadow-lg mx-2">
        <Tabs activeTab={activeTab} onSwitch={handleTabSwitch} />
      </div>

      {/* Main Content */}
      <main className="flex-grow overflow-hidden p-2">
        <div className="h-full flex flex-col md:flex-row gap-2">

          {/* Photo or Text card */}
          {activeTab === "photo" ? (
            <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md rounded-xl p-2 shadow-md overflow-hidden">
              <PhotoToArt containerHeight="full" reduced />
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md rounded-xl p-2 shadow-md overflow-hidden">
              <TextToArt containerHeight="full" reduced />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 bg-gradient-to-r from-purple-200 via-blue-200 to-pink-200 p-2 text-center rounded-t-2xl shadow-inner">
        <Footer />
      </footer>
    </div>
  );
}
