import { useState } from "react";
import Swal from "sweetalert2";
import Tabs from "./components/Tabs";
import PhotoToArt from "./components/PhotoToArt";
import TextToArt from "./components/TextToArt";
import Heading from "./components/Heading";
import Footer from "./components/Footer";
import bg from "./assets/bg.png";

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
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
    });

    if (!result.isConfirmed) return;
    setActiveTab(targetTab);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>

      {/* Darker gradient overlay */}
      <div
        style={{
          background:
            "linear-gradient(to bottom right, rgba(17,24,39,0.8), rgba(88,28,135,0.75), rgba(30,41,59,0.85))"
        }}
        className="absolute inset-0 z-10"
      ></div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col min-h-screen w-full">
        <main className="flex-grow p-4 md:p-6 w-full max-w-6xl mx-auto">
          <Heading />
          <Tabs activeTab={activeTab} onSwitch={handleTabSwitch} />
          {activeTab === "photo" ? <PhotoToArt /> : <TextToArt />}
        </main>
        <Footer />
      </div>
    </div>
  );
}
