# Tarefas de Implementação — Weather App

As tarefas abaixo derivam de `plans/weather-app-plan.md` e estão agrupadas na sequência tipos → funções puras → services → hooks → componentes → integração → testes → hardening. Os IDs existentes foram preservados para manter referências estáveis. RFs indicam rastreabilidade aos requisitos da especificação.

**Escalas:** P0 bloqueia o primeiro fluxo utilizável; P1 completa capacidades do MVP após a primeira fatia; P2 é hardening/validação ampliada antes da entrega. Tamanho relativo: P é localizado e simples; M exige trabalho moderado ou vários casos; G tem maior complexidade, amplitude ou risco. Não são estimativas de horas.

## Entrega 1 — Tipos

### T-01 — Definir contratos compartilhados [P0, M]
- **Descrição:** Criar os tipos dos modelos internos, preferências, erros e estados assíncronos usados entre camadas.
- **Critérios de aceite (RF-01 a RF-08):** `src/types/weather.ts` declara os modelos de cidade/candidato, clima atual, previsão diária/horária, preferências, histórico e cache; `City` exige coordenadas numéricas e fuso IANA, enquanto metadados opcionais do candidato aceitam `null`; unidade aceita somente Celsius/Fahrenheit e estado assíncrono somente `idle`, `loading`, `success`, `empty` ou `error`; `pnpm build` passa em TypeScript strict.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`
- **Tipo:** Data

## Entrega 2 — Funções puras

### T-02 — Implementar normalização e ordenação de cidades [P0, M]
- **Descrição:** Criar funções puras para comparar nomes sem acento/caixa, filtrar refinadores e ordenar candidatos de geocoding de forma estável.
- **Critérios de aceite (RF-01; CA-01.2, CA-01.5, CA-01.8 a CA-01.10):** Nome exato é comparado após trim, sem diferenciar caixa/acentos e preservando pontuação; exatos ordenam por região/país e os demais por cidade/região/país em pt-BR; metadados ausentes ficam ao final e desempate preserva `sourceIndex`; refinador informado exclui candidato sem valor correspondente; somente coordenadas finitas e fuso IANA válido são selecionáveis e a mesma coordenada/fuso sempre gera o mesmo ID.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/citySorting.ts`, `src/types/weather.ts`
- **Tipo:** Data

### T-04 — Implementar mapeamento WMO e validação meteorológica [P0, M]
- **Descrição:** Criar funções puras para localizar códigos WMO e validar campos meteorológicos individualmente.
- **Critérios de aceite (RF-02/RF-03; CA-02.4, CA-03.7):** Código WMO desconhecido produz condição indisponível; campos numéricos ausentes/não finitos, umidade fora de 0–100%, vento/precipitação negativos e máxima menor que mínima são invalidados individualmente; demais campos válidos permanecem no resultado e a medição/dia/hora afetado é marcado incompleto.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/weatherMapping.ts`, `src/types/weather.ts`
- **Tipo:** Data

### T-06 — Implementar operações de data e hora local [P0, M]
- **Descrição:** Derivar datas e horários de timestamps no fuso IANA e agrupar horas pela data local.
- **Critérios de aceite (RF-03; CA-03.1, CA-03.3, CA-03.5, RNF-07):** Dado timestamp e fuso IANA, funções retornam data local `YYYY-MM-DD`, exibem data `DD/MM/AAAA` e hora 24 h; agrupam cada hora pela data local; dois epoch distintos durante hora repetida continuam distintos; resultados não dependem do fuso configurado no dispositivo.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/localDate.ts`
- **Tipo:** Data

### T-08 — Implementar conversão e formatação de temperatura [P0, M]
- **Descrição:** Criar funções puras para exibir Celsius ou Fahrenheit a partir do valor canônico em Celsius.
- **Critérios de aceite (RF-04; CA-04.2 a CA-04.5, CA-04.7):** Conversão usa o valor Celsius sem arredondamento intermediário; formato Fahrenheit arredonda o resultado final a uma casa decimal, empate para longe de zero e vírgula pt-BR; 0 °C resulta em 32,0 °F, 100 °C em 212,0 °F, -40 °C em -40,0 °F e 20,25 °C em 68,5 °F; não há conversão de vento ou precipitação.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`
- **Tipo:** Data

## Entrega 3 — Services

### T-10 — Implementar serviço de geocoding [P0, M]
- **Descrição:** Consultar Open-Meteo Geocoding e adaptar candidatos ao modelo interno.
- **Critérios de aceite (RF-01/RF-05; CA-01.1, CA-01.2, CA-01.4, CA-01.5, CA-01.8 a CA-01.10, CA-05.6):** Request inclui `name`, `count=100`, `language=pt` e `format=json`; resposta mapeia cidade, região, país, coordenadas e fuso preservando índice original; filtros/ordenação seguem T-02; lista vazia é distinta de HTTP/JSON/rede inválidos; timeout encerra em 8 s; erro de busca não lê cache meteorológico.
- **Dependências:** T-01, T-02.
- **Arquivos prováveis:** `src/services/geocodingService.ts`
- **Tipo:** Data

### T-12 — Implementar serviço de armazenamento resiliente [P0, G]
- **Descrição:** Persistir e carregar unidade, favoritos, histórico e snapshots por cidade no `localStorage`.
- **Critérios de aceite (RF-04/RF-06/RF-07/RF-08; CA-04.6, CA-06.1, CA-06.2, CA-06.6, CA-07.1, CA-07.3, CA-08.3):** Unidade/favoritos/histórico sobrevivem à leitura após gravação; histórico tem no máximo uma entrada por coordenadas+fuso e ordenação mais recente primeiro; cache com idade de 24 h é válido e idade maior, timestamp futuro ou JSON/modelo inválido não é; exceções de leitura/escrita são capturadas e não impedem consulta online.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/services/storageService.ts`
- **Tipo:** Data

### T-14 — Implementar serviço de previsão Open-Meteo [P0, G]
- **Descrição:** Consultar e adaptar uma resposta agregada de clima atual, cinco dias e dados horários.
- **Critérios de aceite (RF-02/RF-03/RF-05/RF-08; CA-02.1 a CA-02.4, CA-03.1 a CA-03.7, CA-05.5, CA-08.2 a CA-08.3):** Request envia coordenadas, fuso IANA, unidades Celsius/kmh/mm, campos current/daily/hourly, `forecast_days=5` e `timeformat=unixtime`; resposta valida o fuso, produz cinco dias locais e horas agrupadas por timestamp, preserva campos parciais conforme T-04 e rejeita estrutura não interpretável; timeout encerra em 8 s; sucesso define `fetchedAt` local UTC.
- **Dependências:** T-01, T-04, T-06.
- **Arquivos prováveis:** `src/services/weatherService.ts`
- **Tipo:** Data

## Entrega 4 — Hooks

### T-16 — Implementar hook de preferências [P0, M]
- **Descrição:** Carregar e atualizar unidade, favoritos e histórico por meio do serviço de armazenamento.
- **Critérios de aceite (RF-04/RF-06; CA-04.1, CA-04.6, CA-06.1, CA-06.2, CA-06.6):** Sem preferência salva, hook inicia em Celsius; alterar unidade/favorito e atualizar histórico chama o armazenamento com o novo valor; cidade repetida aparece uma vez no início do histórico; falha de armazenamento é exposta ao chamador sem rejeição não tratada.
- **Dependências:** T-12.
- **Arquivos prováveis:** `src/hooks/usePreferences.ts`
- **Tipo:** Data

### T-18 — Implementar hook de busca e seleção de cidades [P0, M]
- **Descrição:** Orquestrar busca, refinadores, resultados, seleção e estados assíncronos.
- **Critérios de aceite (RF-01/RF-05; CA-01.1, CA-01.2, CA-01.6, CA-01.7, CA-05.1, CA-05.6):** Input vazio/espaços não chama serviço e produz validação; lista vazia produz `empty` e falha/timeout produz `error`; loading só é emitido após 200 ms; após duas buscas concorrentes, somente a resposta da mais recente altera estado; cancelamento não produz erro visível e erro de geocoding não consulta cache meteorológico.
- **Dependências:** T-10.
- **Arquivos prováveis:** `src/hooks/useCitySearch.ts`
- **Tipo:** Data

### T-20 — Implementar hook de consulta meteorológica [P0, G]
- **Descrição:** Orquestrar previsão, seleção do dia, conectividade, cache e retry.
- **Critérios de aceite (RF-05 a RF-08; CA-05.2 a CA-05.5, CA-06.5, CA-06.6, CA-07.1 a CA-07.5, CA-08.1 a CA-08.4):** Online com histórico seleciona a cidade mais recente e consulta; offline não inicia request e usa cache de idade ≤24 h, identificado com horário, ou estado sem dados recentes; falha online usa cache válido com aviso ou erro sem dados antigos; só sucesso online/cache atualiza histórico e cache; resposta de seleção anterior não substitui a mais recente.
- **Dependências:** T-12, T-14, T-16, T-18.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`
- **Tipo:** Data

## Entrega 5 — Componentes

### T-22 — Implementar busca, refinadores e resultados [P0, M]
- **Descrição:** Construir a interface acessível para informar cidade, refinar por país/região e escolher um resultado.
- **Critérios de aceite (RF-01/RF-05; CA-01.1, CA-01.2, CA-01.4 a CA-01.10, CA-05.1, CA-05.6, RNF-04):** Busca apresenta cidade obrigatória e refinadores opcionais com nomes acessíveis; cada resultado exibe cidade, região, país e fuso, campos ausentes como “Não informado”/“Fuso horário indisponível”; resultado sem coordenada/fuso é desabilitado com motivo; submit/seleção funcionam por teclado e estados vazio/loading/erro são distintos.
- **Dependências:** T-18.
- **Arquivos prováveis:** `src/components/CitySearch.tsx`
- **Tipo:** UI

### T-24 — Implementar apresentação do clima atual [P0, M]
- **Descrição:** Exibir condições atuais, temperaturas e disponibilidade parcial dos campos.
- **Critérios de aceite (RF-02/RF-04/RF-05/RF-07; CA-02.1 a CA-02.4, CA-04.2, CA-05.3, CA-05.4, CA-07.2):** Para dados fornecidos, renderiza cidade, temperatura, condição, sensação térmica, vento em km/h e umidade em %; temperatura usa unidade recebida; campo inválido aparece “Indisponível” e estado parcial é identificado; dados em cache mostram origem, data/hora e aviso de falha.
- **Dependências:** T-08, T-20.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`
- **Tipo:** UI

### T-25 — Implementar previsão diária e horária [P1, G]
- **Descrição:** Exibir os cinco dias locais e permitir selecionar um dia para consultar suas horas.
- **Critérios de aceite (RF-03/RF-04; CA-03.1 a CA-03.7, CA-04.2, CA-04.5, RNF-07):** Renderiza exatamente cinco datas locais consecutivas; detalhe inicia em hoje local e cada seleção mostra horários daquele dia com temperatura, condição e precipitação em mm; data usa `DD/MM/AAAA`, hora 24 h e fuso da cidade; temperaturas usam a unidade selecionada; dados inválidos aparecem “Indisponível” e dia/hora afetado é marcado incompleto.
- **Dependências:** T-06, T-08, T-20.
- **Arquivos prováveis:** `src/components/ForecastView.tsx`
- **Tipo:** UI

### T-27 — Implementar favoritos e histórico [P1, M]
- **Descrição:** Exibir cidades salvas e permitir favoritar, desfavoritar, remover do histórico e selecionar cidades recentes.
- **Critérios de aceite (RF-06/RF-07; CA-06.1, CA-06.2, CA-06.5, CA-06.6, CA-07.5):** Lista renderiza favoritos e histórico recebidos; ações permitem adicionar/remover favorito, remover/limpar histórico e selecionar item; selecionar favorito/histórico dispara callback de consulta; histórico não mostra duplicatas e listas vazias têm estado explícito.
- **Dependências:** T-16, T-20.
- **Arquivos prováveis:** `src/components/SavedCities.tsx`
- **Tipo:** UI

### T-28 — Implementar controle de unidade [P1, P]
- **Descrição:** Criar controle acessível para alternar Celsius/Fahrenheit.
- **Critérios de aceite (RF-04; CA-04.1 a CA-04.7, RNF-04):** Controle indica unidade atual por nome acessível e permite alternar por teclado; selecionar outra unidade chama callback de preferência; temperaturas visíveis mudam, vento km/h e precipitação mm não mudam; a ação não dispara request e os dados de origem permanecem em Celsius.
- **Dependências:** T-08, T-16.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`
- **Tipo:** UI

### T-29 — Implementar estado de carregamento [P0, P]
- **Descrição:** Criar a apresentação acessível do estado de carregamento da aplicação.
- **Critérios de aceite (RF-05; CA-05.1, RNF-04):** Quando renderizado, apresenta texto visível de carregamento e semântica de status anunciável; teste de componente encontra a mensagem por role/nome; componente não inicia serviços nem muda estado de consulta.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`
- **Tipo:** UI

### T-30 — Implementar estado vazio [P0, P]
- **Descrição:** Criar a apresentação acessível para ausência de resultados ou dados disponíveis.
- **Critérios de aceite (RF-01/RF-05/RF-07; CA-01.6, CA-07.3, CA-07.5, RNF-04):** Props distintas renderizam mensagens distintas para “nenhuma cidade encontrada” e “sem dados offline recentes”; busca vazia não seleciona cidade; estado offline permite as ações recebidas para busca/seleção manual; mensagens são localizáveis por role/texto e componente não acessa serviços/armazenamento.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`
- **Tipo:** UI

### T-31 — Implementar estado de erro [P0, P]
- **Descrição:** Criar a apresentação acessível de erros e da ação de retry.
- **Critérios de aceite (RF-05; CA-05.2, CA-05.5, CA-05.6, RNF-04):** Erros de busca e de previsão renderizam mensagens distintas conforme props; erro meteorológico sem cache não exibe dados antigos; retry é botão nomeado, focável e acionável por teclado; componente apenas chama callback e não faz request/acesso ao armazenamento.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`
- **Tipo:** UI

## Entrega 6 — Integração

### T-32 — Integrar busca e clima atual na aplicação [P0, M]
- **Descrição:** Integrar busca manual, seleção de cidade e clima atual na primeira versão visível da tela.
- **Critérios de aceite (RF-01/RF-02/RF-05; CA-01.3, CA-01.7, CA-02.1 a CA-02.4, CA-05.1, CA-05.6):** A tela permite buscar e selecionar cidade e então exibe clima atual; busca vazia, loading e erro são visíveis; nenhum fluxo chama `navigator.geolocation`; componentes recebem dados/estados por props e ações por callbacks.
- **Dependências:** T-22, T-24, T-29, T-30, T-31.
- **Arquivos prováveis:** `src/App.tsx`
- **Tipo:** UI

### T-40 — Integrar previsão e preferências na aplicação [P1, M]
- **Descrição:** Expandir a composição para previsão diária/horária, unidade, favoritos, histórico e inicialização por cidade recente.
- **Critérios de aceite (RF-03 a RF-08; CA-03.1 a CA-03.7, CA-04.1 a CA-04.7, CA-05.2 a CA-05.5, CA-06.1 a CA-06.6, CA-07.1 a CA-07.5, CA-08.1 a CA-08.5):** A tela integrada apresenta previsão e permite selecionar dia; unidade e cidades salvas acionam seus callbacks; online abre na cidade recente e atualiza; offline exibe cache válido identificado ou estado sem dados recentes; sem histórico não seleciona cidade automaticamente.
- **Dependências:** T-32, T-20, T-25, T-27, T-28.
- **Arquivos prováveis:** `src/App.tsx`
- **Tipo:** UI

## Entrega 7 — Testes

### T-03 — Testar normalização e ordenação de cidades [P0, M]
- **Descrição:** Cobrir ordenação, refinadores, candidatos incompletos e criação de cidade selecionável.
- **Critérios de aceite (RF-01; CA-01.2, CA-01.5, CA-01.8 a CA-01.10):** Testes unitários verificam nomes com espaços externos, caixa, acentos e pontuação; ordem de exatos/não exatos, campos ausentes e empate; filtro de país/região; elegibilidade por coordenadas/fuso e ID estável; nenhuma asserção usa rede real.
- **Dependências:** T-02.
- **Arquivos prováveis:** `tests/unit/citySorting.test.ts`
- **Tipo:** Test

### T-05 — Testar mapeamento WMO e validação meteorológica [P0, M]
- **Descrição:** Validar tabela de condições e regras de campos parciais.
- **Critérios de aceite (RF-02/RF-03; CA-02.4, CA-03.7):** Testes unitários verificam códigos WMO válidos/desconhecidos, limites 0 e 100% de umidade, vento/precipitação negativos, máxima menor que mínima e campo ausente/não finito; em cada falha, assertam que campos válidos permanecem e incompletude é marcada.
- **Dependências:** T-04.
- **Arquivos prováveis:** `tests/unit/weatherMapping.test.ts`
- **Tipo:** Test

### T-07 — Testar operações de data e hora local [P0, M]
- **Descrição:** Cobrir agrupamento de cinco dias e formatação em fusos IANA.
- **Critérios de aceite (RF-03; CA-03.1, CA-03.3, CA-03.5, RNF-07):** Testes unitários com timestamps fixos verificam cinco datas locais consecutivas, mudança de dia entre fusos, transição de horário de verão com horas distintas, formato `DD/MM/AAAA` e hora 24 h; passam sem depender do fuso da máquina.
- **Dependências:** T-06.
- **Arquivos prováveis:** `tests/unit/localDate.test.ts`
- **Tipo:** Test

### T-09 — Testar conversão unitária de temperatura [P0, P]
- **Descrição:** Testar isoladamente as funções de conversão e formatação Celsius/Fahrenheit.
- **Critérios de aceite (RF-04; CA-04.3 a CA-04.5, CA-04.7):** Testes unitários assertam exatamente 32,0 °F, 212,0 °F, -40,0 °F e 68,5 °F para as entradas especificadas, além de vírgula decimal e empate negativo longe de zero; vento em km/h e precipitação em mm permanecem inalterados.
- **Dependências:** T-08.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`
- **Tipo:** Test

### T-11 — Testar service de geocoding com `fetch` mockado [P0, M]
- **Descrição:** Validar URL, adaptação de resposta e falhas do geocoding substituindo `fetch` por mock.
- **Critérios de aceite (RF-01/RF-05; CA-01.1, CA-01.2, CA-01.4, CA-01.5, CA-01.8 a CA-01.10, CA-05.6):** Testes com `fetch` simulado assertam URL/parâmetros e mapeamento, resultado vazio, filtro, erro HTTP/JSON/rede e timeout de 8 s; em todos os erros, assertam estado de erro de busca e zero leitura de cache meteorológico.
- **Dependências:** T-10.
- **Arquivos prováveis:** `tests/unit/geocodingService.test.ts`
- **Tipo:** Test

### T-13 — Testar serviço de armazenamento [P0, M]
- **Descrição:** Verificar persistência normal, dados corrompidos e indisponibilidade de armazenamento.
- **Critérios de aceite (RF-04/RF-06/RF-07/RF-08; CA-04.6, CA-06.1, CA-06.2, CA-06.6, CA-07.1, CA-07.3, CA-08.3):** Testes unitários assertam persistência/reload, deduplicação/ordem do histórico, cache válido em 24 h e inválido acima de 24 h, relógio futuro e conteúdo corrompido; mocks de `localStorage` que falham não causam exceção não tratada.
- **Dependências:** T-12.
- **Arquivos prováveis:** `tests/unit/storageService.test.ts`
- **Tipo:** Test

### T-15 — Testar service meteorológico com `fetch` mockado [P0, G]
- **Descrição:** Cobrir contrato da API, adaptação e erros do service de previsão com respostas determinísticas e `fetch` substituído por mock.
- **Critérios de aceite (RF-02/RF-03/RF-05/RF-08; CA-02.1 a CA-02.4, CA-03.1 a CA-03.7, CA-05.5, CA-08.2 a CA-08.3):** Testes com `fetch` simulado assertam parâmetros/mapeamento, cinco datas, agrupamento horário, resposta parcial, fuso divergente, arrays desalinhados, HTTP/JSON/rede inválidos e timeout de 8 s; payload não interpretável não é gravado como snapshot.
- **Dependências:** T-14.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`
- **Tipo:** Test

### T-17 — Testar hook de preferências [P0, M]
- **Descrição:** Verificar carregamento, atualização e falhas do estado de preferências.
- **Critérios de aceite (RF-04/RF-06; CA-04.1, CA-04.6, CA-06.1, CA-06.2, CA-06.6):** Testes assertam Celsius sem valor salvo, restauração de Fahrenheit, adicionar/remover favorito, uma entrada de histórico movida para o início após consulta e propagação controlada de falha de leitura/gravação.
- **Dependências:** T-16.
- **Arquivos prováveis:** `tests/unit/usePreferences.test.tsx`
- **Tipo:** Test

### T-19 — Testar hook de busca e seleção [P0, M]
- **Descrição:** Cobrir estados, refinadores e concorrência da busca.
- **Critérios de aceite (RF-01/RF-05; CA-01.1, CA-01.2, CA-01.6, CA-01.7, CA-05.1, CA-05.6):** Testes com serviços mockados e timers falsos assertam os cinco estados, input vazio sem request, lista vazia distinta de erro, refinadores, retry, loading em 200 ms, cancelamento e descarte da resposta antiga após nova busca; não usam rede real.
- **Dependências:** T-18.
- **Arquivos prováveis:** `tests/unit/useCitySearch.test.tsx`
- **Tipo:** Test

### T-21 — Testar hook meteorológico e fallback de cache [P0, G]
- **Descrição:** Validar os estados e transições da consulta meteorológica sem depender da API externa.
- **Critérios de aceite (RF-05 a RF-08; CA-05.2 a CA-05.5, CA-06.5, CA-06.6, CA-07.1 a CA-07.5, CA-08.1 a CA-08.4):** Testes com hook/serviços mockados assertam abertura online/offline, ausência de request offline, cache válido exatamente em 24 h e expirado acima disso, aviso/horário, erro sem cache, atualização do histórico apenas em sucesso e descarte de resposta antiga.
- **Dependências:** T-20.
- **Arquivos prováveis:** `tests/unit/useWeather.test.tsx`
- **Tipo:** Test

### T-23 — Testar interface de busca [P0, M]
- **Descrição:** Testar interação de busca e seleção usando Testing Library.
- **Critérios de aceite (RF-01/RF-05; CA-01.1, CA-01.2, CA-01.4 a CA-01.10, CA-05.1, CA-05.6, RNF-04):** Testing Library verifica submissão por botão/Enter, labels via role/nome, campos dos resultados e metadados ausentes, candidato inválido desabilitado, callback somente para candidato selecionável, refinadores, vazio e erro; nenhum teste requer API real.
- **Dependências:** T-22.
- **Arquivos prováveis:** `tests/unit/CitySearch.test.tsx`
- **Tipo:** Test

### T-26 — Testar apresentação atual e previsão [P1, M]
- **Descrição:** Validar estados de apresentação, seleção diária e formatação dos dados meteorológicos.
- **Critérios de aceite (RF-02 a RF-05/RF-07; CA-02.1 a CA-02.4, CA-03.1 a CA-03.7, CA-04.2, CA-04.5, CA-05.3, CA-05.4, CA-07.2, RNF-04/RNF-07):** Testes de componente assertam os cinco dias e valores/horários por fuso, seleção de dia, unidades, precipitação em mm, campo parcial “Indisponível”, identificação de cache com horário/aviso e nomes acessíveis dos controles.
- **Dependências:** T-24, T-25.
- **Arquivos prováveis:** `tests/unit/CurrentWeather.test.tsx`, `tests/unit/ForecastView.test.tsx`
- **Tipo:** Test

### T-39 — Testar componentes nos estados loading, erro e vazio [P0, M]
- **Descrição:** Testar isoladamente os componentes de estado com Testing Library.
- **Critérios de aceite (RF-01/RF-05/RF-07; CA-01.6, CA-05.1, CA-05.2, CA-05.6, CA-07.3, CA-07.5, RNF-04):** Testes confirmam que loading expõe status acessível; vazio distingue “nenhuma cidade encontrada” de “sem dados offline recentes”; erro distingue busca de previsão, omite dados antigos sem cache e oferece retry acionável por teclado; mensagens podem ser localizadas por role/texto.
- **Dependências:** T-29, T-30, T-31.
- **Arquivos prováveis:** `tests/unit/states.test.tsx`
- **Tipo:** Test

### T-33 — Testar composição da aplicação [P1, M]
- **Descrição:** Verificar os fluxos integrados da tela com serviços substituídos por dados controlados.
- **Critérios de aceite (RF-01/RF-04/RF-05/RF-07/RF-08; CA-01.3, CA-01.7, CA-04.1, CA-05.1, CA-07.4, CA-07.5, CA-08.1, CA-08.5):** Testes de integração com serviços mockados verificam abertura sem histórico sem request, abertura com cidade recente, caminho busca/seleção/previsão, carregamento, vazio, erro/retry e alternância de unidade sem chamada meteorológica adicional; spy de geolocation confirma zero chamadas a `getCurrentPosition`/`watchPosition` na abertura e busca.
- **Dependências:** T-32, T-40.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`
- **Tipo:** Test

### T-34 — Testar fluxo E2E principal em desktop e mobile [P1, G]
- **Descrição:** Validar o caminho principal no navegador com respostas interceptadas.
- **Critérios de aceite (RF-01 a RF-04; CA-01.2, CA-01.4, CA-01.5, CA-01.8 a CA-01.10, CA-02.1 a CA-02.3, CA-03.1 a CA-03.6, RNF-01):** Playwright intercepta geocoding/forecast e executa busca, seleção, clima atual, cinco dias e detalhe horário em desktop e viewport mobile de 375 px; em ambos verifica refinador, localidade escolhida entre homônimas, candidato inválido desabilitado, unidades/formato local e ausência de rolagem horizontal; nenhuma chamada depende da API externa.
- **Dependências:** T-40, T-33.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-35 — Testar fluxos E2E de falha e disponibilidade offline [P1, G]
- **Descrição:** Validar busca vazia/erro, falha meteorológica e comportamento offline com e sem cache.
- **Critérios de aceite (RF-01/RF-05/RF-07/RF-08; CA-01.6, CA-05.2 a CA-05.6, CA-07.1 a CA-07.5, CA-08.4):** Cenários interceptados verificam vazio distinto de erro, erro/timeout de geocoding sem cache, timeout meteorológico em 8 s, cache válido inclusive no limite de 24 h com aviso/horário, cache expirado/ausente sem valores atuais e abertura offline sem request.
- **Dependências:** T-32, T-40, T-34.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-36 — Testar E2E de preferências e histórico [P1, M]
- **Descrição:** Validar persistência de favoritos, histórico e unidade em navegação real.
- **Critérios de aceite (RF-04/RF-06/RF-08; CA-04.1, CA-04.2, CA-04.5, CA-04.6, CA-06.1, CA-06.2, CA-06.5, CA-06.6, CA-08.2):** Playwright salva favorito e unidade, recarrega a página e verifica restauração; seleciona uma cidade salva e verifica consulta; consulta novamente a mesma localidade e verifica uma única entrada na primeira posição; alternância de unidade não aumenta a contagem de requests meteorológicos nem altera vento/precipitação.
- **Dependências:** T-40, T-34.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`
- **Tipo:** Test

### T-37 — Validar responsividade e acessibilidade dos fluxos [P2, G]
- **Descrição:** Cobrir viewports móveis, desktop e uso por teclado nos fluxos principais.
- **Critérios de aceite (RNF-01/RNF-04/RNF-06):** Em 320 px, 375 px e 1440 px, `scrollWidth` não excede `clientWidth` e busca, seleção, previsão e controles permanecem visíveis/interativos; teclado alcança e aciona busca, seleção, unidade e retry com foco visível; controles essenciais têm role/nome acessível verificável. A matriz completa RNF-06 permanece validação de release.
- **Dependências:** T-34, T-35, T-36.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`, `playwright.config.ts`
- **Tipo:** Test

## Entrega 8 — Hardening

### T-38 — Integrar verificações determinísticas ao CI [P2, M]
- **Descrição:** Manter o workflow de CI executando as verificações determinísticas do projeto.
- **Critérios de aceite (RNF-03/RNF-06):** Workflow executa com sucesso `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e`; testes interceptam chamadas Open-Meteo e não falham por indisponibilidade externa; medição de p95 em 4G e matriz integral de navegadores são registradas como validações separadas de release, não presumidas pelo CI determinístico.
- **Dependências:** T-03, T-05, T-07, T-09, T-11, T-13, T-15, T-17, T-19, T-21, T-23, T-26, T-33, T-34, T-35, T-36, T-37, T-39, T-40.
- **Arquivos prováveis:** `.github/workflows/ci.yml`
- **Tipo:** Infra

## Sequência sugerida em fatias verticais

Executar cada fatia na ordem de dependência indicada: primeiro implementação até uma interface utilizável, depois seus testes focados. A primeira demonstração não precisa aguardar a apresentação de favoritos/Fahrenheit nem as validações ampliadas.

1. **Clima atual visível (P0):** T-01 → T-02/T-04/T-06/T-08 → T-10/T-12/T-14 → T-16/T-18/T-20 → T-22/T-24/T-29/T-30/T-31 → T-32. Validar com T-03/T-05/T-07/T-09/T-11/T-13/T-15/T-17/T-19/T-21/T-23/T-39. Resultado: buscar uma cidade, selecioná-la e ver clima atual com estados loading, vazio e erro.
2. **Previsão e preferências (P1):** T-25/T-27/T-28 → T-40. Validar com T-26/T-33/T-34/T-36. Resultado: previsão de cinco dias e detalhe horário, troca de unidade, favoritos/histórico e restauração da cidade recente.
3. **Resiliência e prontidão de entrega (P1/P2):** completar cenários offline/erro com T-35, viewport/acessibilidade com T-37 e pipeline com T-38. Resultado: fallback de cache verificado e gates automatizados antes do release.

## Rastreabilidade dos requisitos funcionais

As tarefas abaixo são de implementação; tarefas de teste correspondentes estão na Entrega 7. T-01 define contratos compartilhados usados por todos os requisitos.

| Requisito da spec | Tarefas de implementação | Cobertura e lacunas |
| --- | --- | --- |
| RF-01 — Buscar cidades | T-02, T-10, T-18, T-22, T-32 | Busca, filtros, ordenação, resultados selecionáveis, validação e busca manual sem geolocalização. |
| RF-02 — Consultar clima atual | T-04, T-14, T-20, T-24, T-32 | Mapeamento WMO, consulta, orquestração e apresentação dos campos atuais. |
| RF-03 — Consultar previsão | T-04, T-06, T-14, T-20, T-25, T-40 | Cinco dias locais, seleção do dia, detalhe horário, fuso e condições localizadas. |
| RF-04 — Alternar unidades | T-08, T-12, T-16, T-24, T-25, T-28, T-40 | Conversão e formatação, preferência persistida e aplicação às temperaturas atuais/previstas sem alterar vento ou precipitação. |
| RF-05 — Informar estados da consulta | T-10, T-14, T-18, T-20, T-24, T-29, T-30, T-31, T-32, T-40 | Estados de busca/consulta, timeout, fallback de cache e componentes de loading, vazio e erro. |
| RF-06 — Manter dados no dispositivo | T-12, T-16, T-27, T-40 | Persistência local, favoritos, histórico, deduplicação, remoção e reconsulta. CA-06.3/06.4 (sem conta e sem envio/sincronização em servidor) não têm verificação explícita em tarefa de teste; a implementação prevista usa armazenamento local e não inclui backend. |
| RF-07 — Consultar cache offline | T-12, T-20, T-24, T-27, T-30, T-40 | Validade de 24 horas, seleção da cidade recente ao abrir offline, sinalização de origem/horário e estado sem dados recentes. |
| RF-08 — Atualizar dados online | T-14, T-20, T-32, T-40 | Consulta ao abrir com histórico e ao selecionar cidade; sem histórico, aguarda busca manual. |

**Lacunas identificadas:** nenhum RF está sem tarefa de implementação correspondente. A lacuna é de verificação explícita: CA-06.3 e CA-06.4 não têm critério de teste dedicado para confirmar ausência de exigência de conta e de transmissão de preferências/histórico ao servidor.