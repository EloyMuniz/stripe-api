# API de Integração com Stripe

Esta API foi desenvolvida para integrar a plataforma de pagamentos Stripe ao seu aplicativo. Ela permite processar pagamentos bem-sucedidos, atualizar o tipo de plano e status de membro de um usuário no banco de dados, e enviar e-mails de confirmação de compra aos clientes.
Além disso, está em planejamento a implementação de uma lógica para criação de usuários no banco de dados a partir do cadastro realizado pelo Stripe.
## Funcionalidades

- Processamento de pagamentos bem-sucedidos.
- Atualização do tipo de plano e status de membro de um usuário no banco de dados.
- Envio de e-mails de confirmação de compra aos clientes.

## Tecnologias Utilizadas

- Stripe API
- Nodemailer para envio de e-mails
- Bcrypt para criptografia de senhas
- Dotenv para gerenciamento de variáveis de ambiente
- Express para configuração do servidor
- Prisma (não mostrado no código, mas pode ser utilizado para interação com banco de dados)

## Configuração

Antes de usar a API, é necessário configurar as seguintes variáveis de ambiente no arquivo `.env`:

- `STRIPE` - Chave da API do Stripe
- `ENDPOINT_SECRETPROD` - Segredo do endpoint para ambiente de produção
- `ENDPOINT_SECRETDEV` - Segredo do endpoint para ambiente de desenvolvimento
- `EMAIL` - Endereço de e-mail para envio de notificações
- `PASSWORD` - Senha do e-mail para envio de notificações

Lembre-se de proteger e não compartilhar informações sensíveis, como segredos e senhas, diretamente no código.

## Utilização

A API pode ser chamada através de webhooks do Stripe. Ela está configurada para tratar o evento `payment_intent.succeeded` para processar os pagamentos e realizar as ações correspondentes.

Para qualquer outra funcionalidade específica, consulte o código fonte para mais detalhes.

---
