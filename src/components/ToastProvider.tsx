import { Toaster } from "sileo";

export default function ToastProvider() {
  return <Toaster position="top-center" offset={{ top: 80 }} />;
}