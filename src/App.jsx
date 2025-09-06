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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-gray-50">
      {/* Scrollable content */}
      <main className="flex-grow p-4 w-full max-w-6xl mx-auto overflow-y-auto">
        <Heading />
        <Tabs activeTab={activeTab} onSwitch={handleTabSwitch} />
        {activeTab === "photo" ? <PhotoToArt /> : <TextToArt />}
      </main>

      {/* Footer always visible */}
      <Footer />
    </div>
  );
}
