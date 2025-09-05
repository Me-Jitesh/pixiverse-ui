import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Card, Button, Textarea, Select, Spinner } from "flowbite-react";

export default function TextToArt() {
    const [textPrompt, setTextPrompt] = useState("");
    const [selectedStyle, setSelectedStyle] = useState("cinematic");
    const [generatedImageText, setGeneratedImageText] = useState(null);
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

    // Generate from text
    const handleGenerateText = async () => {
        if (!textPrompt.trim()) {
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
                        <img
                            src={generatedImageText}
                            alt="Generated Art"
                            className="rounded-xl object-cover h-full shadow-md"
                        />
                    ) : textPrompt ? (
                        <p className="text-lg text-gray-600 italic">✨ Preview: "{textPrompt}"</p>
                    ) : (
                        <span className="text-gray-400 font-medium">
                            Generated art will appear here
                        </span>
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
    );
}
