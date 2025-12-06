import { Suspense } from 'react';
import { Toaster } from 'sonner';
import ReactQueryWrapper from '../_shared/components/wrappers/ReactQueryWrapper';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <>
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<div className="p-4"></div>}>
              <ReactQueryWrapper>
                <>{children}</>
                <Toaster position="top-right" />
              </ReactQueryWrapper>
            </Suspense>
          </div>
        </>
      </body>
    </html>
  );
}
