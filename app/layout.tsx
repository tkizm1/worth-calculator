import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "worth-calculator",
  description: "worth-calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <div className="pb-8"></div>
        <footer className="w-full py-4 border-t bg-white/90 dark:bg-gray-900/80 dark:border-gray-800/50">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">作者的其他实用工具 👇</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a 
                href="https://citycompare.zippland.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto max-w-xs flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm hover:shadow"
              >
                <div className="flex-shrink-0 bg-gradient-to-br from-emerald-500 to-blue-500 dark:from-emerald-600 dark:to-blue-600 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-0.5">城市生活成本对比器</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">国内主要城市，一起拉通对比，分别要赚多少钱才能保持同样生活水平？</div>
                </div>
              </a>
              <a 
                href="https://snapsolver.zippland.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto max-w-xs flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm hover:shadow"
              >
                <div className="flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-0.5">AI笔试题解答神器</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">笔试测评工具，一键截图识别，AI自动给出详细解答</div>
                </div>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
