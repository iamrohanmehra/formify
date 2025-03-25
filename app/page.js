"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-karla flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 py-3 px-4 sm:py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-[#37404A] text-xl font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Codekaro Forms
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-[#37404A] px-4 sm:px-6 py-3 sm:py-4">
              <h1 className="text-[20px] sm:text-[24px] font-[500] text-white">
                Codekaro Forms
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm mt-1">
                Create and manage online forms easily
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col items-center">
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#37404A] mb-3 sm:mb-4">
                    Welcome to Codekaro Forms
                  </h2>
                  <p className="text-[#37404AB3] text-sm sm:text-base mb-2">
                    A powerful online form building platform
                  </p>
                  <p className="text-[#37404AB3] text-xs sm:text-sm">
                    If you have a specific form URL, you can navigate directly
                    to it to fill and submit the form.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 sm:py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Codekaro Forms. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
