🛒 DeepSurvey Frontend — Loja Delivery (React.js)

Este é o frontend da plataforma DeepSurvey Suplementos.
O objetivo é ser rápido, simples e altamente personalizável via painel administrativo.

🚀 Tecnologias Utilizadas

React.js

React Router DOM

Axios

Context API

CSS puro com suporte a temas

Fetch + ViaCEP API

🎨 Funcionalidades
🏬 Cliente (usuário comum)

Página inicial com produtos por categoria

Página de produto com galeria de imagens

Busca

Ofertas

Categorias

Sacola persistente (localStorage + sessionId)

Checkout completo:

Endereço

CEP (Busca automática)

Pagamento

Troco

Cálculo de entrega

Geração automática da mensagem WhatsApp

🔧 Painel Admin (somente ROLE_ADMIN)

Gerenciamento de produtos

CRUD de categorias

CRUD de fretes e regiões

Configurações da loja:

Nome, subtítulo

Logo

Tema (claro, escuro, glass)

Cores personalizadas

Imagem de fundo

WhatsApp

E-mail

Status da loja

Pedido mínimo

⚙️ Como Rodar o Projeto
1️⃣ Instalar Dependências
npm install

2️⃣ Configurar variável da API (opcional)

Crie .env:

REACT_APP_API_URL=http://localhost:8083

3️⃣ Rodar o servidor de desenvolvimento
npm start


App disponível em:

http://localhost:3000

🧩 Estrutura do Projeto
src/
│
├── pages/                (Home, ProductDetails, Checkout, Admin, etc.)
├── components/           (Navbar, Footer, ProductCard...)
├── context/              (StoreConfigContext)
├── hooks/                (useAuth)
├── api.js                (Axios configurado com token + sessionId)
└── App.js                (rotas do app)

🔐 Autenticação

O login retorna um JWT contendo:

{
  "sub": "usuario",
  "roles": ["ROLE_ADMIN"]
}


O frontend armazena o token no localStorage.

Admin é automaticamente detectado por:

roles.includes("ROLE_ADMIN")

🎨 Personalização de Tema

Através do StoreConfigContext e variáveis CSS:

--title-color
--product-text-color
--page-text-color
--bg-image
--theme-color


O painel admin altera tudo dinamicamente.

📦 Build de Produção
npm run build

🔗 Comunicação com o Backend

Configurada em:

src/api.js


Inclui:

Token automático

X-Session-Id

Base URL configurável

Considerações Finais: Esse projeto teve continuidade porem por segurança da loja vou postar abertamento só até aqui.
<img width="1920" height="1004" alt="image" src="https://github.com/user-attachments/assets/417b6d7a-05ad-4463-8222-992f5833b540" />
<img width="1904" height="1002" alt="image" src="https://github.com/user-attachments/assets/1adbf8f7-5a9c-425f-8415-30d778024df8" />
<img width="1906" height="1002" alt="image" src="https://github.com/user-attachments/assets/e1b3de68-2dfb-472f-85ff-fed502b99803" />
Toda loja é editavel de forma simples sem necessidade de mexer em codigos.


📄 Licença

MIT License.
