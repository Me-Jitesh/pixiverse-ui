import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Textarea, FileInput, Spinner } from "flowbite-react";

export default function PhotoToArt({ reduced }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [photoPrompt, setPhotoPrompt] = useState("");
  const [generatedImagePhoto, setGeneratedImagePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const convertToBase64 = (arrayBuffer) =>
    `data:image/png;base64,${btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    )}`;

  const showError = (msg) =>
    Swal.fire({ icon: "error", title: "Oops...", text: msg, confirmButtonColor: "#6366f1" });
  const showSuccess = (msg) =>
    Swal.fire({ icon: "success", title: "Done", text: msg, timer: 1000, showConfirmButton: false });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return showError("Only images allowed !");
    if (file.size > 10 * 1024 * 1024) return showError("Max 10MB!");
    setUploadedImage(file);
  };

  const handleGeneratePhoto = async () => {
    if (!uploadedImage) return showError("Upload image first.");
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

      setGeneratedImagePhoto(convertToBase64(response.data));
      showSuccess("Art generated !");
    } catch {
      showError("Failed to generate art");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (dataUrl) => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "ghibli-art.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Downloaded!");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 rounded-2xl shadow-lg bg-white/10 backdrop-blur-sm">

      <div className={`flex gap-4 w-full max-w-4xl ${reduced ? "h-36" : "h-56"}`}>

        <label
          htmlFor="photo-upload"
          className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-white/20 hover:bg-purple-50/20 transition cursor-pointer ${reduced ? "p-2" : "p-4"
            }`}
        >
          {uploadedImage ? (
            <img
              src={URL.createObjectURL(uploadedImage)}
              alt="Uploaded"
              className="object-contain w-full h-full rounded-2xl shadow-md"
            />
          ) : (
            <p className={`text-center ${reduced ? "text-sm" : "text-base"} text-gray-300`}>
              📸 Drag & Drop or Browse
            </p>
          )}
          <FileInput id="photo-upload" onChange={handleFileChange} className="hidden" />
        </label>

        <div className="flex-1 border border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center bg-white/20 shadow-sm">
          {loading ? (
            <Spinner size="xl" color="purple" />
          ) : generatedImagePhoto ? (
            <img src={generatedImagePhoto} alt="Generated" className="object-contain w-full h-full rounded-2xl" />
          ) : (
            <span className={`text-gray-300 ${reduced ? "text-sm" : "text-base"} text-center`}>
              Preview
            </span>
          )}
        </div>

      </div>

      <Textarea
        placeholder="Add prompt..."
        rows={reduced ? 2 : 3}
        className={`border border-gray-300 rounded-2xl focus:ring-1 focus:ring-purple-500 ${reduced ? "p-2 text-sm" : "p-3 text-base"
          } w-full max-w-4xl bg-transparent backdrop-blur-sm text-white placeholder-gray-300`}
        value={photoPrompt}
        onChange={(e) => setPhotoPrompt(e.target.value)}
      />


      <div className="flex gap-4 w-full max-w-4xl">
        <Button
          onClick={handleGeneratePhoto}
          disabled={loading}
          className={`flex-1 font-semibold rounded-2xl ${reduced ? "py-1 text-sm" : "py-2 text-base"}`}
          style={{ background: "linear-gradient(to right,#6366f1,#a855f7,#ec4899)" }}
        >
          {loading ? <Spinner size="sm" /> : "✨ Transform"}
        </Button>

        {generatedImagePhoto && (
          <Button
            onClick={() => handleDownload(generatedImagePhoto)}
            className={`flex-1 font-semibold rounded-2xl ${reduced ? "py-1 text-sm" : "py-2 text-base"}`}
            style={{ background: "linear-gradient(to right,#06b6d4,#3b82f6,#6366f1)" }}
          >
            ⬇️ Download
          </Button>
        )}
      </div>

    </div>
  );
}
