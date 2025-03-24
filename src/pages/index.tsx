import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AttendanceChangeForm from "./_components/AttendanceChangeForm";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Tab from "./_components/Tab";
import AttendanceConfirmForm from "./_components/AttendanceConfirmForm";

const AttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<boolean>(true);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab ? <AttendanceConfirmForm /> : <AttendanceChangeForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AttendancePage;
