export const FormField = ({ label, children }) => (
  <div className="space-y-1">
    <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
      {label}
    </label>
    {children}
  </div>
);