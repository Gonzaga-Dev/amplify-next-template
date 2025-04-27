# [Data&AI] Monthly Checkpoint - Sorteio

Aplicativo web desenvolvido para facilitar a realização de sorteios online. Integra cadastro de participantes e o sorteio na mesma ferramenta.


---


## 🔧 Tecnologias Utilizadas

- **Next.js** (App Router)
- **React** (Componentes client-side)
- **AWS Amplify** (DataStore para persistência e hospedagem)
- **AWS Amplify Hosting** (Deploy automático)
- **Quantum Random Number Generator (QRNG)** (Sorteio com aleatoriedade verdadeira via ANU)


---


## 🔍 Funcionalidades

- Cadastro de participantes através de campo de texto + botão "Participar"
- Exibição responsiva da lista de participantes em ordem de chegada
- Utiliza gerador quântico de números aleatórios para garantir sorteio justo
- Nome sorteado é automaticamente removido da lista após o sorteio
- Reset automático da lista de participantes 2 horas após o último sorteio
- Painel Administrativo (/admin) para limpeza manual de todos os participantes
- Página 100% responsiva para desktop e dispositivos móveis


---


## 📊 Principais Features

| Recurso | Status |
|:---|:---|
| Cadastro dinâmico de participantes | ✅ Implementado |
| Sorteio quântico de participantes | ✅ Implementado |
| Exclusão automática do vencedor | ✅ Implementado |
| Reset automático da lista após 2 horas | ✅ Implementado |
| Página administrativa para limpeza manual | ✅ Implementado |
| Design responsivo (mobile-first) | ✅ Implementado |


---


## 🚀 Melhorias Futuras

- **Autenticação** para acesso restrito à página /admin
- **Suporte a multiplos sorteios simultâneos** com especificação prévia dos itens a serem sorteados
- **Histórico de sorteios realizados** (armazenar vencedores e prêmios anteriores)
- **Customização visual** (cores e logo da empresa)


---


## 💼 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
