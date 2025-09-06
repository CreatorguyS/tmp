import { Outlet } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const AuthLayout = () => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          html, body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
          }
          .custom-shadow {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          }
        `}
      </style>

      <div className="flex min-h-screen bg-gray-950 text-white">
        {/* Left column: Authentication Form */}
        <div className="flex-1 flex flex-col justify-start items-center p-8 sm:p-10">
          {/* Form Container */}
          <div className="w-full max-w-sm">
            <h2 className="text-4xl font-semibold mb-2">Welcome!</h2>
            <p className="text-gray-400 mb-8">
              Log in to HealthSpectrum to continue.
            </p>

            {/* Social Logins */}
            <div className="space-y-4 mb-6">
              <button 
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/google`}
                className="w-full flex items-center gap-2 justify-center p-3 border border-gray-700 rounded-lg custom-shadow hover:bg-gray-800 transition-colors"
              >
                <FcGoogle />
                <span>Log in with Google</span>
              </button>
              <button 
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/github`}
                className="w-full flex items-center justify-center p-3 gap-2 border border-gray-700 rounded-lg custom-shadow hover:bg-gray-800 transition-colors"
              >
                <FaGithub />
                <span>Log in with Github</span>
              </button>
            </div>

            {/* OR separator */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <Outlet />
          </div>
        </div>

        {/* Right column: Marketing content with gradient background */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-800 via-indigo-900 to-gray-900 p-12">
          <div className="text-center max-w-lg">
            <h2 className="text-5xl font-extrabold leading-tight mb-4">
              Your Health, <br /> Our Focus.
            </h2>
            <p className="text-xl text-gray-300">
              HealthSpectrum provides intelligent solutions for a healthier you.
            </p>
            <div className="mt-8 inline-flex space-x-4">
              <div className="bg-white/10 text-white font-semibold py-2 px-4 rounded-full border border-white/20">
                100K+ Users
              </div>
              <div className="bg-white/10 text-white font-semibold py-2 px-4 rounded-full border border-white/20">
                AI-Powered
              </div>
            </div>
            {/* Abstract visual element */}
            <div className="mt-16">
              <svg
                className="w-full h-auto"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#4F46E5"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                />
                <path
                  d="M50 5C50 2.23858 47.7614 0 45 0V0C42.2386 0 40 2.23858 40 5V50C40 52.7614 42.2386 55 45 55V55C47.7614 55 50 52.7614 50 50V5Z"
                  fill="#818CF8"
                  transform="rotate(45 50 50)"
                />
                <path
                  d="M50 5C50 2.23858 47.7614 0 45 0V0C42.2386 0 40 2.23858 40 5V50C40 52.7614 42.2386 55 45 55V55C47.7614 55 50 52.7614 50 50V5Z"
                  fill="#818CF8"
                  transform="rotate(135 50 50)"
                />
                <path
                  d="M50 5C50 2.23858 47.7614 0 45 0V0C42.2386 0 40 2.23858 40 5V50C40 52.7614 42.2386 55 45 55V55C47.7614 55 50 52.7614 50 50V5Z"
                  fill="#818CF8"
                  transform="rotate(225 50 50)"
                />
                <path
                  d="M50 5C50 2.23858 47.7614 0 45 0V0C42.2386 0 40 2.23858 40 5V50C40 52.7614 42.2386 55 45 55V55C47.7614 55 50 52.7614 50 50V5Z"
                  fill="#818CF8"
                  transform="rotate(315 50 50)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AuthLayout;
