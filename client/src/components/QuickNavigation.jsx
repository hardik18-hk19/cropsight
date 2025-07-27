import React from "react";

const QuickNavigation = ({ items = [] }) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-blue-900 mb-3">Quick Actions</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              item.variant === "danger"
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : item.variant === "success"
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
            disabled={item.disabled}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickNavigation;
