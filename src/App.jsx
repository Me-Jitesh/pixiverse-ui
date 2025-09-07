import { useState } from "react";
import Swal from "sweetalert2";
import Tabs from "./components/Tabs";
import PhotoToArt from "./components/PhotoToArt";
import TextToArt from "./components/TextToArt";
import Heading from "./components/Heading";
import Footer from "./components/Footer";
import bg from "./assets/bg.png";
import bgm from "./assets/bgm.png";
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [activeTab, setActiveTab] = useState("photo");

  const handleTabSwitch = async (targetTab) => {
    if (targetTab === activeTab) return;

    const result = await Swal.fire({
      text: "Discard Image ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Switch",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff00ff",
      cancelButtonColor: "#8b5cf6",
      background: "rgba(255, 255, 255, 0.40)",
      color: "#ffffff",
      backdrop: `
        rgba(0,0,0,0.5)
        blur(6px)
      `,
      customClass: {
        popup: "rounded-2xl shadow-lg",
        title: "text-lg font-semibold text-gray-200",
        htmlContainer: "text-gray-200",
        confirmButton: "px-4 py-2 rounded-lg font-semibold",
        cancelButton: "px-4 py-2 rounded-lg font-semibold",
      },
    });


    if (!result.isConfirmed) return;
    setActiveTab(targetTab);
  };

  return (
    <>
      <Analytics />
      <div className="relative min-h-screen w-full flex flex-col">


        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${bg})` }}
        ></div>

        <div
          className="absolute inset-0 bg-center bg-repeat sm:hidden"
          style={{
            backgroundImage: `url(${bgm})`,
          }}
        ></div>

        <div
          style={{
            background:
              "linear-gradient(to bottom right, rgba(17,24,39,0.8), rgba(88,28,135,0.75), rgba(30,41,59,0.85))"
          }}
          className="absolute inset-0 z-10"
        ></div>

        <div className="relative z-20 flex flex-col min-h-screen w-full">
          <main className="flex-grow p-4 md:p-6 w-full max-w-6xl mx-auto">
            <Heading />
            <Tabs activeTab={activeTab} onSwitch={handleTabSwitch} />
            {activeTab === "photo" ? <PhotoToArt /> : <TextToArt />}
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
