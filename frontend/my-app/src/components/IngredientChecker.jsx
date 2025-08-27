"use client";
import React, { useState } from "react";
import { Great_Vibes } from "next/font/google";
import { motion } from "framer-motion";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
});

export default function IngredientChecker() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;


  const handleCheck = async () => {
    setError("");
    setResults([]);
    const ingredientsArray = input
      .split(/[\n,]+/)
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (ingredientsArray.length === 0) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_API_URL}/api/ingredients/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ingredients: ingredientsArray }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch ingredient data");
      }

      const data = await res.json();
      setResults(data.analysis || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${greatVibes.className} text-4xl text-center text-black`}
      >
        Ingredient Checker
      </motion.h2>

      <div className="max-w-xl mx-auto flex flex-col gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter ingredients separated by commas or new lines..."
          rows={6}
          className="p-4 rounded-xl border border-gray-300 text-black resize-none"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-[#b2967d] text-white font-semibold py-3 rounded-xl hover:bg-[#a07e5e] transition disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Ingredients"}
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>

      <div className="max-w-3xl mx-auto space-y-4 text-black">
        {results.map(({ ingredient, category, harmful, description, found }, index) => (
          <motion.div
            key={ingredient + index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border shadow ${
              harmful ? "bg-red-100 border-red-400" : "bg-green-50 border-green-300"
            }`}
          >
            <h3 className="text-2xl font-bold capitalize">{ingredient}</h3>
            <p className="italic text-sm mb-2">{category}</p>
            <p className="mb-2">{description}</p>
            <p>
              Status:{" "}
              <span className={harmful ? "text-red-700 font-semibold" : "text-green-700 font-semibold"}>
                {harmful ? "Harmful" : found ? "Safe" : "Unknown"}
              </span>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
