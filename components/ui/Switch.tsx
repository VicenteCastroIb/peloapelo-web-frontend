"use client";

// Interruptor on/off (recordatorios de /profile). El track visible es
// 46x26px por diseno, pero el objetivo tactil minimo del sistema es 44px
// (ver docs/design del rediseno /progress) -- el padding de 9px en el
// boton exterior amplia el area clickeable a 44px de alto sin cambiar el
// tamano visual del track interior.
export default function Switch({
  checked,
  onChange,
  label,
  className = "",
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`flex shrink-0 items-center justify-center rounded-pill border-none bg-transparent p-[9px] ${className}`}
    >
      <span
        aria-hidden
        className={`relative block h-[26px] w-[46px] rounded-pill border border-navy/10 transition-colors duration-200 ease-out motion-reduce:transition-none ${
          checked ? "bg-accent" : "bg-navy/15"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-pill bg-white shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
