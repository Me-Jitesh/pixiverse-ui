// App.jsx
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Card,
  Button,
  Textarea,
  FileInput,
  Select,
  Spinner,
} from "flowbite-react";

export default function App() {
  // Active tab: "photo" | "text"
  const [activeTab, setActiveTab] = useState("photo");

  // Photo tab state
  const [uploadedImage, setUploadedImage] = useState(null); // File
  const [photoPrompt, setPhotoPrompt] = useState("");
  const [generatedImagePhoto, setGeneratedImagePhoto] = useState(null); // data url

  // Text tab state
  const [textPrompt, setTextPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [generatedImageText, setGeneratedImageText] = useState(null); // data url

  // Shared state
  const [loading, setLoading] = useState(false);

  // Utility: convert arraybuffer to base64 data URL
  const convertToBase64 = (arrayBuffer) => {
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return `data:image/png;base64,${base64}`;
  };

  // SweetAlert helpers
  const showError = (message) =>
    Swal.fire({ icon: "error", title: "Oops...", text: message, confirmButtonColor: "#6366f1" });

  const showSuccess = (message) =>
    Swal.fire({ icon: "success", title: "Done", text: message, timer: 1300, showConfirmButton: false });

  // Handle safe tab switching (warn if current tab has progress)
  const handleTabSwitch = async (targetTab) => {
    if (targetTab === activeTab) return;

    // Determine if current tab has unsaved work
    const currentHasProgress =
      activeTab === "photo"
        ? uploadedImage || generatedImagePhoto || (photoPrompt && photoPrompt.trim() !== "")
        : generatedImageText || (textPrompt && textPrompt.trim() !== "");

    if (currentHasProgress) {
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

      if (!result.isConfirmed) return; // user canceled, stay
    }

    // Reset the states of the tab being left (isolation)
    if (activeTab === "photo") {
      setUploadedImage(null);
      setPhotoPrompt("");
      setGeneratedImagePhoto(null);
    } else {
      setTextPrompt("");
      setGeneratedImageText(null);
    }

    setActiveTab(targetTab);
  };

  // Photo -> backend
  const handleGeneratePhoto = async () => {
    if (!uploadedImage) {
      showError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setGeneratedImagePhoto(null);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("prompt", photoPrompt);

      const response = await axios.post(
        "https://pixiverse.koyeb.app/api/v1/pixiverse/generate",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, responseType: "arraybuffer" }
      );

      const dataUrl = convertToBase64(response.data);
      setGeneratedImagePhoto(dataUrl);
      showSuccess("Art generated!");
    } catch (err) {
      console.error(err);
      showError("Failed to generate art. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Text -> backend
  const handleGenerateText = async () => {
    if (!textPrompt || !textPrompt.trim()) {
      showError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setGeneratedImageText(null);

    try {
      const response = await axios.post(
        "https://pixiverse.koyeb.app/api/v1/pixiverse/generate/text",
        { prompt: textPrompt, style: selectedStyle },
        { headers: { "Content-Type": "application/json" }, responseType: "arraybuffer" }
      );

      const dataUrl = convertToBase64(response.data);
      setGeneratedImageText(dataUrl);
      showSuccess("Art generated!");
    } catch (err) {
      console.error(err);
      showError("Failed to generate art. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Download helper (works for either tab)
  const handleDownload = (dataUrl, filename = "ghibli-art.png") => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Downloaded!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-gray-50 p-6">
      <div className="w-full max-w-6xl">
        {/* Tabs header */}
        <div className="flex items-end gap-2 mb-6">
          <button
            onClick={() => handleTabSwitch("photo")}
            className={`px-4 py-2 rounded-t-2xl ${activeTab === "photo"
              ? "bg-white text-gray-900 border-b-2 border-indigo-500 shadow"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Photo to Art
          </button>

          <button
            onClick={() => handleTabSwitch("text")}
            className={`px-4 py-2 rounded-t-2xl ${activeTab === "text"
              ? "bg-white text-gray-900 border-b-2 border-indigo-500 shadow"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Text to Art
          </button>
        </div>

        {/* Content area */}
        {activeTab === "photo" ? (
          /* PHOTO TAB */
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white/90 backdrop-blur-sm">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Upload Photo to Transform
              </h3>

              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-purple-50 transition cursor-pointer"
              >
                {uploadedImage ? (
                  <img
                    src={URL.createObjectURL(uploadedImage)}
                    alt="Uploaded Preview"
                    className="rounded-xl object-contain max-h-60 w-full shadow-md"
                  />
                ) : (
                  <p className="text-gray-500 font-medium">📸 Drag & drop image here or browse</p>
                )}
              </label>

              <FileInput
                id="photo-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (!file.type.startsWith("image/")) {
                      Swal.fire({
                        icon: "error",
                        title: "Invalid File",
                        text: "Please upload a valid image file.",
                        confirmButtonColor: "#6366f1",
                      });
                      e.target.value = ""; // reset input
                      setUploadedImage(null);
                      return;
                    }
                    setUploadedImage(file);
                  }
                }}
              />

              <Textarea
                placeholder="Add an additional prompt..."
                className="mt-4 p-3 border border-gray-300 rounded-xl shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                rows={3}
                value={photoPrompt}
                onChange={(e) => setPhotoPrompt(e.target.value)}
              />

              <Button
                className="mt-4 w-full text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-purple-400/40 hover:scale-105 transform transition-all duration-300"
                style={{ background: "linear-gradient(to right, #6366f1, #a855f7, #ec4899)" }}
                onClick={handleGeneratePhoto}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Spinner size="sm" /> Transforming...
                  </div>
                ) : (
                  "✨ Transform to Ghibli Art"
                )}
              </Button>
            </Card>

            {/* Output Preview */}
            <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
              <div className="w-full h-80 flex items-center justify-center">
                {loading ? (
                  <Spinner size="xxl" color="purple" />
                ) : generatedImagePhoto ? (
                  <img src={generatedImagePhoto} alt="Generated Art" className="rounded-xl object-cover h-full shadow-md" />
                ) : (
                  <span className="text-gray-400 font-medium">Generated art will appear here</span>
                )}
              </div>

              {generatedImagePhoto && (
                <Button
                  onClick={() => handleDownload(generatedImagePhoto)}
                  className="mt-4 w-full text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-cyan-400/40 hover:scale-105 transform transition-all duration-300"
                  style={{ background: "linear-gradient(to right, #06b6d4, #3b82f6, #6366f1)" }}
                >
                  ⬇️ Download Art
                </Button>
              )}
            </Card>
          </div>
        ) : (
          /* TEXT TAB */
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white/90 backdrop-blur-sm">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Text to Ghibli Art</h3>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-purple-50 transition cursor-pointer mb-4">
                <p className="text-gray-500 font-medium">📝 Generate Ghibli art from your text description</p>
              </div>

              <Select
                className="mb-4 rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
              >
                <option>cinematic</option>
                <option>anime</option>
                <option>photographic</option>
                <option>pixel-art</option>
                <option>3d-model</option>
                <option>isometric</option>
                <option>origami</option>
                <option>neon-punk</option>
                <option>low-poly</option>
                <option>line-art</option>
                <option>modeling-compound</option>
                <option>fantasy-art</option>
                <option>enhance</option>
                <option>digital-art</option>
                <option>tile-texture</option>
                <option>comic-book</option>
                <option>analog-film</option>
              </Select>

              <Textarea
                placeholder="Your description..."
                className="mt-4 p-3 border border-gray-300 rounded-xl shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                rows={3}
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
              />

              <Button
                className="mt-4 w-full text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-purple-400/40 hover:scale-105 transform transition-all duration-300"
                style={{ background: "linear-gradient(to right, #6366f1, #a855f7, #ec4899)" }}
                onClick={handleGenerateText}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <Spinner size="sm" /> Generating...
                  </div>
                ) : (
                  "🎨 Generate"
                )}
              </Button>
            </Card>

            {/* Output Preview */}
            <Card className="rounded-2xl shadow-xl border border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
              <div className="w-full h-80 flex items-center justify-center text-center">
                {loading ? (
                  <Spinner size="xl" color="purple" />
                ) : generatedImageText ? (
                  <img src={generatedImageText} alt="Generated Art" className="rounded-xl object-cover h-full shadow-md" />
                ) : textPrompt ? (
                  <p className="text-lg text-gray-600 italic">✨ Preview: "{textPrompt}"</p>
                ) : (
                  <span className="text-gray-400 font-medium">Generated art will appear here</span>
                )}
              </div>

              {generatedImageText && (
                <Button
                  onClick={() => handleDownload(generatedImageText)}
                  className="mt-4 w-full text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-cyan-400/40 hover:scale-105 transform transition-all duration-300"
                  style={{ background: "linear-gradient(to right, #06b6d4, #3b82f6, #6366f1)" }}
                >
                  ⬇️ Download Art
                </Button>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
