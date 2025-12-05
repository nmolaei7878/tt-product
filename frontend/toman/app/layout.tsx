import ReactQueryWrapper from '../_shared/components/wrappers/ReactQueryWrapper';

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
        </ReactQueryWrapper>
      </body>
    </html>
  );
}
