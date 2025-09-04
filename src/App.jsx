import { useState } from "react";
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

  // Handle file upload & preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  // Simulate API call for generating art
  const handleGenerate = () => {
    setLoading(true);
    setGeneratedImage(null);

    setTimeout(() => {
      setGeneratedImage("https://placehold.co/400x300?text=Ghibli+Art");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-100 p-6">
      <div className="w-full max-w-6xl">

        <Tabs aria-label="Ghibli Art Generator" variant="underline">

          {/* Photo to Art */}
          <Tabs.Item active title="Photo to Art">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Input Card */}
              <Card className="rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Upload Photo to Transform
                </h3>

                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                >
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Uploaded Preview"
                      className="rounded-lg object-cover h-48 w-full"
                    />
                  ) : (
                    <p className="text-gray-500">
                      Drag & drop image here or browse
                    </p>
                  )}
                  <FileInput
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <Textarea
                  placeholder="Add an additional prompt..."
                  className="mt-4"
                  rows={3}
                />

                <Button
                  className="mt-4 from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-xl shadow-soft hover:scale-105 transform transition-all duration-300"
                  onClick={handleGenerate}
                  style={{ background: 'linear-gradient(to left, #384af6, #855555)' }}
                  disabled={loading}
                >
                  {loading ? "Transforming..." : "Transform to Ghibli Art"}
                </Button>


              </Card>

              {/* Output Preview */}
              <Card className="rounded-2xl shadow-lg flex items-center justify-center bg-gray-100">
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
                    <span className="text-gray-400">
                      Generated art will appear here
                    </span>
                  )}
                </div>
              </Card>
            </div>
          </Tabs.Item>

          {/* Text to Art */}
          <Tabs.Item title="Text to Art">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Card */}
              <Card className="rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Text to Ghibli Art
                </h3>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <p className="text-gray-500">
                    Generate Ghibli art from your text description
                  </p>
                </div>

                <Select className="mt-4">
                  <option>Ghibli</option>
                  <option>Anime</option>
                  <option>Pixar</option>
                </Select>

                <Textarea
                  placeholder="Your description..."
                  className="mt-4"
                  rows={3}
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                />

                <Button
                  className="mt-4 text-white font-semibold py-2 px-6 rounded-xl shadow-soft hover:scale-105 transform transition-all duration-300"
                  style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? "Transforming..." : "Transform to Ghibli Art"}
                </Button>

              </Card>

              {/* Output Preview */}
              <Card className="rounded-2xl shadow-lg flex items-center justify-center bg-gray-100 p-4">
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
                    <p className="text-lg text-gray-600 italic">
                      ✨ Preview: "{textPrompt}"
                    </p>
                  ) : (
                    <span className="text-gray-400">
                      Generated art will appear here
                    </span>
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
