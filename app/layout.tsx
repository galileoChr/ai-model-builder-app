import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/navigation";
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Model Builder - Create AI Models with Natural Language',
  description: 'Build and train AI models using natural language prompts. No coding required.',
  authors: [{ name: 'Christophe Manzi', url: 'https://github.com/ishimweChris' }],
  creator: 'Christophe Manzi',
  publisher: 'Christophe Manzi',
  keywords: ['AI', 'Machine Learning', 'Model Building', 'Natural Language'],
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  copyright: 'Copyright © 2025 Christophe Manzi. All rights reserved.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}