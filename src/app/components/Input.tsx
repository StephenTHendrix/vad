export function Input({ className, ...props }) {
    return (
      <input
        className={`px-4 py-2 rounded-lg border border-gray-300 ${className}`}
        {...props}
      />
    );
  }
  