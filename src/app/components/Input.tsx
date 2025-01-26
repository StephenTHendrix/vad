import React from "react";

interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  defaultValue?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  onBlur,
  autoFocus,
  defaultValue,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-4 py-2 rounded-lg border border-gray-300 ${className}`}
      onBlur={onBlur}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
    />
  );
};
