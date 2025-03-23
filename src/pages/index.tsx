import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AttendanceChangeForm from "./components/changeForm";
import { Github, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import AbsenceForm from "./components/ConfirmForm/index";

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState("absence");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-24 py-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3396f4] to-blue-500 bg-clip-text text-transparent mb-4">
              SSAFY 출결 생성기
            </h1>
            <div className="flex items-center gap-3 absolute right-[30px]">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          "https://github.com/ssafy-attendance-document/ssafy-attendance/issues",
                          "_blank"
                        )
                      }
                      className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                    >
                      <Bug className="h-4 w-4" />
                      <span className="text-sm font-medium">Issue</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Issue 생성하기</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          "https://github.com/ssafy-attendance-document/ssafy-attendance",
                          "_blank"
                        )
                      }
                      className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                    >
                      <Github className="h-4 w-4" />
                      <span className="text-sm font-medium">GitHub</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>GitHub로 이동</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8 flex-1">
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
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/HoberMin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="text-sm font-medium">HoberMin</span>
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="https://github.com/yejinleee"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="text-sm font-medium">yejinleee</span>
              </a>
            </div>
            <div className="text-center text-sm text-gray-500">
              © 2025 HoberMin. All rights reserved.
            </div>
            <a
              href="https://hits.seeyoufarm.com"
              style={{
                display: "flex",
                justifyContent: "center",
                margin: " 0 0 20px",
              }}
            >
              <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fssafy-attendance.vercel.app&count_bg=%233396F4&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AttendancePage;
