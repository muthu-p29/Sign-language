import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const KeyboardShortcuts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle shortcuts when not typing in input fields
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
      ) {
        return;
      }

      // Check for keyboard shortcuts
      if (event.altKey) {
        switch (event.key) {
          case "h":
          case "H":
            event.preventDefault();
            navigate("/");
            break;
          case "t":
          case "T":
            event.preventDefault();
            if (isAuthenticated) {
              navigate("/translate");
            } else {
              navigate("/login");
            }
            break;
          case "l":
          case "L":
            event.preventDefault();
            navigate("/learn");
            break;
          case "a":
          case "A":
            event.preventDefault();
            navigate("/about");
            break;
          case "Escape":
            event.preventDefault();
            // Go back or to home if can't go back
            if (window.history.length > 1 && location.pathname !== "/") {
              navigate(-1);
            } else {
              navigate("/");
            }
            break;
          default:
            break;
        }
      }

      // ESC key to go back without Alt
      if (event.key === "Escape" && !event.altKey) {
        if (location.pathname !== "/") {
          event.preventDefault();
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/");
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate, location, isAuthenticated]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;
