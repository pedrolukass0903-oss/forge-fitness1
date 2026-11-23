# FORGE Fitness — projeto AV2

Projeto dividido em frontend, backend serverless e banco de dados Supabase.

## Estrutura
- `frontend/`: HTML, CSS e JavaScript do site.
- `backend/`: funções API serverless para consultar o Supabase.
- `supabase.sql`: criação das tabelas, políticas RLS e dados demonstrativos.

## 1. Banco Supabase
1. Crie um projeto no Supabase.
2. Abra SQL Editor > New query.
3. Execute o arquivo `supabase.sql`.
4. Copie a Project URL e a chave pública anon/publishable em Project Settings > API (ou Connect).

## 2. Publicar backend na Vercel
1. Envie a pasta do projeto para um repositório GitHub.
2. Na Vercel, importe o repositório.
3. Configure Root Directory como `backend`.
4. Em Settings > Environment Variables, adicione:
   - `SUPABASE_URL` = Project URL do Supabase.
   - `SUPABASE_ANON_KEY` = chave pública anon/publishable.
   - `ALLOWED_ORIGIN` = URL do frontend depois de publicar (ex.: https://seu-site.vercel.app).
5. Faça Deploy. Os endpoints serão `/api/trainings`, `/api/coaches`, `/api/schedules` e `/api/locations`.

## 3. Publicar frontend na Vercel
1. Importe o mesmo repositório como um segundo projeto Vercel.
2. Configure Root Directory como `frontend`.
3. Antes do deploy, abra `frontend/js/script.js` e troque `https://SUA-URL-BACKEND.vercel.app` pela URL real do backend.
4. Faça Deploy.

## 4. Teste
Abra no navegador:
- `https://SUA-URL-BACKEND.vercel.app/api/trainings`
- `https://SUA-URL-BACKEND.vercel.app/api/coaches`
- `https://SUA-URL-BACKEND.vercel.app/api/schedules`
- `https://SUA-URL-BACKEND.vercel.app/api/locations`

Cada endpoint deve retornar JSON. Depois abra a URL do frontend e confirme que as quatro áreas carregam.

## Segurança
- A API usa somente a chave pública Supabase e políticas RLS de leitura.
- Não coloque `service_role` ou secret key no frontend nem no repositório.
- O exemplo permite apenas GET/OPTIONS; não há rotas de escrita.
- Os dados de professores, contato, endereço e horários são fictícios e devem ser substituídos pelos dados verdadeiros antes de apresentação/publicação.
- Configure `ALLOWED_ORIGIN` com o domínio real do frontend após o deploy.
