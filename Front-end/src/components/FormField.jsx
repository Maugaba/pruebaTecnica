export default function FormField({
  label,
  name,
  error,
  type = "text",
  as = "input",
  children,
  ...rest
}) {
  const Component = as;
  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <Component
        id={name}
        name={name}
        type={type}
        className={`input ${error ? "input-error" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      >
        {children}
      </Component>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
