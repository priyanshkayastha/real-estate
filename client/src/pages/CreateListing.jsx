import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  useEffect(() => {
    // cleanup previous previews
    previews.forEach((url) => URL.revokeObjectURL(url));
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFilesChange = (e) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length > 6) {
      alert("You can select up to 6 images. Extra files will be ignored.");
      setFiles(selected.slice(0, 6));
    } else {
      setFiles(selected);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const storeImage = async (file) => {
    const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const url = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", preset);

    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageSubmit = async (e) => {
    e && e.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one image.");
      return;
    }
    if (files.length > 6) {
      alert("Maximum 6 images allowed.");
      return;
    }

    setUploading(true);
    try {
      const results = await Promise.all(files.map((f) => storeImage(f)));
      setUploadedUrls(results);
      setFormData((p) => ({ ...p, imageUrls: results }));
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked, name } = e.target;

    if (type === "radio" && name === "type") {
      setFormData((p) => ({ ...p, type: value }));
      return;
    }

    if (type === "checkbox") {
      setFormData((p) => ({ ...p, [id]: checked }));
      return;
    }

    if (type === "number") {
      setFormData((p) => ({ ...p, [id]: value === "" ? "" : Number(value) }));
      return;
    }

    setFormData((p) => ({ ...p, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    try {
      let uploaded = formData.imageUrls;

      if (uploaded.length === 0 && files.length > 0) {
        const results = await Promise.all(files.map((f) => storeImage(f)));
        uploaded = results;
      }

      if (uploaded.length === 0) {
        alert("Please upload at least one image.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            currentUser?.token || currentUser?.accessToken
          }`,
        },
        body: JSON.stringify({
          ...formData,
          imageUrls: uploaded,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || "Create failed");
      } else {
        alert("Listing created successfully!");
        setFiles([]);
        setFormData({
          imageUrls: [],
          name: "",
          description: "",
          address: "",
          type: "rent",
          bedrooms: 1,
          bathrooms: 1,
          regularPrice: 0,
          discountPrice: 0,
          offer: false,
          parking: false,
          furnished: false,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            onChange={handleChange}
            value={formData.name}
            required
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            onChange={handleChange}
            value={formData.description}
            required
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            onChange={handleChange}
            value={formData.address}
            required
          />

          <div className="flex gap-6 flex-wrap items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="sale"
                checked={formData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sell</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="rent"
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parking"
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking Spot</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="furnished"
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                checked={formData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </label>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg w-20"
                  type="number"
                  id="bedrooms"
                  min={1}
                  max={10}
                  onChange={handleChange}
                  value={formData.bedrooms}
                  required
                />
                <p>Beds</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg w-20"
                  type="number"
                  id="bathrooms"
                  min={1}
                  max={10}
                  onChange={handleChange}
                  value={formData.bathrooms}
                  required
                />
                <p>Baths</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg w-28"
                  type="number"
                  id="regularPrice"
                  min={1}
                  onChange={handleChange}
                  value={formData.regularPrice}
                  required
                />
                <p>Regular Price</p>
                <span className="text-xs">₹ / month</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg w-28"
                  type="number"
                  id="discountPrice"
                  min={0}
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <p>Discounted Price</p>
                <span className="text-xs">₹ / month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex items-center gap-3">
            <input
              onChange={handleFilesChange}
              className="border p-3 border-gray-300 rounded-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />

            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading || files.length === 0}
              className={`p-3 rounded uppercase border ${
                uploading || files.length === 0
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-green-700 border-green-700 hover:shadow-lg"
              }`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* preview grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {previews.map((url, i) => (
              <div
                key={url}
                className="relative rounded-lg overflow-hidden border"
              >
                <img
                  src={url}
                  alt={`preview-${i}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`p-3 bg-slate-700 text-white rounded-lg opacity-95 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"
            }`}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
