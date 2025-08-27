"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
});

export default function DermaScan() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    skin_type: "",
    sensitivity: "",
    budget: "",
    preferences: "",
    dryness: "",
    redness: "",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);

    if (!file) return setError("Please upload a selfie first.");
    const token = localStorage.getItem("token");
    if (!token) return setError("User not logged in.");

    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ML_API_URL}/analyze/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      if (!response.ok) throw new Error("Failed to analyze skin.");

      const result = await response.json();
      console.log("Backend full response:", result);
      setResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 space-y-12">
      <h2
        className={`${greatVibes.className} text-4xl font-bold text-center text-black mb-8`}
      >
        DermaScan
      </h2>

      {/* Form Section */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto items-center">
        <div className="lg:w-1/2 relative w-full h-80 lg:h-[400px]">
          <img
            src="/skin1.jpeg"
            alt="Skin Model 1"
            className="w-full h-fullobject-cover shadow-lg"
          />
        </div>

        <div className="lg:w-1/2 space-y-4 bg-gray-100 p-6 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-black rounded-xl p-3 border border-gray-300"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                name="skin_type"
                value={formData.skin_type}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 p-3 text-black"
              >
                <option value="">Skin Type</option>
                <option value="oily">Oily</option>
                <option value="dry">Dry</option>
                <option value="combination">Combination</option>
                <option value="normal">Normal</option>
              </select>

              <select
                name="sensitivity"
                value={formData.sensitivity}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 p-3 text-black"
              >
                <option value="">Sensitivity</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>

              <input
                type="number"
                name="budget"
                placeholder="Budget (₹)"
                value={formData.budget}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 p-3 text-black"
              />

              <input
                type="text"
                name="preferences"
                placeholder="Preferences"
                value={formData.preferences}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 p-3 text-black"
              />

              <select
                name="dryness"
                value={formData.dryness}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 p-3 text-black"
              >
                <option value="">Dryness</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>

              <select
                name="redness"
                value={formData.redness}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 p-3 text-black"
              >
                <option value="">Redness</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#5a3e36] text-white font-semibold hover:bg-gray-800 transition"
            >
              {loading ? "Analyzing..." : "Scan"}
            </button>

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          </form>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto items-start">

          {/* Left Column: Skin Analysis */}
          <div className="lg:w-1/2 space-y-4 bg-gray-100 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-black">Skin Analysis</h3>
            <ul className="list-disc list-inside text-black">
              {results.skin_profile ? (
                <>
                  <li>
                    Wrinkles: {results.skin_profile.wrinkles ? "Detected" : "Not Detected"}
                  </li>
                  <li>
                    Acne: {results.skin_profile.acne ? "Detected" : "Not Detected"}
                  </li>
                  <li>
                    Hyperpigmentation: {results.skin_profile.hyperpigmentation ? "Detected" : "Not Detected"}
                  </li>
                  <li>
                    Redness: {results.skin_profile.redness ? "Detected" : "Not Detected"}
                  </li>
                  <li>
                    Dryness: {results.skin_profile.dryness ? "Detected" : "Not Detected"}
                  </li>
                </>
              ) : (
                <p>No analysis available.</p>
              )}
            </ul>

            {/* Recommended Ingredients */}
            <h3 className="text-2xl font-bold text-black mt-6">Recommended Ingredients</h3>
            {results.recommended_ingredients?.length > 0 ? (
              <ul className="list-disc list-inside text-black">
                {results.recommended_ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p>No ingredients recommended.</p>
            )}

            {/* Recommended Products */}
            <h3 className="text-2xl font-bold text-black mt-6">Recommended Products</h3>
            {results.recommended_products?.length > 0 ? (
              <ul className="space-y-2">
                {results.recommended_products.map((product, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-xl border border-gray-300"
                  >
                    <p className="font-semibold text-black">{product.name}</p>
                    <p className="text-sm text-gray-700">
                      Ingredients: {product.ingredients?.join(", ") || "N/A"}
                    </p>
                    <p className="text-sm font-medium text-black">
                      ₹{product.price}
                    </p>
                    <p className="text-sm text-yellow-600">
                      Rating: {product.rating || "N/A"}
                    </p>
                    {product.preferences?.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Preferences: {product.preferences.join(", ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">No recommended products found.</p>
            )}
          </div>

          {/* Right Column: Skin2 Image */}
          <div className="lg:w-1/2 relative w-full h-80 lg:h-[400px]">
            <img
              src="/skin2.jpeg"
              alt="Skin Model 2"
              className="w-full h-full object-cover shadow-lg rounded-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
