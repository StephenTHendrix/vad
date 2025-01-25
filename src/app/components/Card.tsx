export function Card({ children, className, ...props }) {
    return (
      <div
        className={`rounded-lg shadow-md border bg-white ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className, ...props }) {
    return (
      <div className={`p-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
  