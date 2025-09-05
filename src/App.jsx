import { useState } from "react";
import Swal from "sweetalert2";
import Tabs from "./components/Tabs";
import PhotoToArt from "./components/PhotoToArt";
import TextToArt from "./components/TextToArt";
import Heading from "./components/Heading";

export default function App() {
  const [activeTab, setActiveTab] = useState("photo");

  // Handle safe tab switching
  const handleTabSwitch = async (targetTab) => {
    if (targetTab === activeTab) return;

    const result = await Swal.fire({
      title: "Switch feature?",
      text: "Your current progress will be lost if you switch. Continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, switch",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
    });

    if (!result.isConfirmed) return;
    setActiveTab(targetTab);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-gray-50 p-6">
      <div className="w-full max-w-6xl">
        {/* PixiVerse Heading */}
        <Heading />

        {/* Tabs + Content */}
        <Tabs activeTab={activeTab} onSwitch={handleTabSwitch} />
        {activeTab === "photo" ? <PhotoToArt /> : <TextToArt />}
      </div>
    </div>
  );
}
