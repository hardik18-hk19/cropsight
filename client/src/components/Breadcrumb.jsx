import React from "react";
import { useNavigate } from "react-router-dom";

const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();

  const defaultItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const allItems = [...defaultItems, ...items];

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {allItems.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-6 h-6 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {index === allItems.length - 1 ? (
              <span className="text-gray-500 text-sm font-medium">
                {item.name}
              </span>
            ) : (
              <button
                onClick={() => item.path && navigate(item.path)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                {item.name}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
