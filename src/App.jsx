import { useState } from "react";
import axios from "axios";
import {
  Card,
  Tabs,
  Button,
  Textarea,
  FileInput,
  Select,
  Spinner,
} from "flowbite-react";

export default function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [textPrompt, setTextPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Ghibli");

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedImage(file);
  };

  // Convert byte[] to Base64
  const convertToBase64 = (arrayBuffer) => {
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return `data:image/png;base64,${base64}`;
  };

  // Generate art from photo
  const handleGeneratePhoto = async () => {
    if (!uploadedImage) return;
    setLoading(true);
    setGeneratedImage(null);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("prompt", textPrompt);

      const response = await axios.post(
        "http://localhost:8080/api/v1/pixiverse/generate",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, responseType: "arraybuffer" }
      );

      setGeneratedImage(convertToBase64(response.data));
    } catch (err) {
      console.error(err);
      alert("Failed to generate art");
    } finally {
      setLoading(false);
    }
  };

  // Generate art from text
  const handleGenerateText = async () => {
    if (!textPrompt) return;
    setLoading(true);
    setGeneratedImage(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/pixiverse/generate/text",
        { prompt: textPrompt, style: selectedStyle },
        { headers: { "Content-Type": "application/json" }, responseType: "arraybuffer" }
      );

      setGeneratedImage(convertToBase64(response.data));
    } catch (err) {
      console.error(err);
      alert("Failed to generate art");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-100 p-6">
      <div className="w-full max-w-6xl">
        <Tabs aria-label="Ghibli Art Generator" variant="underline">
          {/* Photo to Art */}
          <Tabs.Item active title="Photo to Art">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Card */}
              <Card className="rounded-2xl shadow-soft">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Upload Photo to Transform
                </h3>

                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  {uploadedImage ? (
                    <img
                      src={URL.createObjectURL(uploadedImage)}
                      alt="Uploaded Preview"
                      className="rounded-xl object-cover h-48 w-full"
                    />
                  ) : (
                    <p className="text-gray-500">Drag & drop image here or browse</p>
                  )}
                  <FileInput onChange={handleFileChange} className="hidden" />
                </label>

                <Textarea
                  placeholder="Add an additional prompt..."
                  className="mt-4 p-3 border border-gray-300 rounded-xl shadow-soft focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all duration-300"
                  rows={3}
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                />

                <Button
                  className="mt-4 text-white font-semibold py-2 px-6 rounded-xl shadow-soft hover:scale-105 transform transition-all duration-300"
                  style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
                  onClick={handleGeneratePhoto}
                  disabled={loading}
                >
                  {loading ? "Transforming..." : "Transform to Ghibli Art"}
                </Button>
              </Card>

              {/* Output Preview */}
              <Card className="rounded-2xl shadow-soft flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full h-80 flex items-center justify-center">
                  {loading ? (
                    <Spinner size="xl" color="purple" />
                  ) : generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Generated Art"
                      className="rounded-xl object-cover h-full"
                    />
                  ) : (
                    <span className="text-gray-400">Generated art will appear here</span>
                  )}
                </div>
              </Card>
            </div>
          </Tabs.Item>

          {/* Text to Art */}
          <Tabs.Item title="Text to Art">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Card */}
              <Card className="rounded-2xl shadow-soft">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Text to Ghibli Art
                </h3>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer mb-4">
                  <p className="text-gray-500">Generate Ghibli art from your text description</p>
                </div>

                <Select
                  className="mb-4"
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
                  className="mt-4 p-3 border border-gray-300 rounded-xl shadow-soft focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all duration-300"
                  rows={3}
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                />

                <Button
                  className="mt-4 text-white font-semibold py-2 px-6 rounded-xl shadow-soft hover:scale-105 transform transition-all duration-300"
                  style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
                  onClick={handleGenerateText}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Art"}
                </Button>
              </Card>

              {/* Output Preview */}
              <Card className="rounded-2xl shadow-soft flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full h-80 flex items-center justify-center text-center">
                  {loading ? (
                    <Spinner size="xl" color="purple" />
                  ) : generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Generated Art"
                      className="rounded-xl object-cover h-full"
                    />
                  ) : textPrompt ? (
                    <p className="text-lg text-gray-600 italic">✨ Preview: "{textPrompt}"</p>
                  ) : (
                    <span className="text-gray-400">Generated art will appear here</span>
                  )}
                </div>
              </Card>
            </div>
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
}
