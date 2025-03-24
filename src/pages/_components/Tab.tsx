import { cn } from "@/lib/utils";
import React from "react";

interface TabComponentProps {
  activeTab: boolean;
  setActiveTab: (active: boolean) => void;
}

const labels = {
  firstTab: "소명확인서",
  secondTab: "변경요청서",
};

const TabComponent = ({ activeTab, setActiveTab }: TabComponentProps) => (
  <div className="relative flex mb-12">
    <div className="flex w-full gap-3 bg-white/50 backdrop-blur p-2">
      <button
        onClick={() => setActiveTab(true)}
        className={cn(
          "group relative flex-1 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300",
          !activeTab
            ? "text-gray-700 hover:bg-[#3396f4]/10"
            : "bg-[#3396f4] text-white shadow-lg shadow-blue-200/50"
        )}
      >
        {labels.firstTab}
        {!activeTab && (
          <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#3396f4]/20" />
        )}
      </button>

      <button
        onClick={() => setActiveTab(false)}
        className={cn(
          "group relative flex-1 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300",
          activeTab
            ? "text-gray-700 hover:bg-[#3396f4]/10"
            : "bg-[#3396f4] text-white shadow-lg shadow-blue-200/50"
        )}
      >
        {labels.secondTab}
        {activeTab && (
          <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#3396f4]/20" />
        )}
      </button>
    </div>
  </div>
);

export default TabComponent;
