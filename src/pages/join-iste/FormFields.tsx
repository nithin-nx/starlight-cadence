import { useState, useEffect } from "react";
import { ChevronDown, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- INPUT ---------------- */

type InputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
};

export const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = true
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-gray-800/30 backdrop-blur-sm px-4 py-3 text-white outline-none transition-all duration-300 ${
            error 
              ? "border-red-500/50 focus:border-red-500" 
              : "border-gray-600/30 focus:border-primary"
          } ${isFocused ? "ring-1 ring-primary/20" : ""}`}
        />
        
        {/* Password visibility toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {/* Date picker icon */}
        {type === "date" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-1 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- SELECT ---------------- */

type SelectProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
};

export const FormSelect = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
  required = true
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedLabel = value || placeholder || `Select ${label.toLowerCase()}`;

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (open) setOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <div className="mb-4 relative">
      <label className="block mb-2 text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Trigger */}
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full flex items-center justify-between rounded-lg border bg-gray-800/30 backdrop-blur-sm px-4 py-3 text-left transition-all duration-300 ${
          error 
            ? "border-red-500/50 focus:border-red-500" 
            : "border-gray-600/30 focus:border-primary"
        } ${isFocused ? "ring-1 ring-primary/20" : ""}`}
        whileTap={{ scale: 0.98 }}
      >
        <span className={value ? "text-white" : "text-gray-400"}>
          {selectedLabel}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full rounded-lg border border-gray-700/50 bg-gray-900 backdrop-blur-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    value === option
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-gray-300 hover:bg-gray-800/50"
                  }`}
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-1 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected value indicator */}
      {value && (
        <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Selected: {value}</span>
        </div>
      )}
    </div>
  );
};

/* ---------------- TEXTAREA ---------------- */

type TextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
};

export const FormTextarea = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  required = true
}: TextareaProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full rounded-lg border bg-gray-800/30 backdrop-blur-sm px-4 py-3 text-white outline-none transition-all duration-300 resize-none ${
            error 
              ? "border-red-500/50 focus:border-red-500" 
              : "border-gray-600/30 focus:border-primary"
          } ${isFocused ? "ring-1 ring-primary/20" : ""}`}
        />
        
        {/* Character counter */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {value.length}/500
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-1 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- CHECKBOX ---------------- */

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  description?: string;
};

export const FormCheckbox = ({
  label,
  checked,
  onChange,
  error,
  description
}: CheckboxProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-start gap-3">
        <div className="relative mt-1">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="peer sr-only"
            id={`checkbox-${label.replace(/\s+/g, '-')}`}
          />
          <label
            htmlFor={`checkbox-${label.replace(/\s+/g, '-')}`}
            className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
              error 
                ? "border-red-500/50" 
                : "border-gray-600 peer-checked:border-primary peer-checked:bg-primary"
            }`}
          >
            {checked && (
              <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </label>
        </div>
        
        <div className="flex-1">
          <label 
            htmlFor={`checkbox-${label.replace(/\s+/g, '-')}`}
            className="text-sm font-medium text-gray-300 cursor-pointer select-none"
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-1 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};