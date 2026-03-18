import Image from "next/image";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const src =
    variant === "light"
      ? "/assets/images/logo/logo-branca.svg"
      : "/assets/images/logo/logo-escura.svg";

  return (
    <Image
      src={src}
      alt="Jarline Vieira"
      width={variant === "light" ? 140 : 196}
      height={variant === "light" ? 22 : 32}
      className={className}
      priority
    />
  );
}
