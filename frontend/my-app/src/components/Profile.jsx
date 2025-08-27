"use client";
import React, { useState, useEffect } from "react";
import { Great_Vibes } from "next/font/google";
import { motion } from "framer-motion";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

// ProfileDisplay Component
function ProfileDisplay({ profile }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow space-y-3 border border-[#d7bfae] text-black">
            <h3 className="text-2xl font-semibold text-black">
                {profile.firstName} {profile.lastName}
            </h3>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Skin Type:</strong> {profile.skinType || "Not specified"}</p>
            <p><strong>Budget:</strong> {profile.budget || "Not specified"}</p>
        </div>
    );
}

// ProfileForm Component for Completing Profile
function ProfileForm({ data, onChange, onSubmit, loading }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4 border border-[#d7bfae] text-black">
            <h4 className="text-xl font-semibold text-[#5a3e36] mb-2">Complete Your Profile</h4>

            <label className="block mb-2">
                Skin Type:
                <select
                    className="mt-1 block w-full p-2 border rounded border-[#cdbbaf]"
                    value={data.skinType}
                    onChange={(e) => onChange({ ...data, skinType: e.target.value })}
                >
                    <option value="">Select skin type</option>
                    <option value="oily">Oily</option>
                    <option value="dry">Dry</option>
                    <option value="combination">Combination</option>
                    <option value="sensitive">Sensitive</option>
                </select>
            </label>

            <label className="block mb-2">
                Skin Concerns (comma separated):
                <input
                    type="text"
                    className="mt-1 block w-full p-2 border rounded border-[#cdbbaf]"
                    value={data.skinConcerns.join(", ")}
                    onChange={(e) =>
                        onChange({
                            ...data,
                            skinConcerns: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                        })
                    }
                />
            </label>

            <label className="block mb-2">
                Allergies (comma separated):
                <input
                    type="text"
                    className="mt-1 block w-full p-2 border rounded border-[#cdbbaf]"
                    value={data.allergies.join(", ")}
                    onChange={(e) =>
                        onChange({
                            ...data,
                            allergies: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                        })
                    }
                />
            </label>

            <label className="block mb-4">
                Budget:
                <select
                    className="mt-1 block w-full p-2 border rounded border-[#cdbbaf]"
                    value={data.budget}
                    onChange={(e) => onChange({ ...data, budget: e.target.value })}
                >
                    <option value="">Select budget</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="luxury">Luxury</option>
                </select>
            </label>

            <button
                onClick={onSubmit}
                disabled={loading}
                className="bg-[#5a3e36] text-white px-4 py-2 rounded hover:bg-[#7a5f4a] transition"
            >
                Save Profile
            </button>
        </div>
    );
}

// ChangePasswordForm Component
function ChangePasswordForm({ passwords, setPasswords, onChangePassword, loading }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4 border border-[#d7bfae] text-black">
            <h4 className="text-xl font-semibold text-[#5a3e36] mb-2">Change Password</h4>
            <input
                type="password"
                placeholder="Current Password"
                className="block w-full p-2 border rounded border-[#cdbbaf]"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            />
            <input
                type="password"
                placeholder="New Password"
                className="block w-full p-2 border rounded border-[#cdbbaf]"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
            <button
                onClick={onChangePassword}
                disabled={loading}
                className="bg-[#5a3e36] text-white px-4 py-2 rounded hover:bg-[#7a5f4a] transition"
            >
                Change Password
            </button>
        </div>
    );
}

// DeleteAccountButton Component
function DeleteAccountButton({ onDeleteAccount, loading }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4 border border-[#d7bfae] text-black">
            <h4 className="text-xl font-semibold text-[#5a3e36] mb-2">Delete Account</h4>
            <button
                onClick={onDeleteAccount}
                disabled={loading}
                className="bg-[#5a3e36] text-white px-4 py-2 rounded hover:bg-[#7a5f4a] transition"
            >
                Delete My Account
            </button>
        </div>
    );
}

// Main ProfilePage Component
export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [completeProfileData, setCompleteProfileData] = useState({
        skinType: "",
        skinConcerns: [],
        allergies: [],
        budget: "",
    });
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (!token) return setError("User not authenticated.");

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_API_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to load profile.");
                const data = await res.json();
                setProfile(data.user);
                setCompleteProfileData({
                    skinType: data.skinType || "",
                    skinConcerns: data.skinConcerns || [],
                    allergies: data.allergies || [],
                    budget: data.budget || "",
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleCompleteProfileSubmit = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_API_URL}/api/auth/complete-profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(completeProfileData),
            });
            if (!res.ok) throw new Error("Failed to update profile.");
            const updated = await res.json();
            setProfile(updated);
            alert("Profile updated successfully.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_API_URL}/api/auth/change-password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(passwords),
            });
            if (!res.ok) throw new Error("Failed to change password.");
            alert("Password changed successfully!");
            setPasswords({ currentPassword: "", newPassword: "" });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_API_URL}/api/auth/account`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete account.");
            alert("Account deleted. Logging out.");
            localStorage.removeItem("token");
            window.location.href = "/";
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return <p className="text-center p-8">Please log in to view your profile.</p>;
    }

    return (
        <div className="min-h-screen bg-white p-8 space-y-8">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${greatVibes.className} text-4xl text-center text-black`}
            >
                Your Profile
            </motion.h2>
            <div className="min-h-screen bg-[#fbeedb] p-8 space-y-8 max-w-3xl mx-auto rounded-xl shadow-lg">


                {error && <p className="text-black text-center">{error}</p>}
                {loading && <p className="text-center text-black">Loading...</p>}

                {!loading && profile && (
                    <>
                        <ProfileDisplay profile={profile} />

                        <ProfileForm
                            data={completeProfileData}
                            onChange={setCompleteProfileData}
                            onSubmit={handleCompleteProfileSubmit}
                            loading={loading}
                        />

                        <ChangePasswordForm
                            passwords={passwords}
                            setPasswords={setPasswords}
                            onChangePassword={handleChangePassword}
                            loading={loading}
                        />

                        <DeleteAccountButton onDeleteAccount={handleDeleteAccount} loading={loading} />
                    </>
                )}
            </div>
        </div>

    );
}
