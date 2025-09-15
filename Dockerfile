# Usamos a imagem oficial do Playwright que já vem com navegadores e dependências
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm ci

# Copia todo o resto do código do projeto
COPY . .

# Comando padrão que será executado ao rodar o container
# Roda o build da extensão e depois os testes E2E
CMD ["npm", "test"]