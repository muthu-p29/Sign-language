import { motion } from "framer-motion";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useAuthStore } from "../store/authStore";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const [showPassword, setShowPassword] = useState({
    password1: false,
    password2: false,
  });
  const [errors, setErrors] = useState({});

  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      isValid: minLength && hasUpper && hasLower && hasNumber,
    };
  };

  const passwordValidation = validatePassword(formData.password1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password1) {
      newErrors.password1 = "Password is required";
    } else if (!passwordValidation.isValid) {
      newErrors.password1 = "Password does not meet requirements";
    }

    if (!formData.password2) {
      newErrors.password2 = "Please confirm your password";
    } else if (formData.password1 !== formData.password2) {
      newErrors.password2 = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await signup(
      formData.username,
      formData.password1,
      formData.password2
    );
    if (result.success) {
      navigate("/translate");
    } else {
      setErrors({ general: result.error });
    }
  };

  const PasswordRequirement = ({ met, text }) => (
    <div
      className={`flex items-center space-x-2 text-xs ${met ? "text-green-500" : "text-gray-600 dark:text-gray-400"
        }`}
    >
      {met ? <CheckCircle size={12} /> : <XCircle size={12} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button - Fixed position */}
      <div className="fixed top-4 left-4 z-50">
        <BackButton
          variant="floating"
          to="/"
          text="Back to Home"
          showHomeOption={false}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
          >
            <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join Sign Translation and start bridging communication gaps
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
            >
              <p className="text-red-500 text-sm">{errors.general}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.username ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password1"
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password1"
                  name="password1"
                  type={showPassword.password1 ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password1}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.password1 ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password1")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {showPassword.password1 ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password1 && (
                <div className="mt-2 space-y-1">
                  <PasswordRequirement
                    met={passwordValidation.minLength}
                    text="At least 8 characters"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasUpper}
                    text="One uppercase letter"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasLower}
                    text="One lowercase letter"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasNumber}
                    text="One number"
                  />
                </div>
              )}

              {errors.password1 && (
                <p className="mt-1 text-sm text-red-500">{errors.password1}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="password2"
                  name="password2"
                  type={showPassword.password2 ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password2}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${errors.password2 ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password2")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {showPassword.password2 ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {formData.password2 && (
                <div className="mt-2">
                  <PasswordRequirement
                    met={formData.password1 === formData.password2}
                    text="Passwords match"
                  />
                </div>
              )}

              {errors.password2 && (
                <p className="mt-1 text-sm text-red-500">{errors.password2}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={
              isLoading ||
              !passwordValidation.isValid ||
              formData.password1 !== formData.password2
            }
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Create account</span>
              </>
            )}
          </motion.button>

          {/* Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
            <Link
              to="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Signup;
