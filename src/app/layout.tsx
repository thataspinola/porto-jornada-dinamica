import '../styles/global.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="/etc.clientlibs/porto/clientlibs/clientlib-theme/resources/favicon.ico" />
      </head>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
