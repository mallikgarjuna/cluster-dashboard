import { Inter as Inter, Lusitana as Lusitana } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
});

export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
});
