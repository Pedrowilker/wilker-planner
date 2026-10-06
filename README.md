# WILKER Planner

Planejador pessoal **local para Windows** com tarefas, rotina, estudos, finanças e investimentos.

## Versão estável

**WILKER Planner 1.0.0**

A versão atual foi preparada como base estável do projeto: interface refinada, navegação responsiva, persistência local e funcionamento offline/local.

## Como executar

### Opção 1 — mais simples

Dê dois cliques em:

`ABRIR_WILKER_PLANNER.cmd`

O servidor local será iniciado e o navegador abrirá:

`http://127.0.0.1:8080`

### Opção 2 — PowerShell

```powershell
cd C:\Users\PC\Desktop\wilker-planner
npm start
```

Depois acesse:

`http://127.0.0.1:8080`

Para encerrar o servidor, use `Ctrl + C`.

## Recursos

### Organização

- Dashboard pessoal
- Tarefas com prioridade, área, data, horário, duração e observações
- Kanban: **A fazer / Em andamento / Concluída**
- Arrastar e soltar entre colunas
- Tarefas recorrentes: **Seg–Sex** ou **semanal**
- Cronograma semanal
- Rotina automática de estudo, academia e revisão financeira

### Finanças

- Receitas
- Despesas
- Saldo
- Taxa de poupança
- Orçamento por categoria
- Contas e parcelamentos
- Marcação de conta como paga
- Metas financeiras

### Investimentos

- Cadastro manual de ativos
- Tipo de ativo
- Valor atual
- Rentabilidade informada
- Patrimônio total
- Sem conexão com corretoras

### Estudos / TI

- Registro de sessões de estudo
- Horas estudadas
- Histórico recente
- Meta semanal
- Trilha:
  **Fundamentos + Software → Backend + APIs → Cloud + DevOps → IA + Segurança**

### Backup

O WILKER permite exportar e importar um arquivo JSON pelo próprio aplicativo.

## Armazenamento e privacidade

Os dados do Planner são mantidos localmente no computador.

O servidor grava os dados em:

`data/wilker-planner.json`

A pasta `data` é protegida pelo `.gitignore`, portanto o arquivo com suas tarefas, gastos e informações financeiras não é enviado ao repositório Git.

Existe também um fallback no `localStorage` do navegador caso o servidor fique indisponível.

## Estrutura principal

```text
wilker-planner/
├─ index.html
├─ server.js
├─ package.json
├─ ABRIR_WILKER_PLANNER.cmd
├─ README.md
├─ .gitignore
└─ data/
   └─ wilker-planner.json   (local, ignorado pelo Git)
```

## Requisitos

- Windows
- Node.js 18 ou superior

## Repositório

Projeto mantido em repositório GitHub privado:

`Pedrowilker/wilker-planner`

A pasta local deve ser atualizada com:

```powershell
git pull origin main
```
