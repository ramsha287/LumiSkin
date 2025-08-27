// components/ProgressTracker.jsx
import { useState } from "react";
import axios from "axios";

export default function ProgressTracker({ routineId, userId }) {
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("userId", userId);
    formData.append("routineId", routineId);
    await axios.post("/api/progress", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
      <button type="submit">Upload Progress</button>
    </form>
  );
}
