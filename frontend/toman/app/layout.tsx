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
        <ReactQueryWrapper>
          <div>{children}</div>
          <Toaster position="top-right" />
        </ReactQueryWrapper>
      </body>
    </html>
  );
}
