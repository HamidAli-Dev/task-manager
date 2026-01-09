import { useState } from "react";

const TabsLayout = ({ tabs, defaultTab = 0, onTabChange, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onTabChange?.(index);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-2">
        <div className="flex space-x-1">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(index)}
              className={`
                flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  activeTab === index
                    ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-100">{children(activeTab)}</div>
    </div>
  );
};

export default TabsLayout;
