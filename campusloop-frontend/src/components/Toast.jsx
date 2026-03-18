import { useState, useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, []);

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${colors[type]} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-white opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}