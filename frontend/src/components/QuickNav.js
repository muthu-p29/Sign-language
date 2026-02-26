import { AnimatePresence, motion } from "framer-motion";
import { Home, LogIn, Mic, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const QuickNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuthStore();

  const navigation = [
    { name: "Home", href: "/", icon: Home, desc: "Back to homepage" },
    {
      name: "Translate",
      href: isAuthenticated ? "/translate" : "/login",
      icon: Mic,
      desc: isAuthenticated
        ? "Convert speech to sign language"
        : "Login to translate",
    },
    /*
        {
          name: "Learn",
          href: "/learn",
          icon: BookOpen,
          desc: "Learn sign language alphabet",
        },
    */
    //    { name: "About", href: "/about", icon: Info, desc: "About Sign Translation" },
    ...(!isAuthenticated
      ? [
        {
          name: "Login",
          href: "/login",
          icon: LogIn,
          desc: "Sign in to your account",
        },
      ]
      : []),
  ];

  const filteredNavigation = navigation.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + K to open quick nav
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleNavClick = () => {
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-1 max-w-lg w-full"
          >
            {/* Search Input */}
            <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
              <Search
                size={20}
                className="text-gray-400 dark:text-gray-500 mr-3"
              />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                autoFocus
              />
              <button
                onClick={handleClose}
                className="ml-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Options */}
            <div className="py-2 max-h-80 overflow-y-auto">
              {filteredNavigation.length > 0 ? (
                filteredNavigation.map((item, index) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleNavClick}
                    className="flex items-center px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg mx-1"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                      <item.icon
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                  No pages found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <span>Use ↑↓ to navigate</span>
              <span>
                Press{" "}
                <kbd className="px-1 bg-gray-100 dark:bg-gray-700 rounded">
                  ESC
                </kbd>{" "}
                to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickNav;
