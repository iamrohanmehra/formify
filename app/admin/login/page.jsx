"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

// List of authorized admin emails
const AUTHORIZED_ADMINS = [
  "rohanmehra224466@gmail.com",
  "ashish.efslon@gmail.com",
];

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [_user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClientComponentClient({
    options: {
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
      },
    },
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Verify if the user is authorized
        if (AUTHORIZED_ADMINS.includes(session.user.email)) {
          router.push("/admin");
        } else {
          setError("You are not authorized to access the admin dashboard.");
          // Sign out unauthorized users
          await supabase.auth.signOut();
          setUser(null);
        }
      }
    };

    checkUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session.user);
        // Verify if the user is authorized
        if (AUTHORIZED_ADMINS.includes(session.user.email)) {
          router.push("/admin");
        } else {
          setError("You are not authorized to access the admin dashboard.");
          // Sign out unauthorized users
          await supabase.auth.signOut();
          setUser(null);
        }
      }
      if (event === "SIGNED_OUT") {
        setUser(null);
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current URL origin for the redirect
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/api/auth/callback`
          : `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setError(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-karla flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6">
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
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-[#37404A] px-6 py-4">
              <h1 className="text-[24px] font-[500] text-white">Admin Login</h1>
              <p className="text-gray-300 text-sm mt-1">
                Access to form submissions and settings
              </p>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-sm">
                  <div className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-500 mr-2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center">
                <p className="text-[16px] text-[#37404AB3] text-center mb-6">
                  Sign in with your Google account to access the admin
                  dashboard.
                </p>

                <Button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="bg-[#37404A] hover:bg-[#37404A]/90 text-white rounded-md w-full py-6 flex items-center justify-center gap-3 transition-colors duration-200 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="text-[16px] font-medium">
                        Sign in with Google
                      </span>
                    </>
                  )}
                </Button>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Only authorized administrators can access the dashboard.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Contact your system administrator if you need access.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[#37404A]/80 hover:text-[#37404A] text-sm flex items-center justify-center"
            >
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
                className="mr-1"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Return to main site
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Codekaro Forms Admin. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
