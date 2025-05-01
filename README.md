# [Data&AI] Monthly Checkpoint - Sorteio

Aplicativo de sorteio online construído com **Next.js** e hospedado no **AWS Amplify**, que combina cadastro de participantes e execução de sorteios com aleatoriedade verdadeira via QRNG.

## 🚀 Tecnologias
- **Next.js** (App Router)  
- **React** (Client-side)  
- **AWS Amplify DataStore** (persistência e sincronização)  
- **AWS Amplify Hosting** (deploy automático)  
- **QRNG** (ANU API, fallback para `Math.random()`)

## ✨ Funcionalidades Atuais
- Cadastro e listagem responsiva de participantes em ordem de inscrição  
- Aleatoriedade quântica para sorteios justos  
- Suporte a múltiplos sorteios com a mesma configuração  
- Página `/admin` para limpeza manual de participantes  
- Design mobile-first e responsivo

## ⚙️ Como Executar Localmente
```bash
# Clone o repositório
git clone git@github.com:Gonzaga-Dev/sorteio-amplify.git

# Instale dependências
npm install

# Configure o Amplify
amplify init
amplify push

# Inicie em modo de desenvolvimento
npm run dev
```  
Acesse `http://localhost:3000` para usar o sistema de sorteios.

## 🛣️ Roadmap
- Histórico de sorteios
- Sistema anti-fraude (Detecção de múltiplos nomes com mesmo IP)
- Customização de tema e identidade visual  
- Métricas de participação e frequência de sorteios na página /admin


## 💼 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
