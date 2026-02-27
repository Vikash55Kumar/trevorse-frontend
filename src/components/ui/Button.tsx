export function Button({
  children,
  variant = "primary",
  onclick,
  className,
  type,
  ...props
}: any) {
  const base =
    "w-full py-2 rounded-sm font-medium disabled:cursor-not-allowed disabled:opacity-60";

  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "border";

  const onClick = props.onClick ?? onclick;

  return (
    <button
      type={type ?? "button"}
      className={`${base} ${styles} ${className ?? ""}`.trim()}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
