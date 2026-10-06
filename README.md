# WILKER Planner

Planejador pessoal **local + web** para tarefas, rotina, estudos, finanças e investimentos.

## Versão estável

**WILKER Planner 1.0.0**

A aplicação possui duas formas de uso:

- **Web:** publicada pelo GitHub Pages, sem Node.js e sem precisar iniciar servidor.
- **Local:** executada pelo server.js, com armazenamento local em arquivo JSON.

## Acesso web

Após habilitar o GitHub Pages no repositório, a aplicação fica disponível em:

https://pedrowilker.github.io/wilker-planner/

O deploy é automático a cada push para main usando GitHub Actions.

### Habilitar pela primeira vez

No GitHub:

1. Abra o repositório Pedrowilker/wilker-planner.
2. Entre em Settings → Pages.
3. Em Build and deployment → Source, selecione GitHub Actions.
4. Aguarde a execução do workflow "Deploy WILKER Planner".

O GitHub Pages suporta publicação por GitHub Actions e o endereço usa o padrão usuário.github.io/repositório.

**Observação sobre dados:** a versão web usa localStorage. Portanto, tarefas, gastos e investimentos ficam no navegador daquele dispositivo e não são sincronizados entre computadores ou celulares.

## Uso local

Dê dois cliques em:

ABRIR_WILKER_PLANNER.cmd

Ou:

    cd C:\Users\PC\Desktop\wilker-planner
    npm start

Depois acesse:

http://127.0.0.1:8080

## Recursos

- Dashboard pessoal
- Tarefas com prioridade, área, data, horário, duração e observações
- Kanban: A fazer / Em andamento / Concluída
- Arrastar e soltar entre colunas
- Tarefas recorrentes: Seg–Sex ou semanal
- Cronograma semanal
- Rotina automática
- Receitas e despesas
- Orçamento por categoria
- Contas e parcelamentos
- Metas financeiras
- Carteira manual de investimentos
- Registro de horas de estudo
- Trilha TI
- Backup e restauração em JSON
- Interface responsiva

## Privacidade

No modo web, seus dados não são gravados no GitHub: eles ficam no localStorage do navegador.

No modo local, o servidor grava:

data/wilker-planner.json

Esse arquivo fica ignorado pelo Git.

O site do GitHub Pages pode ser publicamente acessível mesmo quando o repositório é privado, dependendo do plano do GitHub. Não coloque senhas ou segredos no código.

## Estrutura

    wilker-planner/
    ├─ index.html
    ├─ server.js
    ├─ package.json
    ├─ ABRIR_WILKER_PLANNER.cmd
    ├─ README.md
    ├─ .github/
    │  └─ workflows/
    │     └─ deploy-pages.yml
    └─ data/
       └─ wilker-planner.json   (local, ignorado pelo Git)
