// components/RoutineForm.jsx
import { useState } from "react";
import axios from "axios";

export default function RoutineForm({ userId, onAdded }) {
  const [name, setName] = useState("");
  const [steps, setSteps] = useState([{ product: "", time: "morning", order: 1 }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("/api/routines", { userId, name, steps });
    onAdded(res.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Routine Name" />
      {steps.map((step, i) => (
        <input
          key={i}
          value={step.product}
          onChange={e => {
            const updated = [...steps];
            updated[i].product = e.target.value;
            setSteps(updated);
          }}
          placeholder="Product"
        />
      ))}
      <button type="submit">Save Routine</button>
    </form>
  );
}
