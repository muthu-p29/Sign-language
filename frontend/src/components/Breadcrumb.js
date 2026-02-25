import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ customPaths = null }) => {
  const location = useLocation();

  // Default path mapping
  const pathMap = {
    "/": "Home",
    "/translate": "Translate",
    "/learn": "Learn",
    "/about": "About",
    "/login": "Login",
    "/signup": "Sign Up",
  };

  // Use custom paths if provided, otherwise generate from current location
  let paths = customPaths;
  if (!paths) {
    const pathnames = location.pathname.split("/").filter((x) => x);
    paths = [
      { name: "Home", path: "/" },
      ...pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        return {
          name:
            pathMap[routeTo] || name.charAt(0).toUpperCase() + name.slice(1),
          path: routeTo,
        };
      }),
    ];
  }

  // Don't show breadcrumbs on home page unless there are custom paths
  if (location.pathname === "/" && !customPaths) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
      aria-label="Breadcrumb"
    >
      {paths.map((path, index) => (
        <div key={path.path} className="flex items-center space-x-2">
          {index === 0 && (
            <Home size={14} className="text-gray-500 dark:text-gray-500" />
          )}

          {index < paths.length - 1 ? (
            <Link
              to={path.path}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {path.name}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {path.name}
            </span>
          )}

          {index < paths.length - 1 && (
            <ChevronRight
              size={14}
              className="text-gray-400 dark:text-gray-600"
            />
          )}
        </div>
      ))}
    </motion.nav>
  );
};

export default Breadcrumb;
