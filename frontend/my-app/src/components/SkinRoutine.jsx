"use client";
import React, { useState, useEffect } from "react";
import { Great_Vibes } from "next/font/google";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
});

export default function SkinRoutine({ userId }) {
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [newStep, setNewStep] = useState("");
  const [manualRoutineName, setManualRoutineName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStepIndex, setEditStepIndex] = useState(null);
  const [editStepValue, setEditStepValue] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");

  // Fetch routines
  useEffect(() => {
    const fetchRoutines = async () => {
      const storedUser =
        typeof window !== "undefined" && localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      const userId = storedUser?._id;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_API_URL}/api/routines/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setRoutines(Array.isArray(data) ? data : []);
        if (data?.length > 0) setSelectedRoutine(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, [userId]);

  const updateRoutineState = (updatedRoutine) => {
    setSelectedRoutine(updatedRoutine);
    setRoutines((prev) =>
      prev.map((r) => (r._id === updatedRoutine._id ? updatedRoutine : r))
    );
  };

  // Generate routine from API
  const generateRoutine = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_API_URL}/api/routines/generate/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const generatedRoutine = await res.json();
      setRoutines((prev) => [...prev, generatedRoutine]);
      setSelectedRoutine(generatedRoutine);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add routine manually
  const addRoutine = async () => {
    if (!manualRoutineName.trim()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_API_URL}/api/routines`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            name: manualRoutineName,
            steps: [],
          }),
        }
      );
      const newRoutine = await res.json();
      setRoutines((prev) => [...prev, newRoutine]);
      setSelectedRoutine(newRoutine);
      setManualRoutineName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add step to selected routine
  const addStep = async () => {
    if (!newStep.trim() || !selectedRoutine) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_API_URL}/api/routines/${selectedRoutine._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ step: newStep }),
        }
      );
      const updatedRoutine = await res.json();
      updateRoutineState(updatedRoutine);
      setNewStep("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle step completion
  const toggleStep = async (index) => {
    if (!selectedRoutine) return;
    const updatedSteps = selectedRoutine.steps.map((step, i) =>
      i === index ? { ...step, completed: !step.completed } : step
    );
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_API_URL}/api/routines/${selectedRoutine._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ steps: updatedSteps }),
        }
      );
      const updatedRoutine = await res.json();
      updateRoutineState(updatedRoutine);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete step from routine
  const deleteStep = async (index) => {
    if (!selectedRoutine) return;
    const updatedSteps = selectedRoutine.steps.filter((_, i) => i !== index);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_API_URL}/api/routines/${selectedRoutine._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ steps: updatedSteps }),
        }
      );
      const updatedRoutine = await res.json();
      updateRoutineState(updatedRoutine);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete routine
  const deleteRoutine = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_REACT_API_URL}/api/routines/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutines((prev) => prev.filter((r) => r._id !== id));
      if (selectedRoutine?._id === id) setSelectedRoutine(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Rename routine (save rename)
  const renameRoutine = async () => {
    if (!newRoutineName.trim() || !selectedRoutine) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_API_URL}/api/routines/${selectedRoutine._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newRoutineName }),
        }
      );
      const updatedRoutine = await res.json();
      updateRoutineState(updatedRoutine);
      setIsRenaming(false);
      setNewRoutineName("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Open modal to edit step
  const openEditModal = (index, value) => {
    setEditStepIndex(index);
    setEditStepValue(value);
    setIsModalOpen(true);
  };

  // Save edited step
  const saveEditedStep = async () => {
    if (editStepIndex === null || !selectedRoutine) return;
    const updatedSteps = [...selectedRoutine.steps];
    updatedSteps[editStepIndex] = {
      ...updatedSteps[editStepIndex],
      product: editStepValue,
    };
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_API_URL}/api/routines/${selectedRoutine._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ steps: updatedSteps }),
        }
      );
      const updatedRoutine = await res.json();
      updateRoutineState(updatedRoutine);
      setIsModalOpen(false);
      setEditStepIndex(null);
      setEditStepValue("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 space-y-10">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${greatVibes.className} text-4xl text-center text-black`}
      >
        Skin Routine
      </motion.h2>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading && <p className="text-center text-gray-600">Loading...</p>}

      {/* Actions: generate + manual add */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        <button
          onClick={generateRoutine}
          className="px-6 py-3 rounded-2xl shadow bg-[#eee4e1] text-black font-semibold hover:bg-[#e7d8c9] transition"
        >
          Generate Routine
        </button>

        {/* Manual add */}
        <div className="flex gap-2">
          <input
            type="text"
            value={manualRoutineName}
            onChange={(e) => setManualRoutineName(e.target.value)}
            placeholder="Enter routine name..."
            className="p-3 border rounded-xl text-black"
          />
          <button
            onClick={addRoutine}
            className="px-6 bg-[#5a3e36] text-white rounded-xl hover:scale-105 transition"
          >
            Add Routine
          </button>
        </div>
      </div>

      {/* Routine selector */}
      {routines.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {routines.map((routine, i) => {
            const routineId = routine?._id || `routine-${i}`;
            const selected = selectedRoutine?._id === routine?._id;
            return (
              <motion.div
                key={routineId}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-xl border shadow flex items-center gap-2 cursor-pointer ${
                  selected ? "bg-[#b2967d] text-white" : "bg-[#eee4e1] text-black"
                }`}
                onClick={() => setSelectedRoutine(routine)}
              >
                {selected && isRenaming ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={newRoutineName}
                      onChange={(e) => setNewRoutineName(e.target.value)}
                      className="p-1 rounded-md"
                      placeholder="New routine name"
                    />
                    <button
                      onClick={renameRoutine}
                      className="px-2 py-1 rounded bg-[#5a3e36] text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsRenaming(false);
                        setNewRoutineName("");
                      }}
                      className="px-2 py-1 rounded border border-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{routine?.name || `Routine ${i + 1}`}</span>
                    {selected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRenaming(true);
                          setNewRoutineName(routine?.name || "");
                        }}
                        className="text-[#5a3e36] hover:text-black"
                        title="Rename routine"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRoutine(routine._id);
                      }}
                      className="ml-2 text-sm text-red-600 hover:text-red-800"
                      title="Delete routine"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No routines found.</p>
      )}

      {/* Selected routine steps */}
      {selectedRoutine && (
        <div className="max-w-4xl mx-auto bg-[#e7d8c9] p-6 rounded-2xl shadow-xl space-y-6">
          <ul className="space-y-3">
            {selectedRoutine.steps.length > 0 ? (
              selectedRoutine.steps.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer ${
                    step.completed ? "bg-[#e6beae] line-through" : "bg-white"
                  }`}
                >
                  <span
                    onClick={() => toggleStep(index)}
                    className="flex items-center gap-2"
                    title={step.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border ${
                        step.completed ? "bg-[#b2967d]" : "bg-transparent"
                      }`}
                    ></span>
                    {step.product}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(index, step.product)}
                      className="text-sm text-[#5a3e36] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStep(index)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.li>
              ))
            ) : (
              <p className="text-gray-500">No steps added yet.</p>
            )}
          </ul>

          {/* Add Step */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Add a step..."
              className="flex-1 p-3 rounded-xl border text-black"
            />
            <button
              onClick={addStep}
              className="px-6 bg-[#b2967d] text-white rounded-xl hover:scale-105 transition"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Step Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 space-y-4">
            <h3 className="text-xl font-bold text-black">Edit Step</h3>
            <input
              type="text"
              value={editStepValue}
              onChange={(e) => setEditStepValue(e.target.value)}
              className="w-full p-3 border rounded-xl text-black"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedStep}
                className="px-4 py-2 bg-[#b2967d] text-white rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
