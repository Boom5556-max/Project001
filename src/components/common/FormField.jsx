import React from "react";

export const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-2 font-sans">
    <label className="text-sm font-bold text-gray-500 ml-1">
      {label}
    </label>
    {children}
  </div>
);