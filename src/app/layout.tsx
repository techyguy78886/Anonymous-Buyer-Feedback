import type { Metadata } from "next";
import "../app/globals.css";
import ClientLayout from "../app/ClientLayout";

export const metadata: Metadata = {
  title: "Anonymous Buyer Feedback (ABF) | Midnight Network ZK dApp",
  description: "Privacy-preserving zero-knowledge product and merchant review/feedback dApp on Midnight Network.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
