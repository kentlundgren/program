export const metadata = {
  title: 'Min Next.js App',
  description: 'Skapad med Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
} 