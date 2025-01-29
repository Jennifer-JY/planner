import "./globals.css";
import HeadBar from "./ui/components/headBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen w-screen flex flex-col relative">
        <HeadBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
