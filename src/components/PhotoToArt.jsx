import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Card, Button, Textarea, FileInput, Spinner } from "flowbite-react";

export default function PhotoToArt() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [photoPrompt, setPhotoPrompt] = useState("");
    const [generatedImagePhoto, setGeneratedImagePhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    // Convert arraybuffer to base64
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
    const showError = (msg) =>
        Swal.fire({ icon: "error", title: "Oops...", text: msg, confirmButtonColor: "#6366f1" });
    const showSuccess = (msg) =>
        Swal.fire({ icon: "success", title: "Done", text: msg, timer: 1300, showConfirmButton: false });

    // File validation
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showError("Only image files are allowed!");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showError("File size must be under 10MB!");
            return;
        }

        setUploadedImage(file);
    };

    // Generate from photo
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

    // Download helper
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
                        <p className="text-gray-500 font-medium">
                            📸 Drag & drop image here or browse
                        </p>
                    )}
                </label>

                <FileInput id="photo-upload" onChange={handleFileChange} className="hidden" />

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
                        <img
                            src={generatedImagePhoto}
                            alt="Generated Art"
                            className="rounded-xl object-cover h-full shadow-md"
                        />
                    ) : (
                        <span className="text-gray-400 font-medium">
                            Generated art will appear here
                        </span>
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
    );
}
