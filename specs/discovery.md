# Discovery: Aplicação de Previsão do Tempo

## Resumo Executivo

- O produto será uma aplicação web responsiva e comercial, em pt-BR, para o público geral no Brasil, com busca manual de cidades no mundo todo.
- Usuários poderão consultar o clima atual e a previsão diária para hoje e os quatro dias seguintes, além do detalhe por hora do dia selecionado no horário local da cidade.
- O clima atual inclui temperatura, condição, sensação térmica, vento e umidade; o resumo diário inclui máxima, mínima e condição; o detalhe por hora inclui temperatura, condição e precipitação.
- Celsius será a unidade padrão, com opção de alternar para Fahrenheit; não haverá login nem persistência em servidor.
- Open-Meteo será usado comercialmente sem API key; o aceite inclui 90% de conclusão não assistida, p95 de até 3 s no fluxo completo em 4G, feedback visual local até 200 ms, disponibilidade mensal de 99,5% e WCAG 2.2 AA.

## Contexto

A empresa solicitou uma aplicação de previsão do tempo para que usuários consultem as condições meteorológicas de cidades. O produto deve permitir busca por cidade, visualização do clima atual e da previsão para cinco dias, escolha entre Celsius e Fahrenheit e uso em dispositivos móveis.

O discovery definiu uma aplicação web comercial responsiva, em pt-BR, com busca mundial, contrato de dados, cache local e metas iniciais de qualidade aprovadas. Permanecem adiados o protocolo/amostra de validação de usabilidade e as restrições de prazo, orçamento e escala, sem bloquear a especificação.

## Personas

As personas abaixo são hipóteses baseadas no briefing, não perfis validados por pesquisa com usuários. Os tempos de sucesso são referências iniciais a validar.

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso pessoal |
| --- | --- | --- | --- |
| **Quem decide na hora** | Saber se o clima atual afeta um deslocamento ou atividade próxima. | Principalmente mobile, em movimento ou pouco antes de sair. | Encontra a condição atual da cidade correta em até 30 segundos, sem precisar repetir a busca. |
| **Quem planeja a semana** | Comparar a previsão dos próximos cinco dias para escolher quando realizar uma atividade. | Desktop para planejar; mobile para consultar depois. | Identifica em até um minuto os dias relevantes da previsão e entende as temperaturas na unidade escolhida. |
| **Quem consulta uma cidade desconhecida** | Buscar o clima de uma cidade que não conhece e confirmar que selecionou o local correto. | Mobile durante uma viagem ou desktop durante o planejamento. | Distingue a cidade desejada entre resultados semelhantes e acessa sua previsão sem selecionar uma localização errada. |

## Decisões

| Decisão | Justificativa | Perguntas em aberto resolvidas |
| --- | --- | --- |
| **Público-alvo: público geral no Brasil; cobertura de busca: mundial.** | Atende ao mercado inicial brasileiro sem restringir as cidades consultáveis a um único país. | Resolve o público inicial e a abrangência geográfica da busca. |
| **Métrica de sucesso: pelo menos 90% de conclusão não assistida em cada tarefa principal de consulta.** | Verifica se usuários conseguem encontrar a cidade e obter clima atual ou previsão. | Define a meta; o protocolo e o tamanho da amostra serão definidos após existir um protótipo, sem bloquear a especificação. |
| **Fonte de dados: Open-Meteo, uso comercial e sem API key.** | Evita configuração de credenciais e foi escolhida para a aplicação comercial. | Define provedor e contexto comercial; termos e condições não são uma pendência para esta etapa, conforme orientação do responsável. |
| **Previsão: resumo diário para hoje e os quatro dias seguintes; detalhe por hora para o dia selecionado, começando por hoje.** | Oferece uma visão geral dos cinco dias e permite consultar detalhe horário. | Define período, granularidade e seleção do dia; os períodos seguem o horário local da cidade. |
| **Fuso e horário de verão: usar o fuso IANA da cidade e as regras locais fornecidas pela fonte.** | Mantém datas e horas coerentes com a localidade consultada. | Define o tratamento de fuso e horário de verão para os períodos diários e horários. |
| **Unidades: Celsius por padrão, com alternância para Fahrenheit apenas nas temperaturas; vento em km/h e precipitação em mm.** | Mantém conversões claras entre grandezas e usa unidades métricas na interface pt-BR. | Define unidades para temperatura, velocidade do vento e precipitação. |
| **Sem autenticação e sem persistência de servidor.** | Mantém o escopo centrado na consulta do clima, sem contas de usuário ou armazenamento de dados no servidor. | Exclui contas e armazenamento no servidor; dados locais ficam no dispositivo, com cache limitado a 24 horas e favoritos/histórico mantidos até remoção pelo usuário. |
| **Idioma e formato local: pt-BR, data DD/MM/AAAA e horário de 24 horas.** | Foca a experiência no público brasileiro e segue convenções locais de apresentação. | Define idioma e formato local de data e hora. |
| **Prioridade do produto: clima atual e previsão de cinco dias têm igual prioridade.** | Mantém as duas capacidades centrais do briefing no escopo inicial. | Resolve a priorização relativa das funcionalidades principais. |
| **Plataforma: aplicação web responsiva para desktop e mobile.** | Atende ao uso em dispositivos móveis e permite acesso por navegador em desktop. | Resolve a decisão entre web responsiva, app nativo ou ambos; a matriz de navegadores está definida abaixo. |
| **Busca manual de cidades no mundo todo, sem localização automática do dispositivo.** | Evita solicitar permissão de geolocalização e mantém o usuário no controle da cidade consultada. | Resolve a decisão sobre localização automática e cobertura geográfica; a apresentação e ordenação de homônimos podem ser refinadas nos critérios de aceite. |
| **Critérios de busca: cidade obrigatória; país e região administrativa opcionais (estado/UF, província ou equivalente).** | Permite iniciar a busca informando apenas a cidade e refinar os resultados com dados adicionais. | Define cidade como único campo obrigatório; país e região administrativa são opcionais. |
| **Resultados de busca: exibir cidade, região, país e fuso horário; priorizar nomes de cidade exatos, desempatar por região e país em ordem alfabética e ordenar os demais resultados alfabeticamente.** | Ajuda a pessoa a distinguir localidades homônimas e torna a ordenação previsível. | Define os dados de desambiguação e a regra de ordenação, inclusive o desempate de nomes exatos coincidentes. |
| **Persistência local: unidade, cache da previsão, favoritos e histórico; cache de até 24 horas com horário da última atualização; atualização online em cada abertura ou consulta; favoritos e histórico até remoção pelo usuário.** | Permite conveniência no mesmo dispositivo e consulta offline limitada, sem criar contas ou persistência no servidor. | Define atualização online, validade do cache offline e retenção local de favoritos/histórico. |
| **Compatibilidade: duas versões mais recentes de Chrome, Edge, Firefox e Safari desktop; última versão estável de Chrome para Android e Safari para iOS no momento de cada teste.** | Define uma matriz inicial de suporte para desktop e mobile. | Define navegadores e política de versão para teste. |
| **Acessibilidade: WCAG 2.2 nível AA.** | Estabelece um critério verificável de acessibilidade. | Define o padrão de acessibilidade para aceite. |
| **Performance: p95 de até 3 s para o fluxo completo, da busca da cidade à exibição do clima atual e da previsão, em rede móvel 4G estável; feedback visual local até 200 ms.** | Mede o tempo percebido para completar a consulta e a resposta imediata da interface. | Define tempos-alvo, escopo de cada medição e condição de rede para o fluxo completo. |
| **Disponibilidade: 99,5% mensal para interface e fluxo funcional com cache; disponibilidade da API externa monitorada separadamente.** | Garante que o app continue útil com dados em cache durante falhas do provedor. | Define o escopo da disponibilidade do produto e separa a medição da API externa. |
| **Atualização online: buscar dados novos em cada abertura ou consulta.** | Prioriza condições recentes sempre que o usuário consultar o app com conexão. | Define quando atualizar dados online; o cache continua sendo usado para o modo offline por até 24 horas. |
| **Falha online com cache disponível: exibir dados locais de até 24 horas com o horário da última atualização e um aviso de falha.** | Mantém informação útil sem apresentá-la como atual. | Define o fallback quando uma consulta online falha e há cache recente. |
| **Dados meteorológicos por visualização: atual com temperatura, condição, sensação térmica, vento e umidade; resumo diário com máxima, mínima e condição; detalhe por hora com temperatura, condição e precipitação.** | Define um contrato inicial de informação para cada nível da previsão. | Resolve os campos por visualização. |
| **Escopo do MVP: sem mapas e sem alertas meteorológicos.** | Mantém a primeira versão focada em busca e consulta da previsão. | Define mapas e alertas como fora da primeira versão. |
| **Prazo, orçamento e escala: sem restrições adicionais para iniciar a especificação.** | Evita bloquear a definição funcional enquanto esses parâmetros ainda não são relevantes. | Adia essas restrições para planejamento antes da implementação ou lançamento. |

## Requisitos Funcionais

- **RF-01 — Buscar cidades:** permitir que o usuário pesquise manualmente cidades do mundo todo informando apenas a cidade como campo obrigatório; país e região administrativa (estado/UF, província ou equivalente) são opcionais. Não detectar automaticamente a localização; exibir cidade, região, país e fuso horário, priorizar nomes de cidade exatos, desempatar por região e país em ordem alfabética e ordenar os demais resultados alfabeticamente.
- **RF-02 — Consultar clima atual:** exibir temperatura, condição meteorológica, sensação térmica, vento e umidade para a cidade selecionada.
- **RF-03 — Consultar previsão:** exibir resumo diário com máxima, mínima e condição para hoje e os quatro dias seguintes; permitir selecionar um dia para consultar, por hora, temperatura, condição e precipitação. A seleção inicial é hoje e os dias seguem o horário local da cidade.
- **RF-04 — Alternar unidades:** permitir alternar entre Celsius e Fahrenheit somente nas temperaturas; exibir velocidade do vento em km/h e precipitação em mm.
- **RF-05 — Informar estados da consulta:** apresentar estados de carregamento, erro quando a consulta falhar e indicação quando a busca não retornar resultados; em falha online, se houver cache de até 24 horas, exibi-lo com o horário da última atualização e aviso de falha.
- **RF-06 — Manter dados no dispositivo:** manter localmente a unidade escolhida, cidades favoritas e histórico de buscas até que o usuário os remova; não sincronizar esses dados por conta ou servidor.
- **RF-07 — Consultar cache offline:** permitir exibir dados meteorológicos armazenados localmente por até 24 horas sem conexão e informar o horário da última atualização.
- **RF-08 — Atualizar dados online:** buscar dados meteorológicos novos sempre que o usuário abrir ou consultar uma cidade com conexão disponível.

## Requisitos Não-Funcionais

- **RNF-01 — Responsividade:** as telas principais devem funcionar em larguras de 320 px a 1440 px, sem rolagem horizontal, e manter controles utilizáveis em dispositivos móveis.
- **RNF-02 — Usabilidade:** em teste, pelo menos 90% dos participantes devem concluir sem ajuda cada tarefa principal de busca, consulta do clima atual e consulta da previsão.
- **RNF-03 — Performance:** em rede móvel 4G estável, 95% dos fluxos devem apresentar cidade, clima atual e previsão em até 3 segundos, incluindo a latência do provedor; o feedback visual local deve ocorrer em até 200 ms.
- **RNF-04 — Acessibilidade:** atender ao WCAG 2.2 nível AA, incluindo navegação por teclado, foco visível, nomes acessíveis para controles e compatibilidade com leitores de tela.
- **RNF-05 — Disponibilidade:** manter disponibilidade mensal de 99,5% para a interface e o fluxo funcional com cache; monitorar separadamente a disponibilidade da API externa.
- **RNF-06 — Compatibilidade:** suportar as duas versões mais recentes de Chrome, Edge, Firefox e Safari desktop, além da última versão estável de Chrome para Android e Safari para iOS no momento de cada teste.

## Riscos

As probabilidades abaixo são estimativas iniciais e devem ser revistas após protótipo e validação da carga esperada.

| Risco | Probabilidade | Impacto | Estratégia de mitigação |
| --- | --- | --- | --- |
| Indisponibilidade, latência ou limites técnicos do provedor meteorológico | média | Alto: consultas podem falhar, ficar lentas ou exceder limites técnicos. | Tratar timeout e falhas; com cache válido de até 24 horas, exibi-lo com horário da última atualização e aviso; sem cache válido, informar erro; monitorar latência e erros. |
| Dados meteorológicos incompletos, imprecisos ou desatualizados | média | Alto: usuários podem tomar decisões com base em condições incorretas ou antigas. | Validar respostas; limitar o cache a 24 horas; exibir horário da última atualização e sinalizar claramente os dados em cache. |
| Busca ambígua entre cidades homônimas ou com grafias semelhantes | baixa | Alto: o usuário pode consultar a previsão de uma localização diferente da pretendida. | Exibir cidade, região, país e fuso nos resultados; priorizar nomes de cidade exatos, desempatar por região e país em ordem alfabética e testar nomes duplicados no escopo mundial. |
| Conversão de fuso local e transições de horário de verão | média | Médio: limites de dias ou horários podem ficar deslocados em localidades com mudanças de horário. | Usar o fuso da cidade selecionada e testar a agregação diária/horária nas transições aplicáveis. |
| Desempenho degradado em redes móveis ou por dependências externas | média | Alto: atrasos podem levar usuários a abandonar a consulta ou repetir ações. | Instrumentar e monitorar o fluxo completo conforme RNF-03; limitar chamadas redundantes; usar timeout e feedback de carregamento; identificar cache sem ocultar a idade dos dados. |
| Experiência incompatível com dispositivos móveis, navegadores ou tecnologias assistivas | média | Alto: parte dos usuários pode não conseguir buscar ou interpretar a previsão. | Testar larguras e orientações na matriz RNF-06; validar navegação por teclado, foco e leitores de tela conforme WCAG 2.2 AA. |
| Solicitações de novas funcionalidades fora do escopo aprovado para o MVP | média | Alto: mudanças não controladas podem causar retrabalho, atrasos e aumento de custo. | Manter mapas e alertas fora do MVP; registrar mudanças de escopo e reavaliar impacto antes de aprová-las. |
| Exposição de favoritos ou histórico local em dispositivos compartilhados | média | Médio: outras pessoas com acesso ao dispositivo podem ver cidades consultadas ou preferências. | Manter dados apenas no dispositivo e oferecer controles claros para remover favoritos e limpar o histórico; não coletar localização automática. |
| Conversão incorreta de Celsius/Fahrenheit ou exibição de unidades fixas erradas | baixa | Médio: temperaturas ou grandezas podem ser interpretadas incorretamente. | Centralizar conversão de temperatura; exibir vento em km/h e precipitação em mm; validar conversões com valores de referência. |

## Perguntas em Aberto

1. **Qual será o protocolo e o tamanho da amostra para avaliar os 90% de conclusão não assistida?** **Status:** adiado para depois da criação do protótipo; não bloqueia a especificação. **Impacto:** a medição de usabilidade não será reproduzível até que amostra e tarefas sejam definidas.
2. **Quais restrições de prazo, orçamento e escala de uso devem ser consideradas?** **Status:** adiado para planejamento antes da implementação ou lançamento; não bloqueia a especificação. **Impacto:** estimativas de custo, capacidade e cronograma precisarão ser revisadas quando esses dados estiverem disponíveis.

## Suposições

- A aplicação web responsiva é comercial e tem o público geral brasileiro como mercado inicial, com busca de cidades em qualquer país.
- A busca é manual, exige apenas a cidade, aceita país e região administrativa opcionais, exibe região/país/fuso nos resultados e não solicita localização automática do dispositivo.
- Clima atual e previsão são apresentados para uma cidade selecionada.
- Os períodos diários e horários seguem o fuso IANA da cidade e as regras locais de horário de verão fornecidas pela fonte.
- A troca entre Celsius e Fahrenheit afeta somente temperaturas; vento é exibido em km/h e precipitação em mm.
- A aplicação informará ao usuário quando uma consulta falhar ou não produzir resultados.
- Não haverá login nem persistência em servidor; unidade, cache, favoritos e histórico serão armazenados localmente. O cache offline terá validade máxima de 24 horas e exibirá o horário da última atualização; quando online, os dados serão atualizados em cada abertura ou consulta.
- Favoritos e histórico ficam armazenados localmente até que o usuário os remova.
- Mapas e alertas meteorológicos estão fora do escopo do MVP.
- A interface usa datas no formato DD/MM/AAAA e horários de 24 horas; são suportadas as duas versões mais recentes de Chrome, Edge, Firefox e Safari desktop, além da última versão estável de Chrome para Android e Safari para iOS no momento de cada teste.
- O critério inicial de sucesso exige 90% de conclusão sem ajuda em cada tarefa principal; o p95 de 3 segundos mede o fluxo completo de busca até a exibição de clima e previsão em 4G estável.
- A matriz de compatibilidade cobre as duas versões mais recentes de Chrome, Edge, Firefox e Safari desktop, além da última versão estável de Chrome para Android e Safari para iOS no momento de cada teste.
- O protocolo de validação de usabilidade e as restrições de prazo, orçamento e escala serão definidos em etapas posteriores.
- O Open-Meteo será usado comercialmente, sem API key; os termos e condições não são uma pendência nesta etapa, conforme orientação do responsável.
- As personas e suas métricas de sucesso são hipóteses até serem validadas com usuários.
