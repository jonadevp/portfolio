type ToastKind = "success" | "error" | "warning" | "info";
type Theme = "light" | "dark";
type ToastPalette = { fill: string; title: string; description: string };

const isDark = () => document.documentElement.classList.contains("dark");

const TOAST_COLORS: Record<ToastKind, Record<Theme, ToastPalette>> = {
  success: {
    light: { fill: "oklch(97.9% 0.021 166.113)", title: "text-green-700!", description: "text-emerald-600!" },
    dark: { fill: "black", title: "text-green-400!", description: "text-emerald-300!" },
  },
  error: {
    light: { fill: "oklch(94.8% 0.028 342.258)", title: "text-red-700!", description: "text-red-600!" },
    dark: { fill: "#171717", title: "text-red-400!", description: "text-red-300!" },
  },
  warning: {
    light: { fill: "oklch(98.7% 0.022 95.277)", title: "text-amber-700!", description: "text-amber-600!" },
    dark: { fill: "#171717", title: "text-amber-400!", description: "text-amber-300!" },
  },
  info: {
    light: { fill: "oklch(96.8% 0.007 247.896)", title: "text-sky-700!", description: "text-sky-600!" },
    dark: { fill: "#171717", title: "text-sky-400!", description: "text-sky-300!" },
  },
};

export const toastColors = (kind: ToastKind) => {
  const { fill, title, description } =
    TOAST_COLORS[kind][isDark() ? "dark" : "light"];
  return { fill, styles: { title, description } };
};