import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* ================= Desktop Sidebar ================= */}

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* ================= Mobile Sidebar ================= */}

      <AnimatePresence>

        {mobileOpen && (

          <>
            {/* Overlay */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Drawer */}

            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: .3 }}
              className="fixed left-0 top-0 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.div>

          </>

        )}

      </AnimatePresence>

      {/* ================= Main Area ================= */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* Navbar */}

        <Navbar
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content */}

        <main className="flex-1 overflow-y-auto p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
}