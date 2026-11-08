# Carteira

App de gestão de clientes e CRM para barbearia. Arquivo único (`index.html`), HTML, CSS e JavaScript puros, sem build e sem dependências. Os dados ficam salvos no navegador (`localStorage`).

## O que tem

- **Dashboard**: retornos de hoje, atrasados e próximos 7 dias, total de clientes, assinantes e qualificados.
- **Clientes**: tabela com abas Todos, Avulsos e Assinantes, busca por nome, telefone, Instagram ou e-mail e painel de filtros (qualificação, frequência, tipo, visagismo).
- **Ficha do cliente**: informações, perfil, observações em formato de chat com data, histórico de atendimentos, WhatsApp e link do Instagram.
- **Retornos**: lista de quem precisa voltar, por frequência. Assinantes e clientes sem potencial não entram.
- **CRM**: quadro estilo Trello (Teve interesse, Em conversa, Follow-up, Concluído, Desistência), com follow-up, valor estimado e vínculo com cliente já cadastrado.
- **Registrar atendimento**: busca o cliente pelo nome ou pelo final do telefone, marca o que foi feito (corte, barba etc.) e atualiza o próximo retorno.
- **Configurações**: bloqueio por PIN, lista de serviços, importar CSV, exportar CSV e backup completo.

## Como usar

Abra o `index.html` no navegador. Para publicar de graça com o GitHub Pages: Settings > Pages > Deploy from a branch > `main` / `(root)`.

O plano gratuito do GitHub só publica Pages de repositórios públicos. O repositório contém apenas o código. Os dados dos clientes ficam no navegador de quem usa e nunca vão para o repositório.

## Dados e backup

- Tudo fica no `localStorage` do navegador, na chave `carteira`. Celular e computador não sincronizam entre si.
- Limpar os dados do navegador apaga tudo. Use **Configurações > Backup completo (JSON)** com frequência e **Restaurar backup** para voltar.
- Nunca suba backups ou CSVs de clientes para o GitHub.
- O PIN só esconde a tela. Não é segurança de verdade, porque os dados continuam no navegador.

## Para quem for mexer no código

O estado inteiro é o objeto `S`:

```js
S = {
  clients: [{ id, name, phone, instagram, email, qual, tipo, visa, produto,
              freq, last, days, services: [], log: [{id,date,text}],
              visits: [{date, service, svcs, note}] }],
  crm: [{ id, name, clientId, phone, tipo, item, value, stage, sub, lastfu, notes }],
  cfg: { pin, serv }
}
```

- `qual`: `qualificado`, `nao_avaliado` ou `nao_qualificado` (aparece como "Sem potencial").
- `tipo`: `avulso` ou `assinante`.
- Toda alteração termina em `save()` seguido de `render()`.
- Os botões usam `onclick` direto no HTML. Nesses atributos, não use variáveis globais chamadas `form`, `name` ou `type`, porque o navegador as confunde com propriedades do próprio campo. Por isso o formulário usa `FM`.
- Não use `alert`, `confirm` ou `prompt` do navegador. Use `toast()` e `askC()`.
