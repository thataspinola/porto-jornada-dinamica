# Providers

Manter providers pequenos, com responsabilidades explícitas. Instanciar o QueryClient com estado por provider para manter sua identidade durante re-renders e isolar os dados. Não importar segredos ou código de transporte de servidor. Specs ficam em `test/src/contexts/`.
