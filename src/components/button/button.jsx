function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-deep",
    dark: "bg-dark text-white hover:bg-[#174d61]",
    outline:
      "bg-surface text-text border border-border hover:border-primary hover:text-primary",
  }

  const sizes = {
    sm: "min-h-10 px-[15px] text-xs rounded-[10px]",
    md: "min-h-[49px] px-[22px] text-[13px] rounded-xl",
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2.5
        border border-transparent
        font-extrabold whitespace-nowrap
        transition-all duration-250
        hover:-translate-y-[3px]
        active:translate-y-0 active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button