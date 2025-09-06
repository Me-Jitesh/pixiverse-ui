import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Textarea, Spinner } from "flowbite-react";

const STYLES = [
    "cinematic", "anime", "photographic", "pixel-art", "3d-model", "isometric",
    "origami", "neon-punk", "low-poly", "line-art", "fantasy-art", "digital-art"
];

export default function TextToArt({ reduced }) {
    const [textPrompt, setTextPrompt] = useState("");
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
    const [generatedImageText, setGeneratedImageText] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const convertToBase64 = (arrayBuffer) =>
        `data:image/png;base64,${btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        )}`;

    const showError = (msg) =>
        Swal.fire({ icon: "error", title: "Oops...", text: msg, confirmButtonColor: "#6366f1" });
    const showSuccess = (msg) =>
        Swal.fire({ icon: "success", title: "Done", text: msg, timer: 1000, showConfirmButton: false });

    const handleGenerateText = async () => {
        if (!textPrompt.trim()) return showError("Enter a prompt.");
        setLoading(true);
        setGeneratedImageText(null);
        setImageLoaded(false);

        try {
            const response = await axios.post(
                "https://pixiverse.koyeb.app/api/v1/pixiverse/generate/text",
                { prompt: textPrompt, style: selectedStyle },
                { headers: { "Content-Type": "application/json" }, responseType: "arraybuffer" }
            );
            setGeneratedImageText(convertToBase64(response.data));
            showSuccess("Art generated!");
        } catch {
            showError("Failed to generate art.");
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
        showSuccess("Downloaded");
    };

    return (
        <div className="flex justify-center items-center w-full py-6 px-3">
            <div className="flex flex-col items-center gap-4 p-5 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50 w-full max-w-4xl">

                {/* Two-column layout */}
                <div className="flex flex-col md:flex-row w-full gap-4">

                    {/* Left: inputs */}
                    <div className="flex-1 flex flex-col gap-3">
                        {/* Style selector */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {STYLES.map((style) => (
                                <div
                                    key={style}
                                    onClick={() => setSelectedStyle(style)}
                                    className={`px-3 py-1 rounded-xl cursor-pointer transition-all duration-200 ${selectedStyle === style
                                        ? "bg-purple-400 text-white shadow-md"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-purple-100"
                                        } ${reduced ? "text-sm" : "text-base"}`}
                                >
                                    {style}
                                </div>
                            ))}
                        </div>

                        {/* Prompt textarea */}
                        <Textarea
                            placeholder="Your description..."
                            rows={2}
                            value={textPrompt}
                            onChange={(e) => {
                                setTextPrompt(e.target.value);
                                e.target.style.height = "auto";
                                e.target.style.height = e.target.scrollHeight + "px";
                            }}
                            className={`border border-gray-300 rounded-2xl w-full focus:ring-1 focus:ring-purple-200 resize-none ${reduced ? "p-2 text-sm" : "p-3 text-base"
                                }`}
                        />

                        {/* Generate button */}
                        <Button
                            onClick={handleGenerateText}
                            disabled={loading}
                            className={`w-full font-semibold rounded-2xl ${reduced ? "py-1 text-sm" : "py-2 text-base"}`}
                            style={{ background: "linear-gradient(to right,#6366f1,#a855f7,#ec4899)" }}
                        >
                            {loading ? <Spinner size="sm" /> : "🎨 Generate"}
                        </Button>
                    </div>

                    {/* Right: preview (same as PhotoToArt) */}
                    <div className="flex-1 border border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center bg-white shadow-sm min-h-[180px] max-h-[400px]">
                        {loading ? (
                            <Spinner size="xl" color="purple" />
                        ) : generatedImageText ? (
                            <img
                                src={generatedImageText}
                                alt="Generated"
                                className={`max-h-[400px] w-auto h-auto rounded-2xl transition-opacity duration-700 ${imageLoaded ? "opacity-100" : "opacity-0"
                                    }`}
                                onLoad={() => setImageLoaded(true)}
                            />
                        ) : (
                            <span className={`text-gray-400 text-center ${reduced ? "text-sm" : "text-base"}`}>
                                Generated art will appear here
                            </span>
                        )}
                    </div>
                </div>

                {/* Download button */}
                {generatedImageText && (
                    <Button
                        onClick={() => handleDownload(generatedImageText)}
                        className={`w-full font-semibold rounded-2xl ${reduced ? "py-1 text-sm" : "py-2 text-base"}`}
                        style={{ background: "linear-gradient(to right,#06b6d4,#3b82f6,#6366f1)" }}
                    >
                        ⬇️ Download
                    </Button>
                )}
            </div>
        </div>
    );
}
