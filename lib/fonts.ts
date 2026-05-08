import {
  DM_Sans,
  JetBrains_Mono,
  Manrope,
} from "next/font/google";

export const bodySans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const displaySans = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
});

export const codeMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
