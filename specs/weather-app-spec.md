# Especificação de Produto: Aplicação de Previsão do Tempo

## Overview

Aplicação web comercial, responsiva e em pt-BR para o público geral no Brasil consultar manualmente o clima de cidades em qualquer lugar do mundo. O produto deve ajudar tanto quem precisa decidir uma atividade imediata quanto quem planeja os próximos dias ou consulta uma localidade desconhecida.

As duas capacidades centrais, com igual prioridade no MVP, são:

- Consultar o clima atual de uma cidade selecionada.
- Consultar o resumo diário de hoje e dos quatro dias seguintes e o detalhe por hora de um dia selecionado.

A experiência usa Celsius por padrão, oferece Fahrenheit para temperaturas, não exige conta e não solicita a localização do dispositivo. Preferências, cache, favoritos e histórico ficam somente no dispositivo. A fonte meteorológica definida é Open-Meteo, para uso comercial sem API key.

## Functional Requirements

- **RF-01 — Buscar cidades:** permitir busca manual de cidades no mundo todo. Cidade é obrigatória; país e região administrativa (estado/UF, província ou equivalente) são opcionais. Não detectar a localização do dispositivo. Cada resultado deve apresentar cidade, região, país e fuso horário; metadados regionais ausentes devem ser identificados e resultados sem coordenadas ou fuso IANA não podem ser selecionados. Considera-se correspondência exata o nome da cidade após remover espaços externos e comparar sem diferenciar maiúsculas/minúsculas ou acentos, mantendo pontuação. Resultados exatos precedem os demais; os exatos são ordenados por região e depois país, e os demais por nome da cidade, região e país, usando ordenação alfabética pt-BR sem diferenciar caixa ou acentos. Campos ausentes ficam ao final; empates em todos os campos mantêm a ordem recebida do serviço.
- **RF-02 — Consultar clima atual:** para a cidade selecionada, apresentar temperatura, condição meteorológica localizada em pt-BR, sensação térmica, velocidade do vento em km/h e umidade relativa em porcentagem. Interpretar códigos de condição conforme a tabela WMO publicada pelo provedor; código não reconhecido é tratado como condição indisponível.
- **RF-03 — Consultar previsão:** apresentar máxima, mínima e condição localizada em pt-BR para hoje e os quatro dias seguintes. Permitir selecionar qualquer um desses dias para consultar por hora temperatura, condição e precipitação em mm. O dia selecionado inicialmente é hoje; datas e horas seguem o horário local da cidade e são apresentados em formato DD/MM/AAAA e 24 horas.
- **RF-04 — Alternar unidades:** oferecer Celsius como unidade inicial e permitir alternar temperaturas entre Celsius e Fahrenheit. Converter a partir do valor de origem sem arredondamento intermediário e arredondar apenas o valor final exibido para uma casa decimal, usando vírgula decimal em pt-BR e empate arredondado para longe de zero. A alternância afeta apenas temperaturas; vento permanece em km/h e precipitação em mm.
- **RF-05 — Informar estados da consulta:** distinguir carregamento, busca sem resultados e falha técnica. Uma resposta de geocoding vazia apresenta estado sem resultados; falha ou timeout de geocoding apresenta erro de busca e não usa cache meteorológico. Se a consulta de clima atual ou previsão falhar, exibir cache válido de até 24 horas com o horário da última atualização e aviso de falha; sem cache válido, informar erro sem apresentar dados antigos como atuais.
- **RF-06 — Manter dados no dispositivo:** manter localmente a unidade escolhida, cidades favoritas e histórico de consultas meteorológicas. Registrar uma cidade no histórico somente quando o usuário a seleciona e dados válidos são exibidos online ou do cache; uma busca sem seleção ou consulta que falhe não cria entrada. Manter uma única entrada por localidade, identificada por coordenadas e fuso IANA, e movê-la para o início em cada consulta bem-sucedida. Ordenar o histórico do mais recente para o mais antigo. Favoritos e histórico permanecem até remoção pelo usuário e podem ser selecionados para reconsultar uma cidade. Não exigir autenticação nem sincronizar esses dados por conta ou servidor.
- **RF-07 — Consultar cache offline:** sem conexão, permitir consultar dados meteorológicos armazenados localmente por até 24 horas e informar quando foram atualizados pela última vez. Ao abrir offline, selecionar a cidade mais recente do histórico e exibir seu cache se ainda válido; sem histórico ou cache válido, informar que não há dados offline recentes e aguardar ação manual. Dados com mais de 24 horas não são cache válido para essa finalidade.
- **RF-08 — Atualizar dados online:** quando houver conexão, buscar dados meteorológicos novos para a cidade mais recente do histórico ao abrir a aplicação e a cada consulta de uma cidade. Se o histórico estiver vazio, aguardar a busca manual do usuário; não selecionar uma cidade automaticamente.

## User Stories

- **US-01 (RF-01) — Quem consulta uma cidade desconhecida:** Como pessoa que consulta uma cidade desconhecida, quero pesquisar cidades e comparar região, país e fuso horário nos resultados para selecionar a localidade correta.
- **US-02 (RF-02) — Quem decide na hora:** Como pessoa que decide na hora, quero consultar temperatura, condição, sensação térmica, vento e umidade da cidade escolhida para avaliar se o clima afeta meu deslocamento ou atividade próxima.
- **US-03 (RF-03) — Quem planeja a semana:** Como pessoa que planeja a semana, quero comparar o resumo dos próximos cinco dias e consultar detalhes por hora para escolher quando realizar uma atividade.
- **US-04 (RF-04) — Quem planeja a semana:** Como pessoa que planeja a semana, quero alternar entre Celsius e Fahrenheit para comparar as temperaturas na unidade que prefiro.
- **US-05 (RF-05, RF-07) — Quem decide na hora:** Como pessoa que decide na hora, quero receber aviso quando uma consulta falhar e ver dados locais recentes com seu horário de atualização para avaliar se ainda são úteis para minha decisão.
- **US-06 (RF-06) — Quem consulta uma cidade desconhecida:** Como pessoa que consulta uma cidade desconhecida, quero guardar cidades favoritas e rever ou remover meu histórico neste dispositivo para retornar às localidades de interesse sem criar uma conta.
- **US-07 (RF-07) — Quem planeja a semana:** Como pessoa que planeja a semana, quero consultar a previsão armazenada por até 24 horas quando estiver sem conexão para continuar meu planejamento sabendo quando os dados foram atualizados.
- **US-08 (RF-08) — Quem decide na hora:** Como pessoa que decide na hora, quero que a previsão seja atualizada ao abrir a aplicação ou consultar uma cidade com conexão para tomar decisões com dados recentes.

## Acceptance Criteria

Cada requisito funcional tem cenários verificáveis em uma frase no formato Dado/Quando/Então. Os critérios de métricas globais de qualidade estão em Non-Functional Requirements.

### RF-01 — Buscar cidades

- **CA-01.1 — Busca só por cidade:** Dado que o formulário de busca está disponível, quando a pessoa informa uma cidade e deixa país e região vazios, então a busca é enviada e os resultados correspondentes são apresentados.
- **CA-01.2 — Filtros opcionais:** Dado que o formulário de busca está disponível, quando a pessoa informa uma cidade e também um país ou região administrativa, então os critérios informados são usados na busca e os resultados exibidos correspondem a eles.
- **CA-01.3 — Busca sem localização do dispositivo:** Dado que a permissão de localização do dispositivo não foi concedida, quando a pessoa pesquisa uma cidade, então a busca é concluída sem solicitar essa permissão.
- **CA-01.4 — Dados dos resultados:** Dado que o serviço de busca retorna resultados com cidade, região, país e fuso horário, quando a lista de resultados é exibida, então cada resultado mostra esses quatro dados para identificação da localidade.
- **CA-01.5 — Ordenação dos resultados:** Dado que a busca retorna nomes exatos e não exatos com regiões e países distintos, quando a lista é exibida, então os exatos aparecem primeiro ordenados por região e país, os demais por nome da cidade, região e país, em ordem alfabética pt-BR sem diferenciar caixa ou acentos; campos ausentes ficam ao final e empates completos preservam a ordem do serviço.
- **CA-01.6 — Busca sem resultados:** Dado que o serviço de busca retorna uma lista vazia, quando a busca termina, então a interface informa que não encontrou cidades e não seleciona nenhuma cidade.
- **CA-01.7 — Cidade obrigatória:** Dado que o campo de cidade está vazio, quando a pessoa tenta iniciar uma busca, então a busca não é enviada e a interface informa que o nome da cidade é obrigatório.
- **CA-01.8 — Metadados regionais ausentes:** Dado que um resultado não contém região administrativa ou país, quando a lista é exibida, então cada campo ausente aparece como “Não informado” e o resultado permanece selecionável se tiver coordenadas e fuso IANA.
- **CA-01.9 — Coordenadas ou fuso ausentes:** Dado que um resultado não contém coordenadas ou fuso IANA, quando a lista é exibida, então o resultado não pode ser selecionado, o fuso aparece como “Fuso horário indisponível” quando ausente e a interface informa que não é possível consultar a previsão local dessa cidade.
- **CA-01.10 — Correspondência exata normalizada:** Dado que a consulta e o nome de uma cidade diferem somente em espaços externos, caixa ou acentos, quando os resultados são ordenados, então essa cidade é tratada como correspondência exata; diferenças de pontuação continuam significativas.

### RF-02 — Consultar clima atual

- **CA-02.1 — Campos do clima atual:** Dado que uma cidade foi selecionada e o serviço retornou dados atuais para ela, quando a visualização do clima atual é apresentada, então são exibidos o nome da cidade, temperatura, condição localizada em pt-BR, sensação térmica, velocidade do vento em km/h e umidade relativa em porcentagem.
- **CA-02.2 — Unidades do clima atual:** Dado que os dados atuais incluem temperatura e velocidade do vento, quando a visualização do clima atual é apresentada, então o vento é identificado em km/h e a temperatura é identificada na unidade selecionada.
- **CA-02.3 — Localidade selecionada:** Dado que existem duas cidades homônimas nos resultados e a pessoa seleciona uma delas, quando os dados atuais são carregados, então a cidade e os dados exibidos correspondem à localidade selecionada.
- **CA-02.4 — Resposta atual parcial:** Dado que uma resposta contém campo ausente, valor não numérico ou não finito em medição numérica, umidade fora de 0–100%, vento negativo ou código de condição desconhecido, quando os dados são exibidos, então cada campo inválido ou ausente é marcado como “Indisponível”, os demais campos válidos permanecem visíveis e a visualização é marcada como incompleta.

### RF-03 — Consultar previsão

- **CA-03.1 — Período diário:** Dado que a previsão foi carregada para uma cidade com data local conhecida, quando a lista de dias é apresentada, então ela contém exatamente cinco datas consecutivas: a data local de hoje e as quatro datas locais seguintes.
- **CA-03.2 — Resumo de cada dia:** Dado que a previsão retornou dados para os cinco dias, quando os resumos diários são apresentados, então cada dia mostra temperaturas máxima e mínima na unidade selecionada e condição localizada em pt-BR.
- **CA-03.3 — Seleção inicial:** Dado que a previsão dos cinco dias foi carregada, quando a pessoa abre a visualização de detalhe diário, então o dia selecionado inicialmente é hoje no horário local da cidade.
- **CA-03.4 — Detalhe por hora:** Dado que a previsão contém dados horários para um dos cinco dias, quando a pessoa seleciona esse dia, então são exibidos, para cada horário retornado nesse dia, temperatura, condição e precipitação.
- **CA-03.5 — Fuso e horário de verão:** Dado que a fonte fornece o fuso IANA e as regras locais da cidade para o período consultado, quando datas e horários da previsão são apresentados, então os valores correspondem à data e hora locais da cidade, inclusive em uma transição de horário de verão coberta pela fonte.
- **CA-03.6 — Unidades da previsão:** Dado que a previsão diária e horária foi carregada, quando seus valores são apresentados, então a precipitação é identificada em mm e todas as temperaturas usam a unidade selecionada.
- **CA-03.7 — Resposta de previsão parcial:** Dado que uma resposta diária ou horária contém campo ausente, medição numérica não finita, precipitação ou vento negativos, código de condição desconhecido, máxima diária abaixo da mínima ou timestamp que não pertence ao dia local solicitado, quando a previsão é exibida, então cada campo inválido ou ausente é marcado como “Indisponível”, os demais campos válidos permanecem visíveis e o dia ou horário afetado é marcado como incompleto.

### RF-04 — Alternar unidades

- **CA-04.1 — Unidade padrão:** Dado que não há uma unidade salva no dispositivo, quando temperaturas são carregadas pela primeira vez, então elas são exibidas em Celsius.
- **CA-04.2 — Alternância de unidade:** Dado que a aplicação exibe temperaturas em Celsius, quando a pessoa seleciona Fahrenheit, então todas as temperaturas atuais, diárias e horárias visíveis passam a Fahrenheit.
- **CA-04.3 — Conversão verificável:** Dado que a temperatura de entrada é 0 °C, quando a pessoa seleciona Fahrenheit, então a temperatura correspondente é exibida como 32,0 °F.
- **CA-04.4 — Conversões adicionais:** Dado que as temperaturas de entrada são 100 °C e -40 °C, quando a pessoa seleciona Fahrenheit, então os valores correspondentes são exibidos como 212,0 °F e -40,0 °F, respectivamente.
- **CA-04.5 — Grandezas não afetadas:** Dado que a interface exibe vento em km/h e precipitação em mm, quando a pessoa alterna entre Celsius e Fahrenheit, então os valores de vento e precipitação e suas unidades permanecem inalterados.
- **CA-04.6 — Preferência persistida:** Dado que a pessoa selecionou Fahrenheit e a aplicação salvou essa preferência no dispositivo, quando a aplicação é fechada e aberta novamente no mesmo dispositivo e navegador, então as temperaturas são exibidas em Fahrenheit.
- **CA-04.7 — Arredondamento de empate:** Dado que a temperatura de origem é 20,25 °C e a interface está configurada para Fahrenheit, quando o valor é convertido e formatado, então é exibido como 68,5 °F, com uma casa decimal.

### RF-05 — Informar estados da consulta

- **CA-05.1 — Carregamento:** Dado que uma busca ou atualização online foi iniciada e ainda não terminou, quando se passam 200 ms desde o início da ação, então a interface apresenta uma indicação visível de carregamento.
- **CA-05.2 — Falha sem cache válido:** Dado que uma consulta online falha e não existe cache de até 24 horas para a cidade, quando a falha é recebida, então a interface informa que os dados não puderam ser carregados e não apresenta dados antigos como atuais.
- **CA-05.3 — Falha com cache válido:** Dado que uma consulta online falha e existe cache da cidade atualizado há no máximo 24 horas, quando a falha é recebida, então a interface apresenta o cache, a data e hora da última atualização e um aviso de falha da atualização.
- **CA-05.4 — Identificação do cache:** Dado que há dados meteorológicos apresentados a partir do cache, quando a pessoa consulta a visualização, então a interface identifica explicitamente que os dados estão em cache e mostra quando foram atualizados.
- **CA-05.5 — Timeout meteorológico:** Dado que uma solicitação de clima atual ou previsão foi iniciada e não recebeu resposta, quando se completam 8 segundos, então a solicitação é encerrada, a interface informa que a consulta demorou demais e aplica o fallback meteorológico definido em RF-05.
- **CA-05.6 — Falha de geocoding:** Dado que a solicitação de geocoding retorna erro ou timeout, quando a tentativa termina sem resposta válida, então a interface apresenta erro de busca distinto do estado sem resultados e não apresenta cache meteorológico como resultado da busca.

### RF-06 — Manter dados no dispositivo

- **CA-06.1 — Persistência local:** Dado que uma unidade, um favorito e uma entrada no histórico foram salvos no dispositivo, quando a aplicação é fechada e reaberta no mesmo dispositivo e navegador, então esses dados continuam disponíveis até serem removidos pelo usuário.
- **CA-06.2 — Remoção pelo usuário:** Dado que existe uma cidade salva como favorita ou no histórico, quando a pessoa remove o favorito ou limpa/remove a entrada do histórico, então o item deixa de aparecer na respectiva lista após a ação.
- **CA-06.3 — Uso sem conta:** Dado que a pessoa abre a aplicação pela primeira vez, quando busca uma cidade e salva um favorito, então consegue concluir essas ações sem criar conta ou iniciar sessão.
- **CA-06.4 — Ausência de sincronização em servidor:** Dado que a pessoa salva ou altera unidade, favoritos ou histórico, quando a ação é concluída, então a aplicação não envia esses dados para sincronização ou armazenamento em servidor.
- **CA-06.5 — Reconsultar favorito ou histórico:** Dado que uma cidade consta nos favoritos ou no histórico, quando a pessoa seleciona essa cidade, então seus dados meteorológicos são exibidos e, se houver conexão, uma atualização online é iniciada; sem conexão, aplica-se RF-07.
- **CA-06.6 — Ordem e deduplicação do histórico:** Dado que a mesma localidade foi consultada com sucesso mais de uma vez e há outras localidades no histórico, quando a lista é exibida, então há uma única entrada para essa localidade ordenada pela consulta bem-sucedida mais recente.

### RF-07 — Consultar cache offline

- **CA-07.1 — Cache dentro da validade:** Dado que o dispositivo está sem conexão e há dados da cidade salvos há exatamente 24 horas ou menos, quando a pessoa consulta essa cidade, então os dados salvos e a data e hora da última atualização são apresentados.
- **CA-07.2 — Identificação de dados offline:** Dado que dados meteorológicos são apresentados sem conexão a partir do cache, quando a visualização é exibida, então a interface identifica que os dados não foram atualizados pela rede e mostra seu horário de atualização.
- **CA-07.3 — Cache expirado ou ausente:** Dado que o dispositivo está sem conexão e o cache da cidade tem mais de 24 horas ou não existe, quando a pessoa consulta essa cidade, então os dados expirados não são apresentados como válidos e a interface informa que não há dados offline recentes disponíveis.
- **CA-07.4 — Abertura offline com histórico:** Dado que a aplicação é aberta sem conexão, o histórico contém uma cidade e o cache dessa cidade tem até 24 horas, quando a inicialização termina, então a aplicação seleciona a cidade mais recente e apresenta o cache com o horário da última atualização.
- **CA-07.5 — Abertura offline sem cache válido:** Dado que a aplicação é aberta sem conexão e não há histórico ou o cache da cidade mais recente está ausente ou expirado, quando a inicialização termina, então a interface informa que não há dados offline recentes, não inicia uma consulta de rede e permite selecionar manualmente um favorito ou iniciar uma busca quando houver conexão.

### RF-08 — Atualizar dados online

- **CA-08.1 — Atualização na abertura:** Dado que há conexão e o histórico contém ao menos uma cidade, quando a aplicação é aberta, então a cidade mais recente do histórico é selecionada e são solicitados clima atual e resumo da previsão de cinco dias para ela.
- **CA-08.2 — Atualização por consulta:** Dado que há conexão e a pessoa seleciona uma cidade, quando a consulta dessa cidade é iniciada, então a aplicação solicita clima atual e resumo da previsão de cinco dias para a cidade selecionada.
- **CA-08.3 — Resultado atualizado e cache:** Dado que uma consulta online retorna dados com sucesso, quando a resposta é processada, então os dados retornados são apresentados e armazenados localmente com a data e hora da atualização.
- **CA-08.4 — Falha ou demora:** Dado que uma consulta online falha ou não retorna dados, quando a tentativa termina sem sucesso, então a interface não indica que os dados foram atualizados e aplica o estado de erro e o fallback definidos em RF-05.
- **CA-08.5 — Abertura sem histórico:** Dado que há conexão e o histórico está vazio, quando a aplicação é aberta, então nenhuma cidade é selecionada nem consultada automaticamente e a interface aguarda a busca manual, sem solicitar localização do dispositivo.

## Non-Functional Requirements

- **RNF-01 — Responsividade:** as telas principais funcionam de 320 px a 1440 px de largura, sem rolagem horizontal, e mantêm os controles utilizáveis em dispositivos móveis.
- **RNF-02 — Usabilidade:** pelo menos 90% dos participantes concluem sem ajuda cada tarefa principal: buscar uma cidade, consultar o clima atual e consultar a previsão. O protocolo e o tamanho da amostra serão definidos após a criação do protótipo.
- **RNF-03 — Performance:** em rede móvel 4G estável, o p95 do fluxo completo, da busca à exibição da cidade, clima atual e previsão, é de até 3 segundos, incluindo a latência do provedor. O feedback visual local ocorre em até 200 ms.
- **RNF-04 — Acessibilidade:** atender ao WCAG 2.2 nível AA, incluindo navegação por teclado, foco visível, nomes acessíveis para controles e compatibilidade com leitores de tela.
- **RNF-05 — Disponibilidade:** disponibilidade mensal de 99,5% para a interface e o fluxo funcional com cache. A disponibilidade da API externa é monitorada separadamente.
- **RNF-06 — Compatibilidade:** suportar as duas versões mais recentes de Chrome, Edge, Firefox e Safari desktop, além da versão estável mais recente de Chrome para Android e Safari para iOS no momento de cada teste.
- **RNF-07 — Localização:** interface em pt-BR, datas no formato DD/MM/AAAA e horários no formato de 24 horas.
- **RNF-08 — Privacidade e armazenamento:** não exigir conta, não persistir dados do usuário em servidor e manter localmente apenas unidade, cache, favoritos e histórico conforme RF-06 e RF-07.

## Rastreabilidade

| User Story | Acceptance Criteria | RNFs relevantes |
| --- | --- | --- |
| US-01 — Buscar e distinguir cidades | CA-01.1–CA-01.10 | RNF-01, RNF-02, RNF-03, RNF-04, RNF-06 |
| US-02 — Consultar clima atual | CA-02.1–CA-02.4 | RNF-01, RNF-02, RNF-03, RNF-04, RNF-06, RNF-07 |
| US-03 — Planejar os próximos dias | CA-03.1–CA-03.7 | RNF-01, RNF-02, RNF-03, RNF-04, RNF-06, RNF-07 |
| US-04 — Alternar unidades | CA-04.1–CA-04.7 | RNF-01, RNF-04, RNF-06, RNF-07 |
| US-05 — Entender falhas e usar dados recentes | CA-05.1–CA-05.6; CA-07.1–CA-07.5 | RNF-01, RNF-03, RNF-04, RNF-05, RNF-06, RNF-08 |
| US-06 — Manter favoritos e histórico | CA-06.1–CA-06.6 | RNF-01, RNF-04, RNF-06, RNF-08 |
| US-07 — Consultar previsão offline | CA-05.2–CA-05.4; CA-07.1–CA-07.5 | RNF-01, RNF-04, RNF-05, RNF-06, RNF-08 |
| US-08 — Atualizar dados online | CA-05.2–CA-05.5; CA-08.1–CA-08.5 | RNF-01, RNF-03, RNF-04, RNF-05, RNF-06, RNF-07 |

## Edge Cases

- **Geocoding sem resultados (inclui cidade inexistente):** se o serviço retornar uma lista vazia, informar que nenhuma cidade foi encontrada, permitir editar a busca e não selecionar outra localidade nem apresentar resultados aproximados como correspondências exatas.
- **Input vazio:** se o campo de cidade estiver vazio ou contiver apenas espaços, não iniciar a busca e solicitar que a pessoa informe uma cidade.
- **Caracteres especiais:** aceitar nomes com acentos, espaços, apóstrofos e hífens sem quebrar a interface nem interpretar os caracteres como comandos. Para comparar nomes exatos, remover espaços externos e ignorar diferenças de caixa e acentos, mantendo a pontuação; se não houver correspondências, apresentar o estado sem resultados.
- **Falha de API:** se o serviço de geocoding ou de previsão retornar erro, informar que a consulta falhou. Para dados meteorológicos, exibir cache de até 24 horas com seu horário de atualização e aviso de falha, se disponível; sem cache válido, não apresentar dados como atuais.
- **Timeout:** se o serviço de geocoding ou previsão não responder em 8 segundos, encerrar a tentativa, informar que a consulta demorou demais e aplicar o mesmo fallback da falha de API.
- **Cidades homônimas:** exibir região, país e fuso em cada resultado e aplicar a ordenação de RF-01; a seleção explícita determina a cidade consultada.
- **Busca parcialmente especificada:** aceitar cidade sem país/região e aceitar país ou região como refinadores opcionais quando informados.
- **Metadados geográficos ausentes:** se região ou país estiverem ausentes, exibir “Não informado”. Se faltarem coordenadas ou fuso IANA, exibir o resultado como não selecionável e explicar que não é possível consultar a previsão local.
- **Conexão ausente:** permitir consulta de cache com até 24 horas; informar quando não houver cache para a cidade ou quando os dados tiverem expirado.
- **Resposta parcial ou inválida:** tratar como inválida uma medição numérica não finita, umidade fora de 0–100%, vento ou precipitação negativos, máxima diária abaixo da mínima, timestamp fora do dia local solicitado ou código de condição não reconhecido pela tabela WMO do provedor. Marcar o campo afetado como “Indisponível”, preservar os demais campos válidos e identificar a visualização como incompleta; descartar o payload inteiro somente quando a estrutura não puder ser interpretada e então aplicar RF-05.
- **Transição de horário de verão:** dias e horas seguem o fuso IANA e as regras locais fornecidos pela fonte, inclusive quando houver hora local inexistente ou repetida.
- **Limite de dia local:** a previsão de hoje e dos quatro dias seguintes é determinada pela data local da cidade selecionada, que pode diferir da data do dispositivo.
- **Mudança de unidade:** converter somente temperaturas; preservar km/h para vento e mm para precipitação.
- **Dados locais removidos pelo navegador ou dispositivo:** se unidade, favoritos, histórico ou cache não estiverem mais disponíveis, continuar sem eles e permitir nova consulta quando houver conexão.
- **Falha de armazenamento local:** informar indisponibilidade do recurso local quando afetar a consulta offline ou a retenção de preferências; a consulta online não deve ser apresentada como persistida se o cache não puder ser salvo.

## Assumptions

- O produto é uma aplicação web comercial para o público geral no Brasil, com busca manual mundial.
- Open-Meteo é a fonte de dados meteorológicos, será usado comercialmente e não requer API key para o escopo definido; a adequação de termos e condições foi considerada resolvida nesta etapa conforme orientação do responsável.
- Clima atual e previsão têm a mesma prioridade no MVP.
- Períodos diários e horários seguem o fuso IANA e as regras de horário de verão fornecidos pela fonte.
- Celsius é a unidade padrão; Fahrenheit é opcional somente para temperaturas. Vento usa km/h e precipitação usa mm.
- Unidade, cache, favoritos e histórico são locais ao dispositivo; favoritos e histórico permanecem até remoção pelo usuário. Cache meteorológico é válido por no máximo 24 horas e deve mostrar o horário da última atualização.
- Dados online são atualizados a cada abertura ou consulta de cidade quando houver conexão.
- As personas e suas métricas individuais são hipóteses baseadas no briefing, ainda não validadas por pesquisa.
- Prazo, orçamento e escala não impõem restrições para produzir esta especificação; serão definidos antes do planejamento de implementação ou lançamento.
- A matriz de navegadores e dispositivos é a definida em RNF-06.

## Risks

As probabilidades são estimativas iniciais e devem ser revistas após protótipo e validação da carga esperada.

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Indisponibilidade, latência ou limites técnicos do provedor | Média | Alto: consultas podem falhar, atrasar ou exceder limites técnicos. | Tratar falhas e timeout; usar cache válido com data/hora e aviso; sem cache válido, informar erro; monitorar latência e erros. |
| Dados incompletos, imprecisos ou desatualizados | Média | Alto: decisões podem ser tomadas com informação incorreta ou antiga. | Validar respostas, limitar cache a 24 horas e identificar claramente a idade dos dados. |
| Seleção de cidade homônima incorreta | Baixa | Alto: o usuário pode interpretar a previsão de outra localidade como sendo a desejada. | Exibir cidade, região, país e fuso; ordenar os resultados conforme RF-01 e testar buscas com nomes duplicados. |
| Conversão de fuso ou horário de verão incorreta | Média | Médio: dias e horários podem aparecer deslocados. | Usar o fuso da cidade e validar períodos diários/horários em transições aplicáveis. |
| Desempenho degradado em rede móvel ou por dependências externas | Média | Alto: atrasos podem levar à desistência ou repetição de consultas. | Medir o fluxo conforme RNF-03, limitar chamadas redundantes e fornecer feedback de carregamento e fallback identificável. |
| Incompatibilidade com dispositivos, navegadores ou tecnologias assistivas | Média | Alto: usuários podem não conseguir consultar ou interpretar a previsão. | Testar a matriz RNF-06, larguras responsivas, teclado, foco e leitores de tela conforme WCAG 2.2 AA. |
| Exposição de favoritos ou histórico em dispositivo compartilhado | Média | Médio: outras pessoas com acesso ao dispositivo podem ver consultas anteriores. | Manter os dados localmente e oferecer remoção de favoritos e limpeza do histórico; não solicitar localização automática. |
| Conversão incorreta de temperatura ou apresentação de unidade fixa errada | Baixa | Médio: grandezas podem ser interpretadas incorretamente. | Verificar conversões com valores de referência e manter vento em km/h e precipitação em mm. |
| Expansão de escopo fora do MVP | Média | Alto: mudanças não controladas podem causar retrabalho e atrasos. | Manter explicitamente mapas e alertas fora do MVP e avaliar impacto antes de aprovar mudanças. |

## Out of Scope

- Mapas meteorológicos.
- Alertas meteorológicos.
- Histórico de condições meteorológicas passadas e previsões para além de hoje e dos quatro dias seguintes.
- Comparação simultânea de clima ou previsão entre cidades diferentes.
- Aplicativo nativo para iOS ou Android; o produto especificado é web responsivo.
- Localização automática ou solicitação de permissão de geolocalização do dispositivo.
- Idiomas diferentes de pt-BR.
- Contas, autenticação, sincronização entre dispositivos ou persistência de dados do usuário em servidor.
- Unidades diferentes de Celsius/Fahrenheit para temperatura, km/h para vento e mm para precipitação.
- Definição do protocolo e tamanho da amostra do teste de usabilidade nesta etapa.
- Definição de prazo, orçamento e escala operacional nesta etapa.

## Open Questions

1. **Qual protocolo, conjunto de tarefas e tamanho de amostra serão usados para medir a meta de 90% de conclusão não assistida?** Adiado até existir um protótipo; não bloqueia a especificação, mas precisa ser definido para tornar a avaliação reproduzível.
2. **Quais são as restrições de prazo, orçamento e escala esperada de uso?** Adiado para o planejamento antes da implementação ou lançamento; necessário para estimativas de custo, capacidade e cronograma.

## Referências de Mercado

As referências públicas abaixo orientam a interpretação dos dados e a apresentação. Os limites de cache e timeout são decisões específicas do produto, não garantias das fontes citadas.

- [Open-Meteo Forecast API](https://open-meteo.com/en/docs): referência para unidades, campos meteorológicos, previsões horárias/diárias, fuso horário e códigos de condição baseados em WMO.
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api): referência para metadados de localidades, coordenadas e fuso horário retornados pela busca.
- [Unicode CLDR — Collation Guidelines](https://cldr.unicode.org/index/cldr-spec/collation-guidelines): referência de mercado para ordenação linguística; esta spec define pt-BR, normalização, desempates e posição de campos ausentes.
- [ECMA-402 — Internationalization API Specification](https://tc39.es/ecma402/): referência para formatação numérica localizada; esta spec fixa uma casa decimal, vírgula decimal pt-BR e arredondamento de empates para longe de zero.