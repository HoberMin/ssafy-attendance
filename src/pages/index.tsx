import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AbsenceForm from "./components/confirmForm";
import AttendanceChangeForm from "./components/changeForm";

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState("absence");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-20">
            <h1 className="text-2xl font-bold text-gray-900">
              SSAFY 출결 생성기
            </h1>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {/* 탭 네비게이션 */}
        <div className="max-w-2xl mx-auto">
          <div className="relative flex mb-12">
            <div className="flex w-full gap-3 bg-white/50 backdrop-blur p-2">
              {/* 소명확인서 탭 */}
              <button
                onClick={() => setActiveTab("absence")}
                className={`group relative flex-1 px-6 py-4 rounded-xl text-lg font-medium 
                         transition-all duration-300 
                         ${
                           activeTab === "absence"
                             ? "bg-[#3396f4] text-white shadow-lg shadow-blue-200/50"
                             : "text-gray-700 hover:bg-[#3396f4]/10"
                         }`}
              >
                소명확인서
                {activeTab !== "absence" && (
                  <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#3396f4]/20" />
                )}
              </button>

              {/* 변경요청서 탭 */}
              <button
                onClick={() => setActiveTab("change")}
                className={`group relative flex-1 px-6 py-4 rounded-xl text-lg font-medium 
                         transition-all duration-300
                         ${
                           activeTab === "change"
                             ? "bg-[#3396f4] text-white shadow-lg shadow-blue-200/50"
                             : "text-gray-700 hover:bg-[#3396f4]/10"
                         }`}
              >
                변경요청서
                {activeTab !== "change" && (
                  <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#3396f4]/20" />
                )}
              </button>
            </div>
          </div>

          {/* 폼 컨텐츠 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "absence" ? (
                <AbsenceForm />
              ) : (
                <AttendanceChangeForm />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            © 2025 SSAFY. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AttendancePage;
