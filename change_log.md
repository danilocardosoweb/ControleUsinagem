# Log de Alterações

[04/10/2025 14:52] - [Projeto] - [Limpeza e organização completa do repositório] - [Windsurf]
- Criada estrutura organizada de pastas: docs/, docs/referencia/, scripts/
- Consolidados schemas SQL no data_schema.sql (fonte única)
- Movidos arquivos de documentação para docs/
- Movidos schemas antigos para docs/referencia/ (histórico)
- Movidos scripts de deploy para scripts/
- Removidos arquivos obsoletos: schema_rastreabilidade_amarrados.sql, schema_refugo.sql
- Removidos arquivos sensíveis: credenciais_teste.md
- Removidos scripts de migração não utilizados: cleanup_project.py, migrate_to_supabase.py
- Atualizado .gitignore com novas regras de exclusão
- Repositório limpo e organizado para produção

[04/10/2025 14:02] - [Frontend] - [Aprimoramento completo do relatório de rastreabilidade] - [Windsurf]
- Implementado relatório "Rastreabilidade (Amarrados/Lotes)" com visualização prévia completa
- Adicionado seletor "Modo de Exibição": Detalhado (1 linha por amarrado) vs Compacto (concatenado)
- Implementada exportação Excel (CSV) com fallback automático por lotes_externos e rack/produto
- Corrigidos erros de sintaxe JSX e estrutura do componente Relatorios.jsx
- Adicionadas colunas detalhadas: Amarrado_Ferramenta, Amarrado_Comprimento_mm, Amarrado_Pedido, Amarrado_Seq
- Implementada função agruparRastreabilidadeCompacto para modo compacto
- Criado arquivo INSTRUCOES_FALLBACK_AMARRADOS.md com código para fallback automático

[04/10/2025 14:02] - [Frontend] - [Correções no Dashboard e campo refugo] - [Windsurf]
- Corrigido cálculo "Tempo de Parada" usando tabela paradas com soma de durações do dia
- Ajustado "Ordens Concluídas" para usar regra separado >= qtd_pedido
- Corrigida coluna "Máquina" em "Ordens em Execução" mapeando IDs para nomes da tabela maquinas
- Adicionado campo "Refugos/Sucata" no modal "Confirmar Apontamento"
- Implementado salvamento em qtd_refugo na tabela apontamentos

[04/10/2025 14:02] - [Database] - [Adição de campo qtd_refugo] - [Windsurf]
- Criado script schema_refugo.sql para adicionar coluna qtd_refugo
- Campo numeric(18,3) com default 0 para controle de refugo/sucata
- Campo incluído em todos os relatórios de produção

[04/10/2025 12:20] - [Database/Frontend] - [Implementada rastreabilidade completa de amarrados] - [Danilo]
- Adicionado campo `amarrados_detalhados` (JSONB) na tabela `apontamentos`
- Sistema agora salva informações completas de cada amarrado selecionado:
  - Código do amarrado, rack específico, produto, pedido/seq, romaneio
  - Quantidades (kg/pc), situação, data embalagem, nota fiscal
- Criado arquivo `schema_rastreabilidade_amarrados.sql` com queries de exemplo
- Atualizada documentação em `database_schema.md`
- Frontend modificado para coletar e salvar detalhes completos dos amarrados

[04/10/2025 12:15] - [Frontend] - [Removido botão "Nova Busca" do modal] - [Danilo]
- Simplificado interface do modal "Procurar Amarrados"
- Mantidos apenas botões essenciais: "Adicionar à Seleção" e "Finalizar"

[04/10/2025 12:10] - [Frontend] - [Implementado modal de busca por amarrado com layout em duas colunas] - [Danilo]
- Modal redesenhado com largura máxima 7xl e altura 90vh
- Coluna esquerda: busca e seleção de amarrados
- Coluna direita: painel com amarrados já selecionados em tempo real
- Permite acumular amarrados de múltiplas buscas
- Controle individual para remover amarrados específicos

[04/10/2025 12:00] - [Frontend] - [Implementada lógica para rack opcional na busca por amarrado] - [Danilo]
- Campo Rack!Embalagem não é mais obrigatório quando usar "Procurar por Amarrado"
- Sistema detecta automaticamente racks dos amarrados selecionados
- Define "MÚLTIPLOS RACKS" quando amarrados vêm de racks diferentes
- Mantém fluxo tradicional para busca por rack específico

[04/10/2025 11:55] - [Frontend] - [Corrigido suporte a múltiplos racks na busca por amarrado] - [Danilo]
- Sistema agora suporta amarrados de diferentes racks na mesma seleção
- Cada lote mostra seu rack específico na interface
- Consolidação correta de amarrados independente do rack de origem

[04/10/2025 11:30] - [Frontend] - [Implementada seção de amarrados selecionados no formulário] - [Danilo]
- Adicionada visualização dos amarrados/lotes selecionados no formulário principal
- Permite remover lotes individuais ou todos de uma vez
- Mostra rack associado e contador de lotes selecionados

[04/10/2025 10:55] - [Frontend] - [Adicionado modal "Procurar por Amarrado"] - [Danilo]
- Implementado modal para buscar amarrados pelo número
- Permite selecionar amarrados específicos de diferentes racks
- Integrado ao fluxo de seleção de lotes no apontamento

[04/10/2025 08:59] - [frontend/src/services/SupabaseService.js] - [Correção do limite de 1000 registros na tabela lotes] - [Cascade]
- Implementada busca paginada para a tabela 'lotes' que carrega TODOS os registros em lotes de 1000.
- Corrigido problema onde apenas os primeiros 1000 lotes eram carregados (de 16 mil total).
- Adicionados logs de progresso durante o carregamento dos lotes.
- Mantida busca normal para outras tabelas menores.

[04/10/2025 08:55] - [frontend/src/pages/ApontamentosUsinagem.jsx] - [Correção definitiva da busca por Rack/Embalagem] - [Cascade]
- Restaurada busca exata primeiro (como na versão que funcionava), seguida de busca normalizada como fallback.
- Corrigida lógica em `buscarLotesPorRack()` e botão "Inspecionar" para priorizar correspondência exata.
- Adicionados logs de debug temporários para diagnosticar problemas de dados.
- Mantida função `normalizeRackId()` como fallback para variações de formato.

[01/10/2025 16:15] - [Banco de Dados] - [Consolidação do esquema Supabase/PostgreSQL] - [Cascade]
- Adicionadas tabelas: `apontamentos`, `tipos_parada`, `ferramentas_cfg`.
- Alterada `maquinas` com colunas: `codigo`, `modelo`, `fabricante`, `ano`.
- Alterada `pedidos` com coluna: `dados_originais (JSONB)` e índices adicionais.
- Criados índices condicionais para `apontamentos` (pedido_seq, inicio, maquina).
- Arquivo consolidado: `data_schema.sql` (inclui UP/DOWN para Postgres).

[01/10/2025 10:35] - [frontend/src/pages/ApontamentosUsinagem.jsx] - [Limpeza condicional após confirmar apontamento] - [Cascade]
- Após confirmar, o app pergunta se o usuário continuará cortando o mesmo item.
- Se SIM: mantém todos os campos e limpa apenas "Quantidade Produzida".
- Se NÃO: limpa todos os campos (via `clearForm()`), para escolher o próximo item.

[01/10/2025 10:57] - [frontend/src/pages/ApontamentosUsinagem.jsx] - [Modal personalizado: Continuar no mesmo item?] - [Cascade]
- Substituído `window.confirm` por um pop-up customizado com botões "Continuar" e "Novo item".
- Mantém fundo escurecido e impede interação com o restante da tela enquanto aberto.

[01/10/2025 11:06] - [frontend/src/pages/ApontamentosUsinagem.jsx] - [Geração de Lote e Impressão de Identificação (Word)] - [Cascade]
- Gerado código de lote combinando Dia+Hora+Minuto+Item+Comprimento+Pedido.Cliente+Nº OP.
- Incluído campo `lote` no payload salvo em `apontamentos` (IndexedDB).
- Criado modal pós-registro perguntando se deseja imprimir o formulário de identificação.
- Geração de arquivo `.doc` (HTML compatível com Word) com os campos: Cliente, Item, Item Cli, Medida, Pedido Tecno, Qtde, Palet, Pedido Cli e Lote.

[01/10/2025 11:14] - [frontend/src/pages/ApontamentosUsinagem.jsx] - [Ajuste do Lote e Layout do Word (paisagem)] - [Cascade]
- Lote passa a incluir data completa antes da hora: `DDMMYYYY-HHMM-...`.
- Documento `.doc` formatado em A4 paisagem com tabela, tipografia consistente e cabeçalho com Lote.

[01/10/2025 13:33] - [frontend/src/pages/ApontamentosUsinagem.jsx] - [Pop-up Romaneio e Lote Externo ao selecionar Pedido/Seq] - [Cascade]
- Ao selecionar um Pedido/Seq, abre modal solicitando "Número do Romaneio" e "Número do Lote (externo)".
- Valores são obrigatórios para rastreabilidade e salvos no formulário (`romaneioNumero`, `loteExterno`).
- Incluídos no payload do apontamento como `romaneio_numero` e `lote_externo`.

[29/09/2025 12:07] - [frontend/src/pages/ApontamentosUsinagem.jsx] - [Preenchimento automático do campo "Início" ao selecionar pedido] - [Cascade]
- Ao selecionar um pedido (via combo "Pedido/Seq" ou pelo modal de busca), o campo "Início" agora é preenchido automaticamente com a data/hora local atual no formato aceito por `datetime-local` (AAAA-MM-DDTHH:MM).
- Caso o campo já esteja preenchido, o valor existente é preservado (não sobrescreve).
- Não houve mudanças de banco de dados.

[29/09/2025 12:12] - [frontend/src/pages/ApontamentosUsinagem.jsx] - [Preenchimento automático do campo "Fim" (+1h do Início)] - [Cascade]
- Ao selecionar um pedido (via combo ou modal), o campo "Fim" passa a ser preenchido automaticamente com 1 hora a mais que o valor de "Início", quando "Fim" estiver vazio.
- O valor manual de "Fim", se já existir, é preservado (não sobrescreve).

[29/09/2025 12:19] - [frontend/src/pages/ApontamentosUsinagem.jsx] - [Persistência de rascunho do formulário] - [Cascade]
- Implementado salvamento automático do formulário em `localStorage` (chave `apont_usinagem_draft`).
- Rascunho é carregado ao abrir a página e limpo após o registro do apontamento.
- Garante que o nome do operador atual prevaleça ao carregar o rascunho.

[04/09/2025 17:45] - [frontend/src/contexts/AuthContext.jsx, frontend/src/pages/Login.jsx] - [Melhorias no sistema de login] - [Cascade]
- Simplificado o sistema de autenticação para aceitar qualquer email com a senha 'senha123'
- Adicionados logs de depuração para facilitar a identificação de problemas
- Pré-preenchido o formulário de login com credenciais válidas
- Melhorado o tratamento de erros e feedback ao usuário
- Adicionada detecção automática de papel (admin, supervisor, operador) com base no email

[04/09/2025 17:40] - [frontend/src/contexts/AuthContext.jsx] - [Correção das credenciais de login] - [Cascade]
- Atualizado o AuthContext para aceitar as credenciais definidas no arquivo credenciais_teste.md
- Adicionado suporte para login com os emails: admin@usinagem.com, operador@usinagem.com, supervisor@usinagem.com
- Adicionado suporte para login com o email danilo.cardosoweb@gmail.com
- Padronizada a senha para todos os usuários como 'senha123'

[04/09/2025 10:15] - [frontend/src/services, frontend/src/hooks] - [Implementação de persistência de dados com IndexedDB] - [Cascade]
- Criado serviço DatabaseService.js para gerenciar operações no IndexedDB
- Implementado hook personalizado useDatabase para facilitar o uso do IndexedDB em componentes React
- Adicionado suporte para armazenamento de pedidos, máquinas, insumos e configurações
- Implementada persistência de dados na página de Pedidos com suporte a importação de planilhas
- Adicionadas funcionalidades de sincronização com o servidor e gerenciamento offline dos dados

[03/09/2025 14:04] - [Projeto] - [Criação da estrutura inicial do projeto] - [Cascade]
[03/09/2025 14:08] - [Backend] - [Definição do esquema do banco de dados] - [Cascade]
[03/09/2025 14:12] - [Backend] - [Implementação da autenticação de usuários] - [Cascade]
[03/09/2025 14:16] - [Frontend] - [Criação da estrutura do frontend React] - [Cascade]
[03/09/2025 14:20] - [Frontend] - [Implementação das páginas de apontamentos] - [Cascade]
[03/09/2025 14:25] - [Frontend] - [Implementação do dashboard e relatórios] - [Cascade]
[03/09/2025 14:36] - [Frontend] - [Implementação da aba de Configurações] - [Cascade]
[03/09/2025 14:49] - [Backend/Frontend] - [Implementação da importação de planilha de pedidos] - [Cascade]
[03/09/2025 14:58] - [Frontend] - [Adição de campos para cadastro de Motivos e Tipos de Parada] - [Cascade]
[03/09/2025 15:10] - [Frontend] - [Correção da importação de planilhas Excel na página de Pedidos e Produtos] - [Cascade]
[03/09/2025 15:25] - [Frontend] - [Correção do mapeamento de colunas na importação da planilha de pedidos] - [Cascade]
[03/09/2025 16:10] - [Frontend] - [Implementação do cadastro de máquinas e insumos] - [Cascade]
[03/09/2025 16:45] - [frontend/src/pages/Configuracoes.jsx] - [Correção da interface de cadastro de máquinas e insumos] - [Cascade]
- Corrigidos erros de sintaxe na seção de máquinas
- Padronizado os valores de status das máquinas para 'ativo', 'manutencao' e 'inativo'
- Corrigida a exibição da tabela de máquinas que estava mostrando dados incorretos
- Melhorada a estrutura do código para facilitar manutenção futura
[03/09/2025 17:30] - [frontend/src/pages/Pedidos.jsx] - [Ajuste dos campos importantes na tabela de Pedidos e Produtos] - [Cascade]
- Atualizado o mapeamento de colunas para incluir todos os campos importantes da planilha
- Adicionado suporte para campos: Pedido/Seq, Pedido.Cliente, Cliente, Dt.Fatura, Produto, Unidade, Qtd.Pedido, Saldo.à.Prod, Estoque.ACA, Separado, Faturado, Item.Perfil, Nro da OP
- Melhorado o processamento de dados para extrair corretamente todos os campos importantes
- Implementada lógica para calcular valores padrão quando campos não estão presentes na planilha

[03/09/2025 17:45] - [backend/routes/pedidos.py] - [Atualização do mapeamento de colunas no backend] - [Cascade]
- Aprimorado o mapeamento de colunas na importação de planilhas no backend
- Adicionado suporte para variações de nomes de colunas em maiúsculas e minúsculas
- Organizado o mapeamento separando campos principais e campos adicionais
- Garantida a compatibilidade com os campos importantes identificados pelo usuário

[03/09/2025 16:45] - [backend/routes/pedidos.py] - [Ampliação do mapeamento de colunas] - [Cascade]
- Expandido o mapeamento de colunas para incluir mais variações de nomes
- Adicionado suporte para formatos com e sem pontuação (ex: "PEDIDO.CLIENTE" e "PEDIDO CLIENTE")
- Implementado reconhecimento de colunas com nomes simplificados (ex: "PEDIDO" para "pedido_seq")
- Melhorada a robustez da importação para lidar com diferentes formatos de planilhas
[03/07/2023 16:45] - [frontend/src/components/Sidebar.jsx] - Implementação de menu retrátil - [Windsurf]
- Adicionado botão para expandir/recolher o menu lateral
- Implementada detecção automática de dispositivos móveis para recolher o menu em telas pequenas
- Melhorada a experiência do usuário com transições suaves e ícones intuitivos
- Adicionado suporte a tooltips para itens do menu quando recolhido

[03/07/2023 15:30] - [frontend/src/pages/Pedidos.jsx] - Aprimoramento da importação de planilhas - [Windsurf]
- Implementado mapeamento dinâmico de colunas que reconhece os nomes exatos das colunas da planilha
- Adicionado suporte para preservar todos os dados originais da planilha em cada registro
- Melhorada a detecção de cabeçalhos para maior compatibilidade com diferentes formatos de planilha
- Adicionados logs detalhados para facilitar a depuração do processo de importação

[03/07/2023 14:30] - [frontend/src/pages/Pedidos.jsx] - Correção do mapeamento de colunas na importação da planilha - [Windsurf]
- Corrigido o mapeamento das colunas na função de importação para corresponder ao formato da planilha
- Adicionado tratamento adequado para datas no formato brasileiro e serial Excel
- Implementado cálculo correto de status e estoque com base nos dados importados
- Resolvido conflito de variável duplicada 'status' na função de importação

[03/09/2025 16:43] - [database_schema.sql, database_schema.md] - Atualização do esquema do banco de dados - [Cascade]
- Adicionada tabela de pedidos com todos os campos necessários para importação da planilha
- Incluídos campos como pedido_seq, cliente, produto, dt_fatura, saldo_a_prod, etc.
- Criados índices para melhorar a performance de consultas frequentes
- Atualizada a documentação do esquema para incluir a descrição detalhada da tabela de pedidos

[03/09/2025 16:45] - [backend/schemas/pedido.py] - Correção no schema do pedido - [Cascade]
- Corrigido o campo 'fativado' para 'efetivado' para alinhar com o esquema do banco de dados
- Garantida a consistência entre o modelo de dados do backend e a estrutura do banco de dados

[03/09/2025 16:50] - [frontend/src/pages/Pedidos.jsx] - Correção dos filtros na página de Pedidos - [Cascade]
- Corrigido o tratamento de datas nos filtros para garantir comparações corretas
- Adicionada verificação de valores nulos ou indefinidos nos campos de filtro
- Melhorada a função de ordenação para lidar corretamente com diferentes tipos de dados
- Implementado reset da página ao aplicar filtros para melhor experiência do usuário

[03/09/2025 17:15] - [frontend/src/pages/ApontamentosUsinagem.jsx, backend/routes/pedidos.py] - Atualização da página de Apontamentos - [Cascade]
- Adicionado uso do nome do usuário logado como operador
- Alterado campo "Ordem de Trabalho" para "Pedido/Seq"
- Alterado campo "Código do Perfil" para "Produto"
- Adicionados novos campos: "Qtd.Pedido", "Perfil Longo" e "Separado"
- Criado contexto de autenticação para gerenciar usuário logado
- Atualizado mapeamento de colunas no backend para incluir novos aliases
- Corrigido campo 'fativado' para 'efetivado' no mapeamento de colunas

[03/09/2025 17:45] - [frontend/src/main.jsx, frontend/src/App.jsx, frontend/src/pages/Login.jsx] - Correção da integração do contexto de autenticação - [Cascade]
- Adicionado AuthProvider ao redor da aplicação no main.jsx
- Atualizado App.jsx para usar o contexto de autenticação em vez de estado local
- Modificado componente Login para trabalhar com o contexto de autenticação
- Corrigido o fluxo de login para usar as credenciais definidas no AuthContext
- Implementado tratamento de erros e feedback visual durante o processo de login
