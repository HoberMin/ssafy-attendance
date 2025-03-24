import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import AttendanceChangeForm from "./_components/AttendanceChangeForm";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Tab from "./_components/Tab";
import AttendanceConfirmForm from "./_components/AttendanceConfirmForm";

const AttendancePage = () => {
  const router = useRouter();
  const { tab: tabParam } = router.query;

  const isConfirmTab = tabParam !== "change";

  const handleTabChange = (isConfirm: boolean) => {
    const newTab = isConfirm ? "confirm" : "change";

    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: newTab },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (!tabParam && router.isReady) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: "confirm" },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [tabParam, router.isReady]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <Tab activeTab={isConfirmTab} setActiveTab={handleTabChange} />

          <AnimatePresence mode="wait">
            <motion.div
              key={isConfirmTab ? "confirm" : "change"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isConfirmTab ? (
                <AttendanceConfirmForm />
              ) : (
                <AttendanceChangeForm />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AttendancePage;
