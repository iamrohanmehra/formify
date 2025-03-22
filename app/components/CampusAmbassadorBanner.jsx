"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CampusAmbassadorBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto my-6"
    >
      <Link href="/campus-ambassador" className="block relative group">
        <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 transition-all duration-300 group-hover:shadow-lg group-hover:border-[#37404A]/30">
          <div className="relative w-full aspect-[16/9]">
            <Image
              src="/campus-ambassador.png"
              alt="Become a Campus Ambassador"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ objectPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#37404A]/80 to-transparent flex flex-col justify-end p-4 sm:p-6">
              <h3 className="text-white text-lg sm:text-xl font-medium mb-1">
                Become a Campus Ambassador
              </h3>
              <p className="text-white/90 text-sm">
                Represent Codekaro at your campus and earn rewards
              </p>
              <div className="mt-3 flex items-center">
                <span className="text-white text-xs sm:text-sm bg-[#37404A]/70 py-1 px-3 rounded-full inline-flex items-center gap-1">
                  Apply Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
