import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// TOKENS DE DESIGN — edite aqui para mudar paleta/tipografia
// ─────────────────────────────────────────────────────────────────

const T = {
  bg:        "#0A0212",
  purple:    "#5A0273",
  magenta:   "#A6037A",
  crimson:   "#8C0343",
  orange:    "#F27B13",
  white:     "#ffffff",
  text:      "rgba(255,255,255,0.72)",
  textMuted: "rgba(255,255,255,0.42)",
  textFaint: "rgba(255,255,255,0.25)",
  border:    "rgba(255,255,255,0.08)",
  glass:     "rgba(255,255,255,0.04)",
};

// ─────────────────────────────────────────────────────────────────
// ESTILOS GLOBAIS
// ─────────────────────────────────────────────────────────────────

const CSS_BASE = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { scroll-behavior: smooth; scroll-padding-top: 96px; overflow-x: hidden; width: 100%; }
  img, video { max-width: 100%; height: auto; display: block; }
  a { color: inherit; text-decoration: none; }
  section[id] { scroll-margin-top: 96px; }
  ::selection { background: #8C034355; color: #fff; }

  @keyframes pulse-ring {
    0%   { transform: scale(.9); opacity: .7; }
    70%  { transform: scale(1.4); opacity: 0; }
    100% { opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
  }

  @keyframes liquid-flow {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
  }

  /* Gradiente animado no texto */
  .text-gradient {
    background: linear-gradient(135deg, #fff 30%, #F27B13 60%, #A6037A 100%);
    background-size: 200% 200%;
    animation: gradientShift 5s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Blob decorativo */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
`;

// Estilos da Home (responsividade)
const CSS_HOME = `
  .nav-links { display: flex; gap: 0.25rem; align-items: center; }
  .nav-ham   { display: none; }
  .mob-menu  { display: none; }

  .nav-link {
    display: inline-block;
    background: none;
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.55);
    cursor: pointer;
    white-space: nowrap;
    transition: color .2s, border-color .2s, background .2s;
    text-decoration: none;
    font-family: inherit;
    line-height: 1;
  }
  .nav-link:hover {
    color: #F27B13;
    border-color: rgba(242,123,19,0.15);
  }
  .nav-link.active {
    background: rgba(242,123,19,0.12);
    border-color: rgba(242,123,19,0.28);
    color: #fff;
    font-weight: 600;
  }
  .mob-link {
    display: block;
    background: none;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,.05);
    border-left: 3px solid transparent;
    padding: 14px 2rem;
    text-align: left;
    font-size: 15px;
    font-weight: 500;
    color: rgba(255,255,255,.75);
    cursor: pointer;
    font-family: inherit;
    text-decoration: none;
    transition: all .2s;
    width: 100%;
  }
  .mob-link.active {
    background: rgba(242,123,19,0.1);
    border-left-color: #F27B13;
    color: #fff;
    font-weight: 600;
  }
  .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
  .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .grid-cases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; align-items: stretch; }
  .outros-card { min-width: 280px; max-width: 300px; scroll-snap-align: start; flex-shrink: 0; }
  .grid-contact { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
  .grid-feedback { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

  @media (max-width: 1024px) {
    .grid-cases { grid-template-columns: repeat(2, 1fr) !important; }
  }

  @media (max-width: 900px) {
    .grid-contact { grid-template-columns: 1fr 1fr !important; }
  }

  @media (max-width: 768px) {
    .nav-links  { display: none; }
    .nav-ham    {
      display: flex; align-items: center; justify-content: center;
      background: none; border: 1px solid rgba(255,255,255,.15); border-radius: 8px;
      width: 36px; height: 36px; cursor: pointer; color: rgba(255,255,255,.7); font-size: 18px;
      flex-shrink: 0;
    }
    .mob-menu {
      display: flex; flex-direction: column; position: fixed; top: 60px; left: 0; right: 0;
      background: rgba(10,2,18,.97); backdrop-filter: blur(20px); z-index: 99;
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    .hero-btns        { flex-direction: column; align-items: stretch; }
    .hero-btns button { width: 100% !important; text-align: center; }
    .grid-2col        { grid-template-columns: 1fr !important; }
    .grid-cases       { grid-template-columns: 1fr !important; }
    .grid-contact     { grid-template-columns: 1fr !important; }
    .grid-feedback    { grid-template-columns: 1fr !important; }
    .section-pad      { padding: 4rem 1.25rem !important; }
    .hero-pad         { padding: 5rem 1.25rem 3rem !important; }
  }
`;

// Estilos das páginas de detalhe (responsividade)
const CSS_DETAIL = `
  @media (max-width: 768px) {
    .dg2   { grid-template-columns: 1fr !important; }
    .dg3   { grid-template-columns: 1fr !important; }
    .dh1   { font-size: clamp(1.8rem, 7vw, 2.6rem) !important; }
    .dp    { padding: 2rem 1.25rem 4rem !important; }
    .dtb   { padding: 0 1.25rem !important; }
    .dbtns { flex-direction: column; align-items: stretch; }
    .dbtns a, .dbtns button { width: 100% !important; text-align: center !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────
// DADOS — NAV
// ─────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Sobre",       id: "sobre",       href: "#sobre"       },
  { label: "Habilidades", id: "habilidades", href: "#habilidades" },
  { label: "Cases",       id: "cases",       href: "#cases"       },
  { label: "Processo",    id: "processo",    href: "#processo"    },
  { label: "Feedbacks",   id: "feedbacks",   href: "#feedbacks"   },
  { label: "Contato",     id: "contato",     href: "#contato"     },
];

// ─────────────────────────────────────────────────────────────────
// DADOS — HABILIDADES
// ─────────────────────────────────────────────────────────────────

const SKILLS = [
  "Pesquisa com usuários",
  "UX/UI Design",
  "Product Design",
  "Figma",
  "Prototipação",
  "Design System",
  "Testes de usabilidade",
  "Product Analytics",
  "PLG",
  "Colaboração com desenvolvimento",
  "Documentação de design",
  "Sistemas B2B complexos",
];


// ─────────────────────────────────────────────────────────────────
// DADOS — PROCESSO
// ─────────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { num: "01", title: "Entender o problema",          desc: "Contexto, stakeholders, objetivos de negócio e restrições técnicas." },
  { num: "02", title: "Mapear contexto e usuários",   desc: "Quem usa, como usa, quais são as dores reais e os fluxos existentes." },
  { num: "03", title: "Pesquisar e validar hipóteses", desc: "Entrevistas, testes, benchmarks e análise de dados disponíveis." },
  { num: "04", title: "Criar fluxos e protótipos",    desc: "Arquitetura de informação, wireframes, protótipos de alta fidelidade no Figma." },
  { num: "05", title: "Testar, ajustar e documentar", desc: "Testes de usabilidade, iterações e documentação de decisões de design." },
  { num: "06", title: "Acompanhar implementação",     desc: "Colaboração próxima com desenvolvimento, handoff e validação técnica." },
];

// ─────────────────────────────────────────────────────────────────
// DADOS — FEEDBACKS / DEPOIMENTOS
// ─────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    initials: "WM",
    name:     "Wesley Cavichioli Menegat",
    role:     "Product Manager · Digital Products · B2B SaaS",
    date:     "13 de maio de 2025",
    highlight: "Transforma pesquisas e benchmarks em insights acionáveis.",
    text: "É com grande satisfação que recomendo o Bruno, um UX/UI Designer que se destaca por sua abordagem metódica e resultados excepcionais. Durante processos de Discovery, ele demonstra habilidade ímpar em transformar pesquisas e benchmarks em insights acionáveis, sempre apresentando suas conclusões com embasamento sólido e contrapontos que enriquecem as discussões. Seu olhar crítico e atenção aos detalhes resultam em protótipos refinados e soluções de alta qualidade, onde a estética e a usabilidade caminham juntas. Além de seu talento técnico, Bruno traz uma postura colaborativa que eleva o nível do time, questionando premissas e propondo melhorias com fundamentação clara. Profissional completo e estratégico, é sem dúvida um ativo valioso para qualquer equipe que busque excelência em design.",
    color: T.orange,
  },
  {
    initials: "LV",
    name:     "Leonardo Dominoni Vieira",
    role:     "Profissional · Mesma equipe",
    date:     "24 de fevereiro de 2025",
    highlight: "Atenção ao usuário e compromisso com processos bem definidos.",
    text: "Desde que conheci o Bruno, ele sempre demonstrou foco, dedicação e um grande interesse pela área em que atua. Seu compromisso com o aprendizado contínuo e o aperfeiçoamento técnico é notável, assim como sua preocupação genuína com a equipe e a melhoria da colaboração entre todos.\n\nAlém de transmitir suas ideias com clareza, Bruno se destaca como Designer por sua atenção ao usuário e seu compromisso em seguir processos bem definidos, garantindo entregas de alta qualidade. Sempre bem educado, cordial e disposto a contribuir, é um profissional que recomendo sem hesitação.",
    color: T.magenta,
  },
];

// ─────────────────────────────────────────────────────────────────
// DADOS — CASES
// Para adicionar um novo case: copie o bloco abaixo, ajuste o id
// e preencha os campos. O campo "template" define qual layout usar:
//   "dashboard" | "sommelier" | "generic"
// ─────────────────────────────────────────────────────────────────

const CASES = [
  // ── DASHBOARD SMARTSHARE ───────────────────────────────────────
  {
    id:       "dashboard",
    template: "dashboard",  // ← define o layout da página de detalhe
    tag:      "Em desenvolvimento",
    tagColor: T.orange,
    title:    "Dashboard Smartshare",
    company:  "Selbetti Tecnologia",
    icon:     "📊",
    shortContext: "Dashboards para transformar dados operacionais complexos em visibilidade acionável para usuários administradores.",
    challenge:    "Transformar informações operacionais complexas em uma experiência visual clara, útil e acionável para diferentes perfis de usuários.",
    deliverables: [
      "Protótipo de alta fidelidade",
      "Estrutura de dashboard",
      "Cards e gráficos de indicadores",
      "Refinamento de UX Writing",
      "Estados de erro e empty states",
    ],

    // ── Página de detalhe ─────────────────────────────────────
    heroTitle:    "Dashboard Smartshare",
    heroSubtitle: "Construção de dashboards para transformar dados operacionais complexos em uma experiência visual clara, útil e acionável para usuários administradores.",
    heroSummary:  "O Dashboard Smartshare está sendo desenvolvido para apoiar usuários administradores na leitura da operação, reunindo indicadores sobre saúde dos fluxos, recursos, gargalos e desempenho operacional.",
    tags: [
      "UX/UI Design","Product Design","B2B","Dashboard",
      "Pesquisa com usuários","Design System","IA no desenvolvimento","Em desenvolvimento",
    ],
    overview: [
      { label: "Problema",      text: "Usuários administradores precisam acompanhar informações importantes da operação, mas parte desses dados fica distribuída em diferentes fluxos, telas ou análises manuais, dificultando uma visão rápida sobre saúde, gargalos e prioridades." },
      { label: "Minha atuação", text: "Pesquisa com usuários administradores, organização das informações, definição da estrutura das páginas, prototipação no Figma, refinamento de UX Writing, aplicação de padrões do Design System, documentação de refinamento e colaboração próxima com PMs, stakeholders e desenvolvimento." },
      { label: "Contexto",      text: "O projeto faz parte do ecossistema Smartshare/Selbetti e busca criar uma experiência de dashboard para apoiar a gestão operacional dentro de um produto B2B complexo." },
      { label: "Status",        text: "Projeto em desenvolvimento, com validações iniciais realizadas com usuários administradores, stakeholder técnico e PM." },
    ],
    challengeFull:     "O principal desafio era transformar informações operacionais complexas em uma experiência simples, visual e acionável, permitindo que usuários administradores entendessem rapidamente a saúde da operação, identificassem gargalos e acompanhassem recursos de forma mais eficiente.",
    challengeQuestion: "Como podemos apresentar indicadores operacionais de forma clara e útil, sem sobrecarregar o usuário com excesso de dados?",
    researchText: "Para a construção do dashboard, foram entrevistados usuários administradores que necessitam acompanhar informações da operação no dia a dia. O objetivo foi entender quais dados são mais relevantes, quais decisões precisam ser tomadas a partir dessas informações e quais dificuldades existem hoje.\n\nAlém das entrevistas, o projeto foi validado com um stakeholder que atua como Head do time de desenvolvimento, verificando requisitos técnicos e alinhamento com necessidades identificadas em outros clientes.",
    researchInsights: [
      "Administradores precisam de uma visão rápida sobre a saúde da operação",
      "Indicadores devem ajudar a identificar gargalos e priorizar ações",
      "A visualização precisa ser objetiva, evitando excesso de informação",
      "Os dados precisam ser apresentados de forma confiável e fácil de interpretar",
      "A solução deve considerar viabilidade técnica desde o início",
    ],
    solutionText: "A partir das entrevistas e validações iniciais, a solução foi estruturada em áreas principais do dashboard. Cada área foi pensada para responder a perguntas específicas da operação e apoiar decisões rápidas.",
    solutionQuestions: [
      "Como está a saúde geral da operação?",
      "Existem fluxos em atraso, em risco ou com erro?",
      "Quais recursos estão mais sobrecarregados?",
      "Onde estão os principais gargalos?",
      "Quais usuários, papéis ou tarefas exigem mais atenção?",
    ],
    solutionAreas: [
      { title: "Saúde da Operação",   desc: "Indicadores gerais da operação, distribuição por situação, alertas e possíveis pontos críticos." },
      { title: "Recursos e Gargalos", desc: "Concentração de trabalho, usuários ou papéis mais carregados, tarefas com maior impacto e possíveis gargalos no fluxo operacional." },
    ],
    refinementText: "Após as validações iniciais, elaborei um documento de refinamento para alinhar a proposta com o PM e dar continuidade ao projeto com mais clareza. Esse documento organizou requisitos, regras de negócio, estrutura dos componentes, comportamentos esperados, estados de tela e pontos de atenção para desenvolvimento.",
    refinementDeliverables: [
      "Estrutura das páginas do dashboard",
      "Definição dos cards e indicadores",
      "Regras de exibição dos dados",
      "Estados de carregamento, erro e empty state",
      "Ajustes de UX Writing",
      "Alinhamento com padrões do Design System",
      "Pontos de validação técnica com desenvolvimento",
    ],
    protoText: "Com a estrutura definida, avancei para a prototipação no Figma, organizando os indicadores em cards, gráficos e seções de leitura rápida. A proposta visual buscou equilibrar clareza, densidade de informação e consistência com o Design System da Selbetti.\n\nO dashboard foi pensado para uma leitura progressiva: visão geral → distribuição por situação → análise de recursos e gargalos → detalhamentos.",
    aiText: "Este projeto se destaca por ser o primeiro case da Selbetti utilizando IA como apoio no desenvolvimento. Por isso, a colaboração com o time técnico exigiu ainda mais cuidado na definição dos comportamentos, estados, regras e padrões visuais.",
    aiPoints: [
      "Alinhamento com desenvolvimento desde as etapas iniciais",
      "Validação de viabilidade técnica",
      "Estruturação clara dos requisitos",
      "Uso do refinamento como apoio para implementação",
      "Cuidado com consistência visual e comportamento dos componentes",
    ],
    allDeliverables: [
      "Pesquisa com usuários administradores",
      "Validação com stakeholder técnico",
      "Protótipo de alta fidelidade no Figma",
      "Estrutura das páginas do dashboard",
      "Cards e gráficos de indicadores",
      "Refinamento de UX Writing",
      "Estados de erro, loading e empty state",
      "Documento de refinamento para validação com PM",
      "Apoio à comunicação entre design, produto e desenvolvimento",
    ],
    impactText: "Como o projeto ainda está em desenvolvimento, os resultados finais serão acompanhados após a implementação. O impacto esperado é oferecer mais visibilidade sobre a operação, reduzir o esforço para interpretar dados críticos e apoiar decisões mais rápidas.",
    impactPoints: [
      "Melhor leitura da saúde da operação",
      "Identificação mais rápida de gargalos",
      "Apoio à priorização de ações",
      "Redução de análises manuais",
      "Mais clareza para acompanhar fluxos e recursos",
      "Maior alinhamento entre necessidade do usuário, regra de negócio e viabilidade técnica",
    ],
    learnings: [
      "Dashboards precisam responder perguntas reais da operação, não apenas exibir dados",
      "A escolha dos indicadores deve partir das decisões que o usuário precisa tomar",
      "A validação técnica antecipada ajuda a reduzir retrabalho",
      "Estados de erro, carregamento e ausência de dados são parte essencial da experiência",
    ],
    wouldDoDiff: [
      "Validar a interpretação dos gráficos com mais perfis de usuários",
      "Acompanhar o uso real após implementação",
      "Revisar indicadores com base em dados reais de operação",
    ],
    nextSteps: [
      "Finalizar validações com PM e desenvolvimento",
      "Acompanhar implementação",
      "Testar com usuários administradores",
      "Medir compreensão dos indicadores",
      "Ajustar gráficos, textos e estados conforme feedbacks",
      "Evoluir o dashboard com base no uso em produção",
    ],
    // ── Mídias: coloque os caminhos reais após fazer upload ──────
    // type: "image" | "video"
    media: [
      { type: "image", src: "/images/dashboard/mockup-volume-status.png",      alt: "Dashboard BPM Eficiência — visão geral da aba Volume e Status",              caption: "Visão geral da aba Volume e Status com cards de indicadores operacionais." },
      { type: "image", src: "/images/dashboard/volume-status.png",             alt: "Aba Volume e Status com cards de fluxos e gráficos por processo",            caption: "Cards de fluxos abertos, no prazo, em risco, atrasados e finalizados." },
      { type: "image", src: "/images/dashboard/desempenho-operacional.png",    alt: "Aba Desempenho Operacional com SLA, tempo médio e gráfico por processo",     caption: "Desempenho operacional: SLA dos fluxos, tempo médio de conclusão e tempo por processo." },
      { type: "image", src: "/images/dashboard/carga-gargalos.png",            alt: "Aba Carga e Gargalos com ranking de usuários mais velozes e mais demorados", caption: "Carga e gargalos: ranking de usuários por tempo médio de execução." },
      { type: "image", src: "/images/dashboard/drill-down-fluxos.png",         alt: "Modal de drill-down exibindo lista de fluxos atrasados ao clicar no card",   caption: "Drill-down ao clicar em um indicador: lista detalhada de fluxos relacionados." },
      { type: "image", src: "/images/dashboard/loading-skeleton.png",          alt: "Estado de carregamento do dashboard com skeleton dos cards e gráficos",       caption: "Estado de carregamento com skeleton — feedback visual enquanto os dados são buscados." },
    ],
  },

  // ── SOMMELIER DIGITAL ──────────────────────────────────────────
  {
    id:       "sommelier",
    template: "sommelier",
    tag:      "MVP",
    tagColor: T.magenta,
    title:    "Sommelier Digital",
    company:  "Totem Digital",
    icon:     "🍷",
    shortContext: "MVP de totem para guiar consumidores leigos na escolha de vinhos por ocasião, harmonização e preferência.",
    challenge:    "Traduzir parte do conhecimento de um sommelier em uma jornada simples, guiada e acessível para usuários leigos.",
    deliverables: [
      "Fluxo de usuário",
      "Protótipo interativo",
      "Interface para totem",
      "Testes com usuários",
      "Handoff para desenvolvimento",
    ],

    // ── Página de detalhe ─────────────────────────────────────
    heroTitle:    "Sommelier Digital — Totem de recomendação de vinhos",
    heroSubtitle: "MVP de uma experiência guiada para ajudar consumidores leigos a escolherem vinhos com mais segurança.",
    heroSummary:  "O Sommelier Digital foi criado para auxiliar consumidores que não são especialistas em vinhos a escolherem uma opção adequada à ocasião, preferências de sabor, harmonização e faixa de preço.",
    tags: ["UX/UI Design","MVP","Totem digital","Pesquisa exploratória","Teste de usabilidade","Handoff"],
    overview: [
      { label: "Problema",      text: "Como ajudar consumidores leigos a escolherem vinhos de forma simples, rápida e segura dentro de um ambiente de compra?" },
      { label: "Minha atuação", text: "Pesquisa exploratória, entrevista com especialista, definição da jornada, criação dos fluxos, prototipação no Figma, teste de usabilidade e handoff para desenvolvimento." },
      { label: "Contexto",      text: "O projeto nasceu a partir de uma demanda de cliente para criação de um MVP de totem digital." },
      { label: "Resultado",     text: "Protótipo validado, jornada principal aprovada e documentação entregue para desenvolvimento." },
    ],
    challengeFull:     "O principal desafio era traduzir parte do conhecimento de um sommelier em uma experiência digital simples o suficiente para usuários leigos, mas útil também para consumidores com maior familiaridade com vinhos.",
    challengeQuestion: "Quais perguntas um sommelier faria para ajudar o cliente a escolher o melhor vinho para sua ocasião e necessidade?",
    deskResearch:    "Pesquisa sobre comportamento de consumo de vinhos, preferências, tipos de vinho, uvas, regiões e fatores que influenciam a decisão de compra.",
    expertInterview: "Como não havia tempo hábil para entrevistar consumidores diretamente, a pesquisa foi conduzida com uma sommelier que atendia no local. O objetivo foi entender dúvidas frequentes, critérios usados na recomendação e fatores que mais influenciam a decisão de compra.",
    researchInsights: [
      "Consumidores buscam recomendações principalmente por ocasião",
      "Harmonização com alimentos é um critério importante na decisão",
      "Faixa de preço influencia bastante a escolha final",
      "Usuários mais criteriosos também consideram tipo de uva, região, vinícola e perfil de sabor",
    ],
    hmw: "Como podemos criar uma jornada rápida e acessível que simule a orientação de um sommelier e recomende vinhos relevantes a partir de poucas perguntas?",
    mvpPriorities: [
      "Jornada curta, com até 4 perguntas essenciais",
      "Linguagem acessível, evitando termos técnicos",
      "Filtros por ocasião, harmonização, tipo de vinho e faixa de preço",
      "Exibição de poucas sugestões por vez para reduzir sobrecarga",
      "Interface adequada para uso em totem digital",
    ],
    flowText: "Com os critérios definidos, mapeei o fluxo principal da experiência: início da jornada, perguntas guiadas, aplicação dos filtros, exibição das recomendações e visualização dos detalhes do vinho escolhido.\n\nDurante essa etapa, surgiu uma oportunidade de negócio: integrar o sistema do totem às etiquetas eletrônicas da gôndola, permitindo que a etiqueta do vinho recomendado piscasse fisicamente no ambiente para facilitar a localização do produto.",
    designBlocks: [
      { title: "Exploração inicial",           text: "Esboços no Figma para testar possibilidades de layout, navegação e apresentação das perguntas." },
      { title: "Wireframes",                   text: "Estruturação da jornada e das telas principais, com foco em hierarquia e fluxo de decisão." },
      { title: "Protótipo de alta fidelidade", text: "Protótipo interativo com foco em hierarquia visual, legibilidade, uso em totem, clareza das recomendações e microinterações." },
    ],
    usabilityText: "Para validar a jornada, foram realizados testes de usabilidade com 6 participantes: 4 usuários com pouco conhecimento sobre vinhos e 2 usuários com conhecimento avançado.",
    usabilityResults: [
      "Todas as tarefas foram concluídas com sucesso",
      "A linguagem foi compreendida por usuários leigos",
      "As recomendações foram consideradas úteis",
      "Usuários experientes também perceberam valor na experiência",
    ],
    usabilityIssues: [
      "Alguns usuários sentiram falta de escolher o tipo de vinho",
      "Surgiu interesse em visualizar histórico de compras",
      "O filtro por tipo de vinho deveria ser priorizado em uma próxima versão",
    ],
    deliveryText: "Após a validação com usuários internos, stakeholders e equipe técnica, o projeto foi aprovado para seguir como MVP. A entrega final contemplou o protótipo interativo de alta fidelidade, o fluxo completo da jornada e a documentação das principais regras de funcionamento.\n\nO handoff foi realizado com o time de desenvolvimento, incluindo alinhamentos sobre navegação, comportamento dos filtros, estados das telas, critérios de recomendação, resolução do totem, legibilidade e objetividade da jornada.",
    conclusionText: "O Sommelier Digital transformou um processo de escolha complexo em uma experiência guiada, simples e objetiva. A solução traduziu parte do conhecimento de um sommelier em uma jornada acessível, baseada em perguntas essenciais sobre ocasião, harmonização, faixa de preço e preferências.\n\nComo MVP, o projeto cumpriu seu papel de reduzir incertezas, validar o fluxo principal e criar uma base sólida para evoluções futuras.",
    learnings: [
      "Em experiências assistidas, a qualidade das perguntas é tão importante quanto a interface",
      "Linguagem simples reduz insegurança em temas mais técnicos",
      "Testes rápidos ajudam a identificar lacunas importantes antes da implementação",
    ],
    wouldDoDiff: [
      "Entrevistaria consumidores diretamente no ambiente de compra",
      "Validaria mais cedo o filtro por tipo de vinho",
      "Criaria um kit visual básico desde o início para manter consistência entre telas",
    ],
    nextSteps: [
      "Incluir escolha do tipo de vinho como filtro inicial",
      "Testar o totem em ambiente real de loja",
      "Medir taxa de conclusão, abandono por etapa e interação com recomendações",
      "Avaliar integração com estoque, promoções e etiquetas eletrônicas",
      "Refinar a lógica de recomendação com dados reais de uso",
    ],
    media: [
      { type: "image", src: "/images/sommelier/totem-mercado-01.jpg",    alt: "Totem do Sommelier Digital instalado na adega do mercado",          caption: "Totem instalado na adega — contexto real de uso no ponto de venda." },
      { type: "image", src: "/images/sommelier/desk-research.jpg",       alt: "Desk research sobre comportamento de consumo de vinhos",             caption: "Desk research: dados sobre preferências, ocasiões e comportamento de compra." },
      { type: "image", src: "/images/sommelier/moscow.jpg",              alt: "Matriz MoSCoW de priorização de funcionalidades do MVP",            caption: "Matriz MoSCoW usada para priorizar as funcionalidades essenciais do MVP." },
      { type: "image", src: "/images/sommelier/fluxo-usuario.jpg",       alt: "Fluxo de usuário com as 4 perguntas guiadas até a recomendação",    caption: "Fluxo de usuário: 4 perguntas guiadas da ocasião até a recomendação final." },
      { type: "image", src: "/images/sommelier/rascunhos-prototipo.png", alt: "Rascunhos e exploração de telas no Figma",                         caption: "Exploração e rascunhos no Figma — diferentes direções antes do protótipo final." },
      { type: "image", src: "/images/sommelier/totem-mercado-02.jpg",    alt: "Totem do Sommelier Digital visto pelo ângulo lateral na gôndola",   caption: "Totem em operação — integrado ao ambiente da adega no ponto de venda." },
      { type: "youtube", src: "nfYm4eGQr5Q",              alt: "Demonstração do protótipo interativo do Sommelier Digital",         caption: "Demonstração da jornada completa no protótipo interativo." },
    ],
  },

  // ── RECORTE E PUBLICAÇÃO DE DOCUMENTOS ───────────────────────
  {
    id:       "recorte",
    template: "recorte",
    tag:      "UX/UI Design",
    tagColor: T.crimson,
    title:    "Recorte e Publicação de Documentos",
    company:  "SmartShare — Selbetti / Ânima",
    icon:     "✂️",
    shortContext: "Solução para dividir, corrigir e publicar documentos digitalizados diretamente no ECM, reduzindo retrabalho e dependência de ferramentas externas no processo documental.",
    challenge:    "Permitir que usuários que lidam com grandes volumes de documentos digitalizados consigam recortar, corrigir, classificar e publicar arquivos no ECM de forma mais rápida, segura e integrada ao SmartShare.",
    deliverables: [
      "Pesquisa com usuários",
      "Fluxo de recorte",
      "Protótipo completo",
      "Onboarding guiado",
      "Estados de erro",
      "Publicação em segundo plano",
    ],
    heroTitle:    "Recorte e Publicação de Documentos no SmartShare",
    heroSubtitle: "Solução para dividir, corrigir e publicar documentos digitalizados diretamente no ECM.",
    heroSummary:  "Desenhei uma funcionalidade para recortar, corrigir, classificar e publicar documentos digitalizados dentro do SmartShare. O projeto foi desenvolvido a partir de dores reais da Ânima, que precisava manipular diariamente contratos, aditivos, comprovantes e documentos acadêmicos antes de armazená-los corretamente no ECM.",
    tags: ["UX Research","UX/UI Design","Produto B2B","ECM","Prototipação","Onboarding","Handoff"],
    overview: [
      { label: "Problema",          text: "A Ânima lidava diariamente com alto volume de documentos digitalizados que frequentemente chegavam com páginas viradas, páginas em branco, documentos misturados ou erros de digitalização." },
      { label: "Desafio",           text: "Criar uma funcionalidade para corrigir, dividir, classificar e publicar documentos diretamente no ECM do SmartShare, sem depender de ferramentas externas." },
      { label: "Minha atuação",     text: "Atuei como UX/UI Designer no projeto, participando desde a investigação inicial até a construção do protótipo final. Minha atuação envolveu contato com o cliente, entrevistas com usuários, pesquisa exploratória, benchmark, mapeamento da jornada, definição dos fluxos, prototipação, estados de erro, alertas, onboarding guiado e comportamento da publicação em segundo plano." },
      { label: "Resultado esperado",text: "Reduzir retrabalho, diminuir a dependência de ferramentas externas e tornar o processo de publicação documental mais ágil, seguro e integrado ao SmartShare." },
    ],
    challengeFull:     "O desafio era desenhar uma funcionalidade que permitisse aos usuários corrigir, dividir, classificar e publicar documentos sem depender de ferramentas externas, mantendo todo o processo dentro do SmartShare. A solução precisava atender não apenas à edição do PDF, mas também ao contexto operacional do cliente: cada documento precisava ser vinculado corretamente ao aluno, por meio de informações como RA, tipo de documento e pasta de destino.",
    challengeQuestion: "Como permitir que usuários que lidam com grandes volumes de documentos digitalizados consigam recortar, corrigir, classificar e publicar arquivos no ECM de forma mais rápida, segura e integrada ao SmartShare?",
    contextText: "A Ânima lidava diariamente com um alto volume de documentos digitalizados, como contratos, aditivos, comprovantes e documentos acadêmicos. Esses arquivos eram armazenados no ECM do SmartShare, mas frequentemente chegavam com problemas como páginas viradas, páginas em branco, documentos misturados ou erros de digitalização.\n\nO processo exigia muito esforço manual dos usuários. Após a digitalização, era comum que os documentos precisassem de ajustes antes de serem armazenados corretamente no ECM.\n\nEntre os principais problemas identificados estavam páginas escaneadas na orientação errada, páginas em branco, arquivos com múltiplos documentos agrupados e a necessidade de separar conteúdos por aluno, tipo documental e pasta de destino.",
    researchText: "Para compreender o problema em profundidade, foi conduzida uma pesquisa exploratória com o cliente e usuários da plataforma. O objetivo era entender como os documentos eram manipulados atualmente, quais etapas geravam mais retrabalho e em qual ponto da jornada a nova funcionalidade faria mais sentido.\n\nTambém foi realizado benchmark com ferramentas como Adobe, iLovePDF e Smallpdf, buscando entender padrões já conhecidos pelos usuários em ações como excluir páginas, rotacionar documentos, criar novos arquivos e selecionar intervalos de páginas.",
    researchInsights: [
      "Os usuários lidavam com documentos extensos e, muitas vezes, pouco organizados após a digitalização",
      "Havia necessidade recorrente de remover páginas em branco, corrigir páginas viradas e separar diferentes documentos dentro de um único PDF",
      "Ferramentas externas resolviam parte do problema, mas criavam quebra no fluxo de trabalho",
      "Informações como RA, tipo de documento e pasta de destino eram essenciais para garantir a publicação correta no ECM",
      "A experiência precisava ser visual, guiada e segura, pois erros na separação poderiam impactar a organização documental do aluno",
    ],
    solutionText: "A solução desenhada permite que o usuário selecione um documento no SmartShare e acesse uma jornada de divisão e publicação diretamente na plataforma.\n\nDentro da funcionalidade, o usuário pode visualizar todas as páginas do PDF em formato de cards, criar intervalos de divisão, rotacionar páginas individualmente, excluir páginas desnecessárias e classificar cada novo documento antes da publicação.\n\nCada intervalo criado pode receber informações específicas, como pasta de destino, tipo documental, nome do documento e Registro Acadêmico do aluno. Dessa forma, o arquivo já é publicado corretamente no ECM, sem que o usuário precise sair da plataforma ou reorganizar os documentos manualmente depois.",
    uxDecisions: [
      { title: "Intervalos visuais entre páginas", text: "Uma das principais decisões foi tornar os intervalos de corte visíveis diretamente entre as páginas. Para isso, foram utilizados marcadores e linhas tracejadas que indicam onde cada novo documento começa, ajudando o usuário a entender visualmente a separação antes de publicar." },
      { title: "Painel lateral de classificação",  text: "Foi definido um painel lateral para concentrar as informações de cada intervalo, evitando que o usuário precisasse navegar por várias telas para preencher os dados de publicação." },
      { title: "Edição segura de páginas",         text: "A jornada considerou cenários como rotação de páginas, exclusão de páginas e o impacto dessas alterações em intervalos já configurados, garantindo mais previsibilidade e segurança para o usuário." },
      { title: "Publicação em segundo plano",      text: "A publicação foi pensada para acontecer em segundo plano. Assim, após confirmar a ação, o usuário pode continuar utilizando o sistema enquanto o SmartShare processa os documentos. Ao final, uma notificação informa a conclusão da publicação." },
    ],
    onboardingText: "Como a funcionalidade introduzia uma nova forma de manipular documentos dentro do SmartShare, foi desenhado um onboarding guiado para apresentar o recurso. Esse tutorial explica como iniciar a divisão do arquivo, criar intervalos, corrigir páginas e publicar os documentos classificados. A intenção foi reduzir a curva de aprendizagem e tornar a primeira experiência mais segura, principalmente para usuários que lidam com grande volume documental.",
    errorsText: "Além do fluxo principal, também foram desenhados estados de erro, alertas e comportamentos para cenários de exceção. A proposta considerou situações como falha na publicação, campos obrigatórios não preenchidos, inconsistências nos intervalos, exclusão de páginas já associadas a cortes e feedbacks após ações importantes. Esse cuidado ajudou a tornar a experiência mais robusta, evitando que o usuário avançasse com documentos incompletos ou publicados incorretamente.",
    allDeliverables: [
      "Pesquisa exploratória com cliente e usuários",
      "Benchmark com ferramentas especializadas em PDF",
      "Mapeamento da jornada de recorte e publicação",
      "Fluxo completo da funcionalidade",
      "Protótipo de alta fidelidade",
      "Jornada de rotacionar páginas",
      "Jornada de excluir páginas",
      "Comportamento de intervalos após alterações nas páginas",
      "Onboarding guiado",
      "Estados de erro e alertas",
      "Definição da publicação em segundo plano",
      "Handoff para desenvolvimento",
    ],
    resultText: "A solução foi projetada para reduzir retrabalho, diminuir a dependência de ferramentas externas e tornar o processo de publicação documental mais ágil e seguro dentro do SmartShare.\n\nCom a nova jornada, os usuários passam a conseguir corrigir, separar e classificar documentos em um único fluxo, mantendo a organização por aluno, tipo documental e pasta de destino.\n\nAlém de melhorar a eficiência operacional, a funcionalidade também contribui para uma experiência mais consistente e integrada ao ecossistema do SmartShare.",
    impactText: "Este projeto exigiu a combinação de pesquisa com usuários, entendimento de regras de negócio, análise de ferramentas de mercado e desenho de uma jornada completa para um cenário B2B complexo.\n\nMais do que criar uma interface para edição de PDFs, o trabalho envolveu transformar uma dor operacional recorrente em uma solução integrada ao fluxo documental do produto, considerando usabilidade, segurança, escalabilidade e continuidade da experiência.",
    learnings: [
      "Soluções para sistemas B2B precisam considerar o fluxo operacional completo, não apenas a interface",
      "Em documentos digitalizados, ações simples como excluir ou rotacionar páginas podem ter impacto em regras mais complexas",
      "Onboarding, alertas e estados de erro são essenciais quando a funcionalidade envolve risco de publicação incorreta",
    ],
    wouldDoDiff: [
      "Validar o fluxo com mais perfis de usuários",
      "Acompanhar o uso da funcionalidade em ambiente real",
      "Medir redução de retrabalho e dependência de ferramentas externas",
      "Refinar mensagens de erro e orientação conforme feedbacks reais",
    ],
    nextSteps: [
      "Acompanhar implementação",
      "Validar o comportamento da publicação em segundo plano",
      "Testar a jornada completa com usuários da operação",
      "Evoluir a solução com base em dados reais de uso",
    ],
    media: [
      { type: "image", src: "/images/recorte-smartshare/visao-geral.png",            alt: "Visão geral da funcionalidade de recorte e publicação de documentos no SmartShare", caption: "Visão geral da jornada de recorte e publicação dentro do SmartShare." },
      { type: "image", src: "/images/recorte-smartshare/tela-recorte.png",            alt: "Tela principal de recorte de páginas do PDF",                                        caption: "Tela principal para visualizar páginas, criar divisões e organizar o documento." },
      { type: "image", src: "/images/recorte-smartshare/intervalos.png",              alt: "Criação de intervalos de páginas no documento",                                       caption: "Definição visual dos intervalos de corte entre páginas." },
      { type: "image", src: "/images/recorte-smartshare/painel-lateral.png",          alt: "Painel lateral para classificação dos documentos",                                    caption: "Painel lateral para informar RA, tipo documental, nome do documento e pasta de destino." },
      { type: "image", src: "/images/recorte-smartshare/rotacionar-paginas.png",      alt: "Jornada de rotação de páginas no PDF",                                               caption: "Fluxo para corrigir páginas digitalizadas na orientação incorreta." },
      { type: "image", src: "/images/recorte-smartshare/excluir-paginas.png",         alt: "Jornada de exclusão de páginas no PDF",                                              caption: "Comportamento da exclusão de páginas e impacto nos intervalos já definidos." },
      { type: "image", src: "/images/recorte-smartshare/publicacao-segundo-plano.png",alt: "Publicação de documentos em segundo plano",                                           caption: "Publicação em segundo plano para permitir que o usuário continue usando o sistema." },
      { type: "image", src: "/images/recorte-smartshare/onboarding.png",              alt: "Onboarding guiado da funcionalidade",                                                caption: "Onboarding criado para orientar o primeiro uso da funcionalidade." },
      { type: "image", src: "/images/recorte-smartshare/erros-alertas.png",           alt: "Estados de erro e alertas da funcionalidade",                                        caption: "Estados de erro, alertas e feedbacks para evitar publicações incorretas." },
    ],
  },

  // ── TEMPLATE PARA NOVO CASE ────────────────────────────────────
  // Copie este bloco para adicionar um novo case:
  /*
  {
    id:       "novo-case",
    template: "generic", // ou "dashboard" / "sommelier"
    tag:      "Em andamento",
    tagColor: T.orange,
    title:    "Título do Case",
    company:  "Empresa",
    icon:     "🎯",
    shortContext: "Descrição curta para o card da home.",
    challenge:    "O desafio principal.",
    deliverables: ["Entrega 1","Entrega 2"],
    heroTitle:    "Título completo do case",
    heroSubtitle: "Subtítulo descritivo.",
    heroSummary:  "Resumo exibido no hero da página de detalhe.",
    tags: ["Tag1","Tag2"],
    overview: [
      { label: "Problema",      text: "..." },
      { label: "Minha atuação", text: "..." },
      { label: "Contexto",      text: "..." },
      { label: "Resultado",     text: "..." },
    ],
    challengeFull:     "Descrição completa do desafio.",
    challengeQuestion: "Pergunta central do projeto.",
    researchInsights: ["Insight 1","Insight 2"],
    learnings:    ["Aprendizado 1"],
    wouldDoDiff:  ["O que faria diferente"],
    nextSteps:    ["Próximo passo 1"],
    media: [
      { type: "image", src: "/images/novo-case/hero.png", alt: "Descrição" },
    ],
  },
  */
];

// ─────────────────────────────────────────────────────────────────
// UTILITÁRIOS DE ESTILO
// ─────────────────────────────────────────────────────────────────

/** Estilo de card glassmorphism */
const glassCard = (overrides = {}) => ({
  background:            T.glass,
  border:                `1px solid ${T.border}`,
  borderRadius:          18,
  padding:               "1.5rem",
  backdropFilter:        "blur(16px)",
  WebkitBackdropFilter:  "blur(16px)",
  ...overrides,
});

/** Label de seção (uppercase, esmaecido) */
const labelStyle = {
  fontSize:      10,
  fontWeight:    700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color:         "rgba(255,255,255,0.38)",
  marginBottom:  8,
};

/** Corpo de texto padrão */
const bodyStyle = {
  fontSize:   15,
  color:      T.text,
  lineHeight: 1.85,
  margin:     0,
};

/** Chip/tag colorido */
const chipStyle = (color) => ({
  fontSize:     12,
  padding:      "5px 13px",
  borderRadius: 20,
  background:   `${color}14`,
  border:       `1px solid ${color}33`,
  color:        "rgba(255,255,255,0.8)",
});

// ─────────────────────────────────────────────────────────────────
// HOOK — useInView (animação ao entrar na viewport)
// ─────────────────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, inView];
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — FadeIn
// ─────────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? "translateY(0)" : "translateY(22px)",
        transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — Lightbox (ampliar imagem ao clicar)
// ─────────────────────────────────────────────────────────────────

function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position:        "fixed",
        inset:           0,
        zIndex:          9999,
        background:      "rgba(0,0,0,0.92)",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "2rem",
        cursor:          "zoom-out",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position:   "absolute",
          top:        "1.25rem",
          right:      "1.5rem",
          background: "rgba(255,255,255,0.1)",
          border:     "1px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
          width:      36,
          height:     36,
          color:      "#fff",
          fontSize:   18,
          cursor:     "pointer",
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
        aria-label="Fechar"
      >
        ✕
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth:     "100%",
          maxHeight:    "90vh",
          objectFit:    "contain",
          borderRadius: 12,
          cursor:       "default",
          boxShadow:    "0 8px 60px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — MediaItem (imagem ou vídeo com fallback + lightbox)
// ─────────────────────────────────────────────────────────────────

function MediaItem({ item, large = false }) {
  const [err,       setErr]       = useState(false);
  const [lightbox,  setLightbox]  = useState(false);

  const baseStyle = {
    width:        "100%",
    borderRadius: large ? 16 : 12,
    border:       "1px solid rgba(255,255,255,0.1)",
    objectFit:    "contain",        // mostra a imagem inteira, sem cortar
    background:   "rgba(255,255,255,0.03)",
    display:      "block",
  };

  const placeholderStyle = {
    ...baseStyle,
    height:         large ? 300 : 200,
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            10,
  };

  if (err || !item.src) {
    return (
      <div style={placeholderStyle}>
        <span style={{ fontSize: 24, opacity: 0.25 }}>🖼</span>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", margin: 0 }}>{item.alt}</p>
      </div>
    );
  }

  if (item.type === "youtube") {
    const videoId = item.src;
    return (
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={item.alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width:        "100%",
            maxWidth:     300,
            height:       520,
            border:       "1px solid rgba(255,255,255,0.1)",
            borderRadius: large ? 16 : 12,
            background:   "#000",
            display:      "block",
          }}
        />
      </div>
    );
  }

  if (item.type === "video") {
    return (
      <video
        src={item.src}
        controls
        aria-label={item.alt}
        style={{ ...baseStyle, background: "#000" }}
        onError={() => setErr(true)}
      />
    );
  }

  return (
    <>
      {lightbox && <Lightbox src={item.src} alt={item.alt} onClose={() => setLightbox(false)} />}
      <img
        src={item.src}
        alt={item.alt}
        style={{ ...baseStyle, cursor: "zoom-in" }}
        onClick={() => setLightbox(true)}
        onError={() => setErr(true)}
        title="Clique para ampliar"
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — SectionLabel (rótulo laranja + título de seção)
// ─────────────────────────────────────────────────────────────────

function SectionLabel({ label, title, subtitle, accentColor = T.orange, titleAccent }) {
  return (
    <FadeIn>
      <p style={{ fontSize: 11, color: accentColor, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "0.75rem" }}>
        {label}
      </p>
      <h2 style={{ fontFamily: "'Manrope',sans-serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, color: "#fff", marginBottom: subtitle ? "0.75rem" : "2.5rem", lineHeight: 1.15 }}>
        {title}
        {titleAccent && <><br /><span style={{ color: T.magenta }}>{titleAccent}</span></>}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 14, color: T.textMuted, marginBottom: "3rem" }}>{subtitle}</p>
      )}
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — LearnBlock (Aprendizados / Faria diferente / Próximos passos)
// ─────────────────────────────────────────────────────────────────

function LearnBlock({ learnings, wouldDoDiff, nextSteps, accentColor }) {
  const cols = [
    { label: "Aprendizados",         items: learnings,    color: accentColor },
    { label: "O que faria diferente", items: wouldDoDiff,  color: T.orange   },
    { label: "Próximos passos",       items: nextSteps,    color: T.purple   },
  ];

  return (
    <div className="dg3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "3rem" }}>
      {cols.map((col) => (
        <div key={col.label} style={glassCard()}>
          <p style={{ ...labelStyle, color: col.color }}>{col.label}</p>
          {col.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 9, marginBottom: 9 }}>
              <span style={{ color: col.color, flexShrink: 0, fontSize: 12 }}>✦</span>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,.65)", margin: 0, lineHeight: 1.6 }}>{item}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — DetailTopBar (barra de navegação das páginas de case)
// ─────────────────────────────────────────────────────────────────

function DetailTopBar({ onBack, accentColor }) {
  return (
    <div
      className="dtb"
      style={{
        position:      "sticky",
        top:           0,
        zIndex:        100,
        display:       "flex",
        alignItems:    "center",
        justifyContent: "space-between",
        padding:       "0 2rem",
        height:        60,
        background:    "rgba(10,2,18,.92)",
        backdropFilter: "blur(20px)",
        borderBottom:  "1px solid rgba(255,255,255,.07)",
      }}
    >
      <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 17 }}>
        BH<span style={{ color: T.orange }}>V</span>
      </span>
      <button
        onClick={onBack}
        style={{
          display:     "flex",
          alignItems:  "center",
          gap:         7,
          background:  "rgba(255,255,255,.05)",
          border:      "1px solid rgba(255,255,255,.12)",
          borderRadius: 30,
          padding:     "7px 16px",
          color:       "rgba(255,255,255,.72)",
          fontSize:    13,
          fontWeight:  600,
          cursor:      "pointer",
          transition:  "all .2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background   = `${accentColor}18`;
          e.currentTarget.style.borderColor  = `${accentColor}55`;
          e.currentTarget.style.color        = accentColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background   = "rgba(255,255,255,.05)";
          e.currentTarget.style.borderColor  = "rgba(255,255,255,.12)";
          e.currentTarget.style.color        = "rgba(255,255,255,.72)";
        }}
      >
        ← Voltar para o portfólio
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — DetailFooterBtns (botões no rodapé de cada case)
// ─────────────────────────────────────────────────────────────────

function DetailFooterBtns({ onBack, accentColor }) {
  return (
    <div
      className="dbtns"
      style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "3rem" }}
    >
      <button
        onClick={onBack}
        style={{
          padding:    "13px 36px",
          borderRadius: 40,
          background: `linear-gradient(135deg,${T.crimson},${T.purple})`,
          color:      "#fff",
          fontWeight: 700,
          fontSize:   14,
          border:     "none",
          cursor:     "pointer",
          boxShadow:  `0 0 28px ${T.crimson}59`,
          transition: "transform .2s, box-shadow .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 36px ${T.crimson}8C`; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = `0 0 28px ${T.crimson}59`; }}
      >
        ← Voltar para o portfólio
      </button>
      <a
        href="mailto:brunovillwock@icloud.com"
        style={{
          padding:    "13px 36px",
          borderRadius: 40,
          background: "transparent",
          border:     "1px solid rgba(255,255,255,.18)",
          color:      "rgba(255,255,255,.78)",
          fontWeight: 600,
          fontSize:   14,
          cursor:     "pointer",
          transition: "all .2s",
          display:    "inline-block",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accentColor}55`; e.currentTarget.style.color = accentColor; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"; e.currentTarget.style.color = "rgba(255,255,255,.78)"; }}
      >
        Entrar em contato
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — DetailHero (topo comum de todas as páginas de case)
// ─────────────────────────────────────────────────────────────────

function DetailHero({ c, firstMedia }) {
  const tc = c.tagColor;
  return (
    <FadeIn>
      <span style={{ fontSize: 36, display: "block", marginBottom: "1.25rem" }}>{c.icon}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: "1.25rem" }}>
        {c.tags.map((t) => (
          <span key={t} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, background: `${tc}1A`, color: tc, border: `1px solid ${tc}33` }}>
            {t}
          </span>
        ))}
      </div>
      <h1 className="dh1" style={{ fontFamily: "'Manrope',sans-serif", fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: "0.75rem" }}>
        {c.heroTitle}
      </h1>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,.38)", marginBottom: "1.25rem" }}>{c.company}</p>
      <p style={{ fontSize: 17, color: "rgba(255,255,255,.68)", lineHeight: 1.75, maxWidth: 640, marginBottom: "2.5rem" }}>{c.heroSubtitle}</p>
      {firstMedia && <MediaItem item={firstMedia} large />}
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — OverviewGrid (grid de visão geral 2 colunas)
// ─────────────────────────────────────────────────────────────────

function OverviewGrid({ items }) {
  return (
    <div className="dg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
      {items.map((o, i) => (
        <div key={i} style={glassCard()}>
          <p style={labelStyle}>{o.label}</p>
          <p style={{ fontSize: 14, color: T.text, lineHeight: 1.75, margin: 0 }}>{o.text}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — ChallengeBlock (desafio + pergunta central)
// ─────────────────────────────────────────────────────────────────

function ChallengeBlock({ challengeFull, challengeQuestion, accentColor }) {
  return (
    <FadeIn delay={0.07}>
      <div style={{ ...glassCard({ background: `${accentColor}0A`, borderColor: `${accentColor}30` }), marginBottom: "1.5rem" }}>
        <p style={labelStyle}>Desafio</p>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>{challengeFull}</p>
        <div style={{ padding: "1rem", background: `${accentColor}12`, borderRadius: 12, border: `1px solid ${accentColor}30` }}>
          <p style={{ fontSize: 13, color: accentColor, fontWeight: 600, margin: "0 0 2px" }}>Pergunta central</p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.82)", fontStyle: "italic", margin: 0 }}>"{challengeQuestion}"</p>
        </div>
      </div>
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — InsightList (lista de bullets com ícone colorido)
// ─────────────────────────────────────────────────────────────────

function InsightList({ items, icon = "✦", color }) {
  return items.map((ins, i) => (
    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
      <span style={{ color, flexShrink: 0 }}>{icon}</span>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,.68)", margin: 0 }}>{ins}</p>
    </div>
  ));
}

// ─────────────────────────────────────────────────────────────────
// LAYOUT DE DETALHE — DASHBOARD SMARTSHARE
// ─────────────────────────────────────────────────────────────────

function CaseDetailDashboard({ c, onBack }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const tc = c.tagColor;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: T.bg, minHeight: "100vh", color: "#fff" }}>
      <style>{CSS_BASE + CSS_DETAIL}</style>
      <DetailTopBar onBack={onBack} accentColor={tc} />

      <div className="dp" style={{ maxWidth: 820, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        {/* Hero */}
        <DetailHero c={c} firstMedia={c.media[0] || { src: null, alt: "Imagem ou vídeo do dashboard", type: "image" }} />

        <div style={{ height: 1, background: `linear-gradient(90deg,${tc}55,transparent)`, margin: "3rem 0" }} />

        {/* Visão geral */}
        <FadeIn delay={0.06}>
          <p style={{ ...labelStyle, marginBottom: 16 }}>Visão geral</p>
          <OverviewGrid items={c.overview} />
        </FadeIn>

        {/* Desafio */}
        <ChallengeBlock challengeFull={c.challengeFull} challengeQuestion={c.challengeQuestion} accentColor={tc} />

        {/* Pesquisa */}
        <FadeIn delay={0.08}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Pesquisa</p>
            {c.researchText.split("\n\n").map((p, i) => (
              <p key={i} style={{ ...bodyStyle, marginBottom: i === 0 ? "1rem" : 0 }}>{p}</p>
            ))}
            <div style={{ marginTop: "1.25rem" }}>
              <InsightList items={c.researchInsights} color={tc} />
            </div>
          </div>
        </FadeIn>

        {/* Solução */}
        <FadeIn delay={0.09}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Definição da solução</p>
            <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>{c.solutionText}</p>
            <p style={{ ...labelStyle, marginBottom: 10 }}>Perguntas que guiaram a solução</p>
            <InsightList items={c.solutionQuestions} icon="→" color={tc} />
          </div>
        </FadeIn>

        {/* Áreas da solução */}
        <FadeIn delay={0.09}>
          <div className="dg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            {c.solutionAreas.map((a, i) => (
              <div key={i} style={glassCard({ borderColor: `${tc}28` })}>
                <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, color: "#fff", fontSize: 15, margin: "0 0 8px" }}>{a.title}</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.62)", lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Refinamento */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Refinamento e documentação</p>
            <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>{c.refinementText}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {c.refinementDeliverables.map((d, i) => <span key={i} style={chipStyle(tc)}>{d}</span>)}
            </div>
          </div>
        </FadeIn>

        {/* Protótipo */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Design e prototipação</p>
            {c.protoText.split("\n\n").map((p, i) => (
              <p key={i} style={{ ...bodyStyle, marginBottom: i === 0 ? "1rem" : 0 }}>{p}</p>
            ))}
          </div>
        </FadeIn>

        {/* IA */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard({ background: `${tc}08`, borderColor: `${tc}25` }), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Colaboração com desenvolvimento e uso de IA</p>
            <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>{c.aiText}</p>
            <InsightList items={c.aiPoints} icon="✦" color={tc} />
          </div>
        </FadeIn>

        {/* Mídias restantes */}
        {c.media.length > 1 && (
          <FadeIn delay={0.1}>
            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{ ...labelStyle, marginBottom: 16 }}>Mídias do projeto</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {c.media.slice(1).map((item, i) => <MediaItem key={i} item={item} large />)}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Entregas */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Entregas</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {c.allDeliverables.map((d, i) => <span key={i} style={chipStyle(tc)}>{d}</span>)}
            </div>
          </div>
        </FadeIn>

        {/* Impacto */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard({ background: "rgba(140,3,67,.06)", borderColor: "rgba(140,3,67,.2)" }), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Impacto esperado</p>
            <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>{c.impactText}</p>
            <div className="dg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {c.impactPoints.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 9 }}>
                  <span style={{ color: T.orange, flexShrink: 0, marginTop: 2 }}>→</span>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,.65)", margin: 0, lineHeight: 1.6 }}>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <div style={{ height: 1, background: `linear-gradient(90deg,${T.purple}80,transparent)`, margin: "2rem 0" }} />

        {/* Aprendizados */}
        <FadeIn delay={0.1}>
          <p style={{ ...labelStyle, marginBottom: 16 }}>Aprendizados e próximos passos</p>
          <LearnBlock learnings={c.learnings} wouldDoDiff={c.wouldDoDiff} nextSteps={c.nextSteps} accentColor={tc} />
        </FadeIn>

        <DetailFooterBtns onBack={onBack} accentColor={tc} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LAYOUT DE DETALHE — SOMMELIER DIGITAL
// ─────────────────────────────────────────────────────────────────

function CaseDetailSommelier({ c, onBack }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const tc = c.tagColor;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: T.bg, minHeight: "100vh", color: "#fff" }}>
      <style>{CSS_BASE + CSS_DETAIL}</style>
      <DetailTopBar onBack={onBack} accentColor={tc} />

      <div className="dp" style={{ maxWidth: 820, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        {/* Hero */}
        <DetailHero c={c} firstMedia={c.media[0] || { src: null, alt: "Imagem ou vídeo do protótipo", type: "image" }} />

        <div style={{ height: 1, background: `linear-gradient(90deg,${tc}55,transparent)`, margin: "3rem 0" }} />

        {/* Visão geral */}
        <FadeIn delay={0.05}>
          <p style={{ ...labelStyle, marginBottom: 16 }}>Visão geral do projeto</p>
          <OverviewGrid items={c.overview} />
        </FadeIn>

        {/* Desafio */}
        <ChallengeBlock challengeFull={c.challengeFull} challengeQuestion={c.challengeQuestion} accentColor={tc} />

        {/* Pesquisa */}
        <FadeIn delay={0.07}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Pesquisa e descoberta</p>
            <div className="dg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={glassCard({ background: "rgba(255,255,255,.02)" })}>
                <p style={{ ...labelStyle, marginBottom: 6 }}>Desk research</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.65)", lineHeight: 1.7, margin: 0 }}>{c.deskResearch}</p>
              </div>
              <div style={glassCard({ background: "rgba(255,255,255,.02)" })}>
                <p style={{ ...labelStyle, marginBottom: 6 }}>Entrevista com sommelier</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.65)", lineHeight: 1.7, margin: 0 }}>{c.expertInterview}</p>
              </div>
            </div>
            <p style={{ ...labelStyle, marginBottom: 10 }}>Principais aprendizados</p>
            <InsightList items={c.researchInsights} color={tc} />
          </div>
        </FadeIn>

        {c.media[0] && <FadeIn delay={0.07}><div style={{ marginBottom: "1.5rem" }}><MediaItem item={c.media[0]} /></div></FadeIn>}

        {/* Solução */}
        <FadeIn delay={0.08}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Definição da solução</p>
            <div style={{ padding: "1rem", background: `${tc}12`, borderRadius: 12, border: `1px solid ${tc}30`, marginBottom: "1.25rem" }}>
              <p style={{ fontSize: 13, color: tc, fontWeight: 600, margin: "0 0 4px" }}>HMW</p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.82)", fontStyle: "italic", margin: 0 }}>{c.hmw}</p>
            </div>
            <p style={{ ...labelStyle, marginBottom: 10 }}>Prioridades do MVP</p>
            <InsightList items={c.mvpPriorities} icon="→" color={tc} />
          </div>
        </FadeIn>

        {c.media[1] && <FadeIn delay={0.08}><div style={{ marginBottom: "1.5rem" }}><MediaItem item={c.media[1]} /></div></FadeIn>}

        {/* Fluxo */}
        <FadeIn delay={0.09}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Fluxo do usuário</p>
            {c.flowText.split("\n\n").map((p, i) => (
              <p key={i} style={{ ...bodyStyle, marginBottom: i === 0 ? "1rem" : 0 }}>{p}</p>
            ))}
          </div>
        </FadeIn>

        {c.media[2] && <FadeIn delay={0.09}><div style={{ marginBottom: "1.5rem" }}><MediaItem item={c.media[2]} /></div></FadeIn>}

        {/* Design */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Design e prototipação</p>
            <div className="dg3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              {c.designBlocks.map((b, i) => (
                <div key={i} style={glassCard({ background: "rgba(255,255,255,.02)" })}>
                  <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, color: "#fff", fontSize: 14, margin: "0 0 8px" }}>{b.title}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.65, margin: 0 }}>{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {c.media[3] && <FadeIn delay={0.1}><div style={{ marginBottom: "1.5rem" }}><MediaItem item={c.media[3]} large /></div></FadeIn>}

        {/* Teste de usabilidade */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Teste de usabilidade</p>
            <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>{c.usabilityText}</p>
            <div className="dg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <p style={{ ...labelStyle, color: "#4ade80", marginBottom: 8 }}>Resultados</p>
                {c.usabilityResults.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, marginBottom: 7 }}>
                    <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,.65)", margin: 0 }}>{r}</p>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ ...labelStyle, color: T.orange, marginBottom: 8 }}>Pontos de atenção</p>
                {c.usabilityIssues.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, marginBottom: 7 }}>
                    <span style={{ color: T.orange, flexShrink: 0 }}>!</span>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,.65)", margin: 0 }}>{r}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Entrega */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Entrega</p>
            {c.deliveryText.split("\n\n").map((p, i) => (
              <p key={i} style={{ ...bodyStyle, marginBottom: i === 0 ? "1rem" : 0 }}>{p}</p>
            ))}
          </div>
        </FadeIn>

        {c.media[4] && <FadeIn delay={0.1}><div style={{ marginBottom: "2rem" }}><MediaItem item={c.media[4]} large /></div></FadeIn>}

        {/* Mídias restantes (índice 5 em diante, inclui vídeo) */}
        {c.media.length > 5 && (
          <FadeIn delay={0.1}>
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ ...labelStyle, marginBottom: 16 }}>Mídias do projeto</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {c.media.slice(5).map((item, i) => (
                  <div key={i}>
                    <MediaItem item={item} large />
                    {item.caption && (
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 8, textAlign: "center", letterSpacing: "0.04em" }}>{item.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Conclusão */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard({ background: "rgba(140,3,67,.06)", borderColor: "rgba(140,3,67,.2)" }), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Conclusão</p>
            {c.conclusionText.split("\n\n").map((p, i) => (
              <p key={i} style={{ ...bodyStyle, marginBottom: i === 0 ? "1rem" : 0 }}>{p}</p>
            ))}
          </div>
        </FadeIn>

        <div style={{ height: 1, background: `linear-gradient(90deg,${T.purple}80,transparent)`, margin: "2rem 0" }} />

        {/* Aprendizados */}
        <FadeIn delay={0.1}>
          <p style={{ ...labelStyle, marginBottom: 16 }}>Aprendizados e próximos passos</p>
          <LearnBlock learnings={c.learnings} wouldDoDiff={c.wouldDoDiff} nextSteps={c.nextSteps} accentColor={tc} />
        </FadeIn>

        <DetailFooterBtns onBack={onBack} accentColor={tc} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LAYOUT DE DETALHE — GENÉRICO (Fluxos / novos cases simples)
// ─────────────────────────────────────────────────────────────────

function CaseDetailGeneric({ c, onBack }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const tc = c.tagColor;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: T.bg, minHeight: "100vh", color: "#fff" }}>
      <style>{CSS_BASE + CSS_DETAIL}</style>
      <DetailTopBar onBack={onBack} accentColor={tc} />

      <div className="dp" style={{ maxWidth: 820, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        {/* Hero sem mídia de capa */}
        <FadeIn>
          <span style={{ fontSize: 36, display: "block", marginBottom: "1.25rem" }}>{c.icon}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: "1.25rem" }}>
            {c.tags.map((t) => (
              <span key={t} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, background: `${tc}1A`, color: tc, border: `1px solid ${tc}33` }}>
                {t}
              </span>
            ))}
          </div>
          <h1 className="dh1" style={{ fontFamily: "'Manrope',sans-serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: "0.75rem" }}>
            {c.heroTitle}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.38)", marginBottom: "1.25rem" }}>{c.company}</p>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.68)", lineHeight: 1.75, maxWidth: 640, marginBottom: "2.5rem" }}>{c.heroSummary}</p>
        </FadeIn>

        <div style={{ height: 1, background: `linear-gradient(90deg,${tc}55,transparent)`, marginBottom: "3rem" }} />

        {/* Visão geral */}
        <FadeIn delay={0.05}>
          <OverviewGrid items={c.overview} />
        </FadeIn>

        {/* Desafio */}
        <ChallengeBlock challengeFull={c.challengeFull} challengeQuestion={c.challengeQuestion} accentColor={tc} />

        {/* Pesquisa */}
        <FadeIn delay={0.08}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Descobertas da pesquisa</p>
            <InsightList items={c.researchInsights} color={tc} />
          </div>
        </FadeIn>

        {/* Mídias */}
        {c.media.length > 0 && (
          <FadeIn delay={0.09}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "2rem" }}>
              {c.media.map((item, i) => <MediaItem key={i} item={item} large />)}
            </div>
          </FadeIn>
        )}

        <div style={{ height: 1, background: `linear-gradient(90deg,${T.purple}80,transparent)`, margin: "2rem 0" }} />

        {/* Aprendizados */}
        <FadeIn delay={0.09}>
          <p style={{ ...labelStyle, marginBottom: 16 }}>Aprendizados e próximos passos</p>
          <LearnBlock learnings={c.learnings} wouldDoDiff={c.wouldDoDiff} nextSteps={c.nextSteps} accentColor={tc} />
        </FadeIn>

        <DetailFooterBtns onBack={onBack} accentColor={tc} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LAYOUT DE DETALHE — RECORTE E PUBLICAÇÃO DE DOCUMENTOS
// ─────────────────────────────────────────────────────────────────

function MediaGallery({ media, accentColor }) {
  const [first, ...rest] = media;
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <p style={{ ...labelStyle, marginBottom: 16 }}>Mídias do projeto</p>

      {/* Mídia principal em destaque */}
      {first && (
        <div style={{ marginBottom: "1rem" }}>
          <MediaItem item={first} large />
          {first.caption && (
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 8, textAlign: "center", letterSpacing: "0.04em" }}>{first.caption}</p>
          )}
        </div>
      )}

      {/* Galeria em grid 2 col */}
      {rest.length > 0 && (
        <div className="dg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {rest.map((item, i) => (
            <div key={i}>
              <MediaItem item={item} />
              {item.caption && (
                <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 6, letterSpacing: "0.04em" }}>{item.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CaseDetailRecorte({ c, onBack }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const tc = c.tagColor;

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: T.bg, minHeight: "100vh", color: "#fff" }}>
      <style>{CSS_BASE + CSS_DETAIL}</style>
      <DetailTopBar onBack={onBack} accentColor={tc} />

      <div className="dp" style={{ maxWidth: 820, margin: "0 auto", padding: "4rem 2rem 6rem" }}>

        {/* ── Hero ── */}
        <DetailHero c={c} firstMedia={c.media[0] || { src: null, alt: "Imagem ou vídeo do protótipo", type: "image" }} />

        <div style={{ height: 1, background: `linear-gradient(90deg,${tc}55,transparent)`, margin: "3rem 0" }} />

        {/* ── Visão geral ── */}
        <FadeIn delay={0.05}>
          <p style={{ ...labelStyle, marginBottom: 16 }}>Visão geral do projeto</p>
          <OverviewGrid items={c.overview} />
        </FadeIn>

        {/* ── Contexto ── */}
        <FadeIn delay={0.06}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Contexto</p>
            {c.contextText.split("\n\n").map((p, i) => (
              <p key={i} style={{ ...bodyStyle, marginBottom: i < c.contextText.split("\n\n").length - 1 ? "1rem" : 0 }}>{p}</p>
            ))}
          </div>
        </FadeIn>

        {/* ── Desafio ── */}
        <ChallengeBlock challengeFull={c.challengeFull} challengeQuestion={c.challengeQuestion} accentColor={tc} />

        {/* ── Pesquisa ── */}
        <FadeIn delay={0.08}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Pesquisa e descoberta</p>
            {c.researchText.split("\n\n").map((p, i) => (
              <p key={i} style={{ ...bodyStyle, marginBottom: "1rem" }}>{p}</p>
            ))}
            <p style={{ ...labelStyle, marginBottom: 10 }}>Principais descobertas</p>
            <InsightList items={c.researchInsights} color={tc} />
          </div>
        </FadeIn>

        {/* ── Solução ── */}
        <FadeIn delay={0.09}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Solução proposta</p>
            {c.solutionText.split("\n\n").map((p, i) => (
              <p key={i} style={{ ...bodyStyle, marginBottom: i < c.solutionText.split("\n\n").length - 1 ? "1rem" : 0 }}>{p}</p>
            ))}
          </div>
        </FadeIn>

        {/* ── Decisões de UX ── */}
        <FadeIn delay={0.09}>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ ...labelStyle, marginBottom: 14 }}>Principais decisões de UX</p>
            <div className="dg2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {c.uxDecisions.map((d, i) => (
                <div key={i} style={glassCard({ background: `${tc}08`, borderColor: `${tc}25` })}>
                  <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", margin: "0 0 8px" }}>{d.title}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.7, margin: 0 }}>{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Galeria de mídias ── */}
        {c.media.length > 0 && (
          <FadeIn delay={0.1}>
            <MediaGallery media={c.media} accentColor={tc} />
          </FadeIn>
        )}

        {/* ── Onboarding ── */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Onboarding e orientação</p>
            <p style={{ ...bodyStyle }}>{c.onboardingText}</p>
          </div>
        </FadeIn>

        {/* ── Erros e alertas ── */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Tratamento de erros e alertas</p>
            <p style={{ ...bodyStyle }}>{c.errorsText}</p>
          </div>
        </FadeIn>

        {/* ── Entregas ── */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Entregas</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {c.allDeliverables.map((d, i) => <span key={i} style={chipStyle(tc)}>{d}</span>)}
            </div>
          </div>
        </FadeIn>

        {/* ── Resultado esperado ── */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard(), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Resultado esperado</p>
            {c.resultText.split("\n\n").map((p, i) => (
              <p key={i} style={{ ...bodyStyle, marginBottom: i < c.resultText.split("\n\n").length - 1 ? "1rem" : 0 }}>{p}</p>
            ))}
          </div>
        </FadeIn>

        {/* ── Impacto ── */}
        <FadeIn delay={0.1}>
          <div style={{ ...glassCard({ background: `${tc}08`, borderColor: `${tc}25` }), marginBottom: "1.5rem" }}>
            <p style={labelStyle}>Impacto do projeto</p>
            {c.impactText.split("\n\n").map((p, i) => (
              <p key={i} style={{ ...bodyStyle, marginBottom: i < c.impactText.split("\n\n").length - 1 ? "1rem" : 0 }}>{p}</p>
            ))}
          </div>
        </FadeIn>

        <div style={{ height: 1, background: `linear-gradient(90deg,${T.purple}80,transparent)`, margin: "2rem 0" }} />

        {/* ── Aprendizados ── */}
        <FadeIn delay={0.1}>
          <p style={{ ...labelStyle, marginBottom: 16 }}>Aprendizados e próximos passos</p>
          <LearnBlock learnings={c.learnings} wouldDoDiff={c.wouldDoDiff} nextSteps={c.nextSteps} accentColor={tc} />
        </FadeIn>

        <DetailFooterBtns onBack={onBack} accentColor={tc} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — CaseDetail (roteador de layouts)
// Para adicionar um novo layout: crie o componente e adicione
// mais um "if" aqui, ou use o template "generic" para a maioria.
// ─────────────────────────────────────────────────────────────────

function CaseDetail({ caseData, onBack }) {
  if (caseData.template === "dashboard") return <CaseDetailDashboard c={caseData} onBack={onBack} />;
  if (caseData.template === "sommelier") return <CaseDetailSommelier c={caseData} onBack={onBack} />;
  if (caseData.template === "recorte")   return <CaseDetailRecorte   c={caseData} onBack={onBack} />;
  return <CaseDetailGeneric c={caseData} onBack={onBack} />;
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — LiquidButton (CTA com efeito líquido animado)
// ─────────────────────────────────────────────────────────────────

function LiquidButton({ href, onClick, children }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 32px",
        borderRadius: 40,
        color: "#fff",
        fontWeight: 600,
        fontSize: 15,
        overflow: "hidden",
        isolation: "isolate",
        boxShadow: hovered ? `0 8px 40px ${T.crimson}99` : `0 0 30px ${T.crimson}66`,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform .2s, box-shadow .2s",
      }}
    >
      {/* Camada líquida animada */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -2,
          zIndex: -1,
          background: `linear-gradient(135deg, ${T.crimson}, ${T.purple}, ${T.magenta}, ${T.crimson})`,
          backgroundSize: "300% 300%",
          animation: "liquid-flow 6s ease infinite",
          filter: hovered ? "saturate(1.2) brightness(1.1)" : "none",
          transition: "filter .3s",
        }}
      />
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        {children}
      </span>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — CaseCard (card da listagem na Home)
// ─────────────────────────────────────────────────────────────────

function CaseCard({ c, index, onSelect }) {
  const [hovered, setHovered] = useState(false);

  return (
    <FadeIn delay={index * 0.1} style={{ height: "100%" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...glassCard(),
          position:      "relative",
          overflow:      "hidden",
          display:       "flex",
          flexDirection: "column",
          height:        "100%",
          transition:    "border-color .3s, transform .3s, box-shadow .3s",
          borderColor:   hovered ? `${c.tagColor}55` : T.border,
          transform:     hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow:     hovered ? `0 20px 56px ${T.purple}47` : "none",
        }}
      >
        {/* Linha de cor no topo */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${c.tagColor},transparent)` }} />

        {/* ── Topo: Ícone + Tag ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 26 }}>{c.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, background: `${c.tagColor}1A`, color: c.tagColor, border: `1px solid ${c.tagColor}33` }}>
            {c.tag}
          </span>
        </div>

        {/* ── Título + empresa ── */}
        <h3 style={{ fontFamily: "'Manrope',sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#fff", margin: "0 0 3px" }}>{c.title}</h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", margin: "0 0 1rem", letterSpacing: "0.04em" }}>{c.company}</p>

        {/* ── Resumo/contexto ── */}
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.62)", lineHeight: 1.65, margin: "0 0 .75rem" }}>{c.shortContext}</p>

        {/* ── Bloco de desafio ── */}
        <div style={{ margin: "0 0 1.25rem", padding: ".75rem", background: `${c.tagColor}0D`, borderRadius: 12, border: `1px solid ${c.tagColor}22` }}>
          <p style={{ ...labelStyle, color: c.tagColor, marginBottom: 4 }}>Desafio</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.68)", lineHeight: 1.6, margin: 0 }}>{c.challenge}</p>
        </div>

        {/* ── Chips de entregas (cresce para preencher espaço) ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flexGrow: 1, alignContent: "flex-start", marginBottom: "1.5rem" }}>
          {c.deliverables.slice(0, 3).map((d, i) => (
            <span key={i} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(255,255,255,.55)" }}>{d}</span>
          ))}
        </div>

        {/* ── Botão sempre no rodapé ── */}
        <button
          onClick={() => onSelect(c)}
          style={{
            width:        "100%",
            padding:      "11px 0",
            borderRadius: 30,
            background:   hovered ? `linear-gradient(135deg,${c.tagColor}CC,${c.tagColor}77)` : "rgba(255,255,255,.05)",
            border:       `1px solid ${hovered ? c.tagColor + "88" : "rgba(255,255,255,.1)"}`,
            color:        hovered ? "#fff" : "rgba(255,255,255,.6)",
            fontSize:     13,
            fontWeight:   600,
            cursor:       "pointer",
            transition:   "all .25s",
            marginTop:    "auto",
            flexShrink:   0,
          }}
        >
          Ver case completo <ChevronRight size={15} style={{ display: "inline", verticalAlign: "middle", marginLeft: 2 }} />
        </button>
      </div>
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE — Home
// ─────────────────────────────────────────────────────────────────

function Home({ onSelectCase, onNavClick }) {
  const [scrolled,      setScrolled]     = useState(false);
  const [menuOpen,      setMenuOpen]     = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [emailCopied,   setEmailCopied]  = useState(false);

  const copyEmail = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText("brunovillwock@icloud.com");
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar e-mail:", err);
    }
  };

  // glassmorphism + seção ativa via scroll position
  useEffect(() => {
    const SECTIONS = ["sobre", "habilidades", "cases", "processo", "feedbacks", "contato"];

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const scrollPos = window.scrollY + 200;
      let current = "";
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) current = id;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: T.bg, minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>
      <style>{CSS_BASE + CSS_HOME}</style>

      {/* ── NAVEGAÇÃO ─────────────────────────────────────────── */}
      <nav style={{
        position:        "fixed",
        top:             0, left: 0, right: 0,
        zIndex:          100,
        padding:         "0 2rem",
        height:          60,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
        background:      "rgba(10,2,18,0.72)",
        backdropFilter:  "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom:    "1px solid rgba(255,255,255,0.08)",
        boxShadow:       scrolled ? "0 12px 40px rgba(0,0,0,0.25)" : "none",
        transition:      "box-shadow .4s ease",
      }}>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
          BH<span style={{ color: T.orange }}>V</span>
        </span>

        {/* Links desktop */}
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className={activeSection === l.id ? "nav-link active" : "nav-link"}
              onClick={() => { onNavClick(l.id); setMenuOpen(false); }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/bruno-villwock-curriculo.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            style={{
              border: "1px solid rgba(242,123,19,0.28)",
              background: "rgba(242,123,19,0.12)",
              color: "#F27B13",
              marginLeft: "0.5rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(242,123,19,0.22)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(242,123,19,0.12)"; }}
          >
            Currículo
          </a>
        </div>

        {/* Hamburguer mobile */}
        <button
          className="nav-ham"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          style={{ background: "none", border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "rgba(255,255,255,.7)", fontSize: 18, flexShrink: 0 }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="mob-menu">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className={activeSection === l.id ? "mob-link active" : "mob-link"}
              onClick={() => { onNavClick(l.id); setMenuOpen(false); }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/bruno-villwock-curriculo.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "14px 2rem",
              borderBottom: "1px solid rgba(255,255,255,.05)",
              borderLeft: "3px solid #F27B13",
              background: "rgba(242,123,19,0.05)",
              fontSize: 15,
              fontWeight: 600,
              color: "#F27B13",
              textDecoration: "none",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Currículo
          </a>
        </div>
      )}

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero-pad" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "7rem 2rem 4rem" }}>
        {/* Blobs decorativos */}
        <div className="blob" style={{ width: 600, height: 600, background: `${T.purple}55`, top: -100, right: -100, animation: "float 8s ease-in-out infinite" }} />
        <div className="blob" style={{ width: 400, height: 400, background: `${T.crimson}33`, bottom: -50, left: -80, animation: "float 10s ease-in-out infinite reverse" }} />
        <div className="blob" style={{ width: 300, height: 300, background: `${T.orange}22`, top: "40%", left: "40%", animation: "float 6s ease-in-out infinite" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          {/* Nome */}
          <h1 style={{ fontFamily: "'Manrope',sans-serif", fontSize: "clamp(2.8rem,8vw,6rem)", fontWeight: 800, lineHeight: 1.0, marginBottom: "1rem" }}>
            <span className="text-gradient">Bruno Henrique</span><br />
            <span style={{ color: "rgba(255,255,255,.9)" }}>Villwock</span>
          </h1>

          {/* Cargo */}
          <p style={{ fontSize: "clamp(1rem,2.5vw,1.35rem)", color: T.magenta, fontWeight: 700, marginBottom: "1.5rem", fontFamily: "'Manrope',sans-serif" }}>
            UX/UI Designer Pleno · Product Designer
          </p>

          {/* Descrição principal */}
          <p style={{ fontSize: "clamp(1rem,2vw,1.2rem)", color: "rgba(255,255,255,.82)", lineHeight: 1.65, maxWidth: 600, marginBottom: "1.25rem", fontWeight: 300 }}>
            Transformo sistemas complexos em experiências digitais mais simples, claras e úteis para usuários e negócios.
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.42)", lineHeight: 1.8, maxWidth: 520, marginBottom: "3rem" }}>
            UX/UI Designer com experiência em produtos digitais B2B, sistemas complexos, pesquisa com usuários, prototipação, Design System e colaboração próxima com PMs, desenvolvedores e stakeholders.
          </p>

          {/* CTAs */}
          <div className="hero-btns">
            <LiquidButton href="#cases" onClick={() => onNavClick("cases")}>
              Ver projetos <ChevronRight size={15} style={{ display: "inline", verticalAlign: "middle", marginLeft: 2 }} />
            </LiquidButton>
            <a
              href="#contato"
              onClick={() => onNavClick("contato")}
              style={{ display: "inline-block", padding: "14px 32px", borderRadius: 40, background: "transparent", color: "rgba(255,255,255,.8)", fontWeight: 600, fontSize: 15, border: "1px solid rgba(255,255,255,.2)", transition: "all .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.orange}99`; e.currentTarget.style.color = T.orange; e.currentTarget.style.background = `${T.orange}12`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.2)"; e.currentTarget.style.color = "rgba(255,255,255,.8)"; e.currentTarget.style.background = "transparent"; }}
            >
              Entrar em contato
            </a>
          </div>
        </div>
      </section>

      {/* ── SOBRE ─────────────────────────────────────────────── */}
      <section id="sobre" className="section-pad" style={{ padding: "7rem 2rem", maxWidth: 900, margin: "0 auto", scrollMarginTop: 88 }}>
        <SectionLabel label="Sobre mim" title="Design, direito e" titleAccent="produto digital" />
        <div className="grid-2col">
          {[
            "Sou formado em Design e Direito, com especialização em Direito Digital e Compliance. Atualmente atuo como UX/UI Designer Pleno na <strong style='color:#fff'>Selbetti Tecnologia</strong>, onde trabalho há cerca de 4 anos com produtos digitais B2B e sistemas complexos — BPM, ECM, GED, assinatura digital, digitalização/OCR, sistemas de cobrança e soluções corporativas.",
            "Minha trajetória combina visão analítica, entendimento de negócio e foco na experiência do usuário. No dia a dia, colaboro com PMs, desenvolvedores, clientes e stakeholders para entender problemas reais, mapear dores, propor melhorias de usabilidade e transformar descobertas em fluxos, interfaces e protótipos no Figma.",
          ].map((text, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{ ...glassCard(), height: "100%" }}>
                <p style={{ fontSize: 15, color: T.text, lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── HABILIDADES ───────────────────────────────────────── */}
      <section id="habilidades" className="section-pad" style={{ padding: "6rem 2rem", maxWidth: 900, margin: "0 auto", scrollMarginTop: 88 }}>
        <SectionLabel label="Habilidades" title="O que trago para" titleAccent="cada projeto" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {SKILLS.map((s, i) => (
            <FadeIn key={s} delay={i * 0.03}>
              <span
                style={{ display: "inline-block", padding: "9px 18px", borderRadius: 30, border: "1px solid rgba(255,255,255,.11)", background: "rgba(255,255,255,.04)", fontSize: 13, color: "rgba(255,255,255,.75)", backdropFilter: "blur(8px)", cursor: "default", transition: "all .25s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.magenta}88`; e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = `${T.magenta}20`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.11)"; e.currentTarget.style.color = "rgba(255,255,255,.75)"; e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}
              >
                {s}
              </span>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CASES ─────────────────────────────────────────────── */}
      <section id="cases" className="section-pad" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto", scrollMarginTop: 88 }}>
        <SectionLabel label="Portfólio" title="Cases em destaque" subtitle="Projetos reais com foco em pesquisa, usabilidade e entrega." />
        <div className="grid-cases">
          {CASES.map((c, i) => (
            <CaseCard key={c.id} c={c} index={i} onSelect={onSelectCase} />
          ))}
        </div>
      </section>

      {/* ── PROCESSO ──────────────────────────────────────────── */}
      <section id="processo" className="section-pad" style={{ padding: "7rem 2rem", maxWidth: 900, margin: "0 auto", scrollMarginTop: 88 }}>
        <SectionLabel label="Como trabalho" title="Processo de" titleAccent="design" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {PROCESS_STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.07}>
              <div style={{ display: "flex", gap: "1.75rem", alignItems: "flex-start", position: "relative", paddingBottom: i < PROCESS_STEPS.length - 1 ? "2rem" : 0 }}>
                {/* Linha vertical */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div style={{ position: "absolute", left: 26, top: 54, bottom: 0, width: 1, background: `linear-gradient(to bottom,${T.crimson}72,transparent)` }} />
                )}
                {/* Número */}
                <div style={{ minWidth: 52, height: 52, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${T.crimson}28,${T.purple}28)`, border: `1px solid ${T.crimson}59`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 13, color: T.orange }}>
                  {step.num}
                </div>
                {/* Texto */}
                <div style={{ paddingTop: 12 }}>
                  <h3 style={{ fontFamily: "'Manrope',sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,.48)", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── FEEDBACKS ─────────────────────────────────────────── */}
      <section id="feedbacks" className="section-pad" style={{ padding: "7rem 2rem", maxWidth: 1000, margin: "0 auto", scrollMarginTop: 88 }}>
        <SectionLabel label="Feedbacks" title="Feedbacks de quem" titleAccent="trabalhou comigo" subtitle="Percepções de profissionais que acompanharam minha atuação em produto, design e colaboração com times multidisciplinares." />
        <div className="grid-feedback">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div
                style={{ ...glassCard({ padding: "2rem", position: "relative", overflow: "hidden" }), transition: "border-color .3s, transform .3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${t.color}44`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border;        e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Aspas decorativas */}
                <span style={{ position: "absolute", top: 8, right: 14, fontSize: 72, lineHeight: 1, fontFamily: "Georgia,serif", color: `${t.color}15`, userSelect: "none", pointerEvents: "none" }}>"</span>
                {/* Faixa de cor no topo */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${t.color},transparent)` }} />

                {/* Avatar + nome */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${t.color}55,${t.color}22)`, border: `1px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 13, color: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,.38)", margin: "2px 0 0" }}>{t.role}</p>
                  </div>
                </div>

                {/* Destaque */}
                <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,.88)", lineHeight: 1.55, marginBottom: "1rem", padding: ".75rem 1rem", background: `${t.color}12`, borderLeft: `3px solid ${t.color}`, borderRadius: "0 8px 8px 0" }}>
                  "{t.highlight}"
                </p>

                {/* Texto completo */}
                {t.text.split("\n\n").map((p, pi) => (
                  <p key={pi} style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.8, marginBottom: pi < t.text.split("\n\n").length - 1 ? ".75rem" : 0 }}>{p}</p>
                ))}

                {/* Rodapé */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,.06)" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,.25)", letterSpacing: "0.06em" }}>{t.date}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, background: "rgba(10,102,194,.15)", color: "rgba(10,102,194,.8)", border: "1px solid rgba(10,102,194,.2)" }}>
                    Recomendação via LinkedIn
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CONTATO ───────────────────────────────────────────── */}
      <section id="contato" className="section-pad" style={{ padding: "7rem 2rem", position: "relative", overflow: "hidden", scrollMarginTop: 88 }}>
        {/* Blob central */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", filter: "blur(80px)", background: `${T.purple}33`, top: -100, left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <FadeIn>
            <p style={{ fontSize: 11, color: T.orange, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "1.5rem" }}>Contato</p>
            <h2 style={{ fontFamily: "'Manrope',sans-serif", fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 800, color: "#fff", marginBottom: "1.5rem", lineHeight: 1.05 }}>
              Vamos<br /><span className="text-gradient">conversar?</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.52)", lineHeight: 1.85, maxWidth: 500, margin: "0 auto 3rem" }}>
              Se você quiser conhecer mais sobre meu trabalho ou trocar uma ideia sobre UX, produto e design para sistemas complexos, entre em contato.
            </p>
          </FadeIn>

          {/* Links de contato */}
          <FadeIn delay={0.1}>
            <div className="grid-contact">

              {/* Card E-mail — com botão de copiar */}
              <a
                href="mailto:brunovillwock@icloud.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", padding: "1.25rem", borderRadius: 16, textAlign: "left", ...glassCard(), transition: "all .25s", position: "relative" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.orange}59`; e.currentTarget.style.background = `${T.orange}0F`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border;         e.currentTarget.style.background = T.glass;         e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <p style={{ fontSize: 10, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>E-mail</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,.82)", fontWeight: 500, margin: 0, wordBreak: "break-all", lineHeight: 1.4 }}>
                    brunovillwock@icloud.com
                  </p>
                  <button
                    onClick={copyEmail}
                    aria-label="Copiar e-mail"
                    style={{
                      flexShrink:   0,
                      display:      "flex",
                      alignItems:   "center",
                      gap:          4,
                      padding:      "4px 10px",
                      borderRadius: 999,
                      border:       emailCopied ? `1px solid #4ade8066` : "1px solid rgba(255,255,255,0.15)",
                      background:   emailCopied ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.06)",
                      color:        emailCopied ? "#4ade80" : "rgba(255,255,255,0.55)",
                      fontSize:     11,
                      fontWeight:   600,
                      cursor:       "pointer",
                      transition:   "all .2s",
                      whiteSpace:   "nowrap",
                    }}
                    onMouseEnter={(e) => { if (!emailCopied) { e.currentTarget.style.borderColor = `${T.orange}66`; e.currentTarget.style.color = T.orange; e.currentTarget.style.background = `${T.orange}12`; } }}
                    onMouseLeave={(e) => { if (!emailCopied) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; } }}
                  >
                    {emailCopied ? (
                      <>
                        {/* ícone check */}
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Copiado!
                      </>
                    ) : (
                      <>
                        {/* ícone copy */}
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                          <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </a>

              {/* Cards WhatsApp e LinkedIn */}
              {[
                { label: "WhatsApp", value: "(47) 99626-7557",  href: "https://wa.me/5547996267557"               },
                { label: "LinkedIn", value: "brunovillwock",     href: "https://www.linkedin.com/in/brunovillwock" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", padding: "1.25rem", borderRadius: 16, textAlign: "left", ...glassCard(), transition: "all .25s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.orange}59`; e.currentTarget.style.background = `${T.orange}0F`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border;         e.currentTarget.style.background = T.glass;         e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 5 }}>{item.label}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,.82)", fontWeight: 500, margin: 0 }}>{item.value}</p>
                </a>
              ))}

            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── RODAPÉ ────────────────────────────────────────────── */}
      <footer style={{ padding: "2rem", borderTop: "1px solid rgba(255,255,255,.06)", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.18)" }}>© 2025 Bruno Henrique Villwock — UX/UI Designer</p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RAIZ — roteador principal Home ↔ CaseDetail
// ─────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [selectedCase,  setSelectedCase]  = useState(null);
  const [pendingScroll, setPendingScroll] = useState(null);

  // Quando saímos de um case e há uma seção pendente, rola até ela
  useEffect(() => {
    if (pendingScroll && !selectedCase) {
      const timeout = setTimeout(() => {
        const el = document.getElementById(pendingScroll);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        setPendingScroll(null);
      }, 120); // aguarda o Home montar
      return () => clearTimeout(timeout);
    }
  }, [pendingScroll, selectedCase]);

  const handleSelect = (c) => {
    setSelectedCase(c);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedCase(null);
    setTimeout(() => {
      const el = document.getElementById("cases");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  // Chamado pelo nav de Home E pelo nav de CaseDetail
  const handleNavClick = (id) => {
    if (selectedCase) {
      // Está numa página de case → volta para home e agenda o scroll
      setPendingScroll(id);
      setSelectedCase(null);
    }
    // Se já está na home, o href="#id" + scroll-padding-top cuida do resto
  };

  if (selectedCase) {
    return (
      <CaseDetail
        caseData={selectedCase}
        onBack={handleBack}
        onNavClick={handleNavClick}
      />
    );
  }

  return <Home onSelectCase={handleSelect} onNavClick={handleNavClick} />;
}
