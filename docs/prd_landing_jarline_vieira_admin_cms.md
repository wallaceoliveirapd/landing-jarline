# PRD — Plataforma de Gestão do Site Jarline Vieira

## 1. Visão geral do produto

A plataforma terá como objetivo permitir a gestão completa do site institucional de **Jarline Vieira**, incluindo conteúdos da home, projetos, páginas internas, formulários personalizados, informações de contato e configuração do chat com IA.

O sistema deve ser intuitivo, visualmente amigável e pensado para uso por pessoas não técnicas, permitindo editar o site sem depender de código.

Além do site institucional, haverá um **painel administrativo robusto**, com foco em autonomia, flexibilidade de edição e facilidade de manutenção.

---

## 2. Objetivo principal

Criar um sistema CMS/admin personalizado para que a arquiteta consiga:

- editar os conteúdos da landing page/home;
- ativar e desativar itens individuais dentro de cada seção;
- cadastrar, editar e excluir projetos;
- criar páginas livres com editor rico;
- construir formulários personalizados com drag and drop;
- configurar e “treinar” o comportamento do chat com IA;
- atualizar meios de contato, endereço e informações institucionais;
- manter o site sempre atualizado sem depender de desenvolvimento técnico.

---

## 3. Objetivos de negócio

- Dar autonomia para gestão do conteúdo do site.
- Facilitar atualização constante do portfólio.
- Melhorar a apresentação dos serviços e projetos.
- Tornar o contato com potenciais clientes mais organizado.
- Permitir que o chat com IA direcione melhor os leads.
- Centralizar a gestão de todo o site em um único painel.

---

## 4. Perfis de usuário

### 4.1. Administrador
Usuário com acesso total ao sistema.

Permissões:
- editar home;
- gerenciar projetos;
- gerenciar páginas;
- gerenciar formulários;
- editar contatos e dados institucionais;
- configurar IA;
- visualizar mensagens e leads;
- publicar e despublicar conteúdos.

### 4.2. Editor
Usuário com acesso parcial.

Permissões possíveis:
- editar textos e imagens;
- criar e editar projetos;
- criar e editar páginas;
- sem acesso às configurações mais sensíveis, como IA, contatos globais ou usuários.

---

## 5. Princípios gerais do CMS

1. Todo conteúdo visual da home deve ser gerenciável via painel.
2. Cada seção da home deve ser modular.
3. Cada item interno de uma seção deve possuir **switch on/off** para controle de exibição.
4. Sempre que fizer sentido, listas internas devem permitir **adicionar, editar, remover, duplicar e reordenar itens**.
5. Todo botão editável deve permitir configuração de link.
6. Se o link for interno, o sistema deve exibir **autocomplete com sugestões de páginas internas**.
7. Se o link for externo, o sistema deve permitir URL manual e abrir em **nova aba**.
8. O mesmo padrão de configuração deve ser reaproveitado em todas as seções e módulos compatíveis.

---

## 6. Escopo funcional

# 6.1. Módulo: Gestão da Home / Landing Page

## Objetivo
Permitir a edição completa das seções da home de forma estruturada, amigável e extremamente flexível.

## Requisitos funcionais gerais da home

O administrador deve poder:
- editar todas as seções da home;
- ativar/desativar seções inteiras;
- ativar/desativar itens individuais dentro de cada seção;
- editar textos, imagens, listas e botões;
- adicionar novos cards, highlights, serviços e outros itens repetíveis;
- reordenar itens via drag and drop;
- salvar rascunho e publicar;
- visualizar preview;
- controlar links internos e externos dos botões.

## Padrão obrigatório para todas as seções da home

Cada seção da home deverá suportar:
- switch de exibição da seção;
- switch de exibição para cada item configurável;
- campo de título opcional com on/off;
- campo de subtítulo opcional com on/off;
- campo de descrição opcional com on/off;
- imagem opcional com on/off;
- botões opcionais com on/off;
- configuração de ordem dos elementos;
- controle de espaçamento/organização futuro, se necessário.

## Comportamento padrão dos botões

Todo botão editável no sistema deve possuir:
- texto do botão;
- switch on/off do botão;
- tipo de link: interno ou externo;
- seletor de link interno com autocomplete e sugestões;
- campo manual para URL externa;
- definição de abertura:
  - links internos: mesma aba;
  - links externos: nova aba;
- opção futura para âncora interna.

---

## 6.2. Estrutura da Home por seção

### 6.2.1. Hero

#### Campos editáveis
- switch da seção;
- caption (on/off + conteúdo);
- título (on/off + conteúdo);
- subtítulo (on/off + conteúdo);
- texto de apoio (on/off + conteúdo);
- imagem de destaque (on/off + upload/seleção);
- CTA principal (on/off + texto + link);
- CTA secundário (on/off + texto + link).

#### Requisitos adicionais
- permitir controle da ordem visual dos elementos de texto;
- preview da imagem;
- possibilidade futura de variar layout de hero.

---

### 6.2.2. Big Numbers

#### Campos editáveis
- switch da seção;
- título da seção (on/off + conteúdo);
- subtítulo da seção (on/off + conteúdo);
- descrição opcional (on/off + conteúdo);
- lista de cards numéricos.

#### Cada card de big number deve permitir
- switch on/off do card;
- número principal;
- prefixo opcional, como "+";
- sufixo opcional, como "%";
- legenda/título do card;
- descrição curta opcional (on/off + conteúdo);
- ícone opcional (on/off + mídia);
- ordem;
- duplicar card;
- excluir card.

#### Requisitos adicionais
- permitir adicionar quantos cards forem necessários;
- reordenar cards por drag and drop;
- definir quantidade máxima por linha no front futuramente.

---

### 6.2.3. Seção “Meus Projetos”

#### Campos editáveis
- switch da seção;
- título (on/off + conteúdo);
- subtítulo (on/off + conteúdo);
- descrição (on/off + conteúdo);
- botão da seção (on/off + texto + link);
- lista de projetos em destaque.

#### Requisitos adicionais
- seleção manual de projetos em destaque;
- ordenação manual dos projetos exibidos;
- opção de definir quantidade de projetos visíveis;
- modo de exibição futuro: grid, carrossel ou masonry.

---

### 6.2.4. Seção “Sobre Mim”

#### Campos editáveis
- switch da seção;
- título (on/off + conteúdo);
- subtítulo (on/off + conteúdo);
- texto principal (on/off + conteúdo);
- imagem da arquiteta (on/off + upload/seleção);
- lista de highlights/destaques;
- botão opcional (on/off + texto + link).

#### Cada highlight deve permitir
- switch on/off;
- texto do destaque;
- ícone opcional (on/off);
- ordem;
- duplicar;
- excluir.

#### Requisitos adicionais
- adicionar quantos highlights forem necessários;
- reordenar highlights por drag and drop.

---

### 6.2.5. Seção “Meus Serviços”

#### Campos editáveis
- switch da seção;
- título (on/off + conteúdo);
- subtítulo (on/off + conteúdo);
- descrição introdutória (on/off + conteúdo);
- botão opcional da seção (on/off + texto + link);
- lista de serviços.

#### Cada serviço deve permitir
- switch on/off;
- nome do serviço;
- descrição;
- imagem ou ícone opcional (on/off);
- botão opcional do card (on/off + texto + link);
- ordem;
- duplicar;
- excluir.

#### Requisitos adicionais
- adicionar serviços ilimitados;
- reordenar por drag and drop.

---

### 6.2.6. Seção “Chat com IA”

#### Campos editáveis
- switch da seção;
- título (on/off + conteúdo);
- subtítulo (on/off + conteúdo);
- descrição principal (on/off + conteúdo);
- lista de benefícios;
- texto de apoio/chamada final (on/off + conteúdo);
- imagem/ilustração opcional (on/off + upload/seleção);
- botão principal (on/off + texto + ação/link).

#### Cada benefício deve permitir
- switch on/off;
- texto do item;
- ícone opcional;
- ordem;
- duplicar;
- excluir.

---

### 6.2.7. Footer

#### Campos editáveis
- switch da seção;
- nome institucional (on/off + conteúdo);
- texto institucional (on/off + conteúdo);
- endereço (on/off + conteúdo);
- telefone (on/off + conteúdo);
- WhatsApp (on/off + conteúdo);
- e-mail (on/off + conteúdo);
- Instagram (on/off + conteúdo);
- links adicionais em lista;
- copyright (on/off + conteúdo).

#### Cada link adicional deve permitir
- switch on/off;
- label do link;
- tipo de link: interno ou externo;
- autocomplete para páginas internas;
- URL manual externa;
- abrir em nova aba quando externo;
- ordem;
- duplicar;
- excluir.

---

## 6.3. Requisitos de UX para a Home

- interface modular por blocos;
- cada seção com preview simples;
- ações rápidas de salvar, publicar, cancelar alterações;
- upload de imagem com pré-visualização;
- campos organizados por tabs ou accordions;
- switches visuais claros para exibição;
- componentes repetíveis com drag and drop.

---

# 7. Módulo: Gestão de Projetos

## 7.1. Objetivo
Permitir CRUD completo de projetos com liberdade visual e editorial.

## 7.2. Requisitos funcionais

O sistema deve permitir:
- criar projeto;
- editar projeto;
- excluir projeto;
- duplicar projeto;
- salvar como rascunho;
- publicar/despublicar;
- ordenar projetos;
- destacar projetos;
- pesquisar projetos;
- filtrar por status.

## 7.3. Estrutura do projeto

Cada projeto deverá conter:
- título;
- slug/url;
- imagem de capa;
- categoria;
- subtítulo opcional;
- resumo curto;
- conteúdo completo com editor rico;
- galeria moderna de imagens;
- imagem SEO/social share;
- status (rascunho/publicado);
- data de publicação;
- ordem manual;
- projeto em destaque (sim/não).

## 7.4. Editor rico do projeto

O editor deve ser visual, amigável e flexível, permitindo criar páginas de projeto da forma que a arquiteta quiser.

### Recursos esperados do editor
- título e subtítulo;
- parágrafos;
- cabeçalhos;
- listas;
- citações;
- divisores;
- imagens;
- galerias;
- blocos lado a lado;
- textos em colunas;
- vídeos incorporados;
- botões;
- destaque de texto;
- espaçamentos;
- blocos reutilizáveis;
- arrastar e reorganizar blocos;
- preview.

### Configuração de botões dentro do editor
Todo bloco de botão deve suportar:
- texto;
- on/off;
- link interno com autocomplete;
- link externo manual;
- abertura em nova aba quando externo.

## 7.5. Galeria moderna no detalhe do projeto

A galeria do projeto deverá:
- aceitar múltiplas imagens;
- permitir reordenação por drag and drop;
- definir imagem principal;
- permitir legenda por imagem;
- permitir alt text;
- abrir em visualização ampliada/lightbox;
- suportar layouts modernos:
  - grid,
  - masonry,
  - carrossel,
  - full width,
  - combinação editorial.

## 7.6. Requisitos de experiência
- painel visual limpo;
- miniaturas das imagens;
- upload múltiplo;
- arrastar para reordenar;
- experiência semelhante a construtores modernos.

---

# 8. Módulo: Gestão de Páginas

## 8.1. Objetivo
Permitir criação de páginas livres além da home e dos projetos.

## 8.2. Requisitos funcionais
O administrador poderá:
- criar página;
- editar página;
- excluir página;
- salvar rascunho;
- publicar/despublicar;
- duplicar página;
- definir slug;
- definir SEO básico.

## 8.3. Estrutura de uma página
- título;
- slug;
- descrição curta opcional;
- imagem de capa opcional;
- conteúdo com editor rico;
- status;
- data;
- SEO title;
- meta description;
- imagem de compartilhamento.

## 8.4. Editor rico
Mesmo padrão do editor de projetos, com liberdade para montar layout e conteúdo de forma visual.

## 8.5. Botões e links em páginas
Todo botão ou CTA criado dentro do editor deverá suportar:
- texto;
- on/off;
- link interno com autocomplete;
- link externo manual;
- abertura em nova aba quando externo.

---

# 9. Módulo: Criador de Formulários

## 9.1. Objetivo
Permitir criação de formulários personalizados sem código.

## 9.2. Requisitos funcionais
O sistema deve permitir:
- criar formulário;
- editar formulário;
- excluir formulário;
- duplicar formulário;
- publicar/despublicar;
- incorporar em páginas;
- receber submissões;
- visualizar respostas;
- exportar respostas.

## 9.3. Construtor drag and drop
O criador de formulários deverá ter experiência visual com arrastar e soltar campos.

## 9.4. Tipos de campo
- texto curto;
- texto longo;
- e-mail;
- telefone;
- número;
- CPF/CNPJ opcional;
- data;
- seleção única;
- múltipla escolha;
- dropdown;
- checkbox;
- radio;
- upload de arquivo;
- URL;
- endereço;
- título/separador;
- texto explicativo;
- campo oculto;
- aceite de termos.

## 9.5. Configurações por campo
- label;
- placeholder;
- help text;
- obrigatório ou não;
- valor padrão;
- máscara;
- largura do campo;
- validações;
- ordem;
- visibilidade do campo.

## 9.6. Configurações do formulário
- nome interno;
- título visível;
- descrição;
- mensagem de sucesso;
- ação após envio;
- redirecionamento opcional;
- envio por e-mail;
- integração com WhatsApp opcional;
- armazenamento de leads.

## 9.7. Gestão das submissões
- listagem de respostas;
- data e hora;
- nome do formulário;
- status da submissão;
- visualização detalhada;
- exportação CSV/Excel;
- busca e filtros.

---

# 10. Módulo: Chat com IA

## 10.1. Objetivo
Permitir configuração e treinamento operacional da IA que conversa com o visitante do site.

## 10.2. Função do chat
A IA deverá:
- conversar com o cliente;
- entender o que ele precisa;
- fazer apenas perguntas necessárias;
- sugerir qual serviço é mais adequado;
- organizar a mensagem final;
- encaminhar para o WhatsApp com tudo estruturado;
- manter todas as informações do cliente sem resumir indevidamente.

## 10.3. Módulo de “Treinamento” no painel
Deve existir uma área no painel chamada:

**Treinamento da IA**
ou
**Configuração da IA**

## 10.4. Estrutura do treinamento
Ao invés de um único campo gigante, o sistema terá vários campos organizados, que serão combinados internamente em um grande prompt final.

### Campos sugeridos
- nome da arquiteta;
- posicionamento da marca;
- tom de voz;
- objetivo da IA;
- instruções gerais;
- o que a IA deve fazer;
- o que a IA não deve fazer;
- serviços oferecidos;
- critérios para recomendar cada serviço;
- perguntas essenciais;
- perguntas opcionais;
- estrutura da mensagem final;
- texto fixo de encerramento;
- número do WhatsApp de destino;
- regra de preservação das informações do cliente;
- exemplos de entrada;
- exemplos de saída.

## 10.5. Regras operacionais da IA
A IA deve:
- falar de forma natural;
- não inventar informações;
- não remover detalhes do cliente;
- perguntar só o necessário;
- sugerir o serviço mais compatível;
- gerar mensagem organizada para WhatsApp;
- sempre terminar com:
  **Você pode me ajudar?**

## 10.6. Funcionalidades administrativas
- editar prompt-base;
- testar IA dentro do painel;
- visualizar prompt compilado;
- salvar versões;
- ativar/desativar versão;
- histórico de alterações;
- campos com ajuda contextual.

## 10.7. Área de teste
O painel deverá ter um simulador do chat para:
- testar perguntas;
- validar respostas;
- revisar a mensagem final;
- conferir recomendação do serviço.

---

# 11. Módulo: Configurações gerais do site

## 11.1. Objetivo
Centralizar todas as informações institucionais e de contato.

## 11.2. Campos editáveis
- nome do site;
- nome profissional;
- logo principal;
- favicon;
- e-mail;
- telefone;
- WhatsApp;
- Instagram;
- endereço completo;
- links externos;
- horário de atendimento;
- texto institucional;
- copyright;
- mapa/link de localização.

## 11.3. Uso dessas informações
Esses dados poderão ser reaproveitados automaticamente em:
- footer;
- página de contato;
- links de WhatsApp;
- formulários;
- SEO;
- dados estruturados futuros.

---

# 12. Módulo: Gestão de mídia

## 12.1. Objetivo
Permitir upload e organização de imagens do site.

## 12.2. Requisitos funcionais
- biblioteca de mídia;
- upload único e múltiplo;
- preview;
- busca por nome;
- filtros;
- edição de alt text;
- legenda;
- nome interno;
- exclusão;
- compressão automática opcional.

---

# 13. Módulo: SEO básico

## 13.1. Objetivo
Permitir controle mínimo de SEO por página e projeto.

## 13.2. Campos
- meta title;
- meta description;
- slug;
- imagem para compartilhamento;
- index/noindex opcional.

---

# 14. Painel administrativo — requisitos de UX

## 14.1. Diretrizes
O painel deve ser:
- elegante;
- intuitivo;
- amigável para não técnicos;
- visualmente organizado;
- responsivo;
- rápido.

## 14.2. Estrutura sugerida do menu lateral
- Dashboard
- Home
- Projetos
- Páginas
- Formulários
- Submissões
- Chat com IA
- Mídia
- Configurações
- Usuários

## 14.3. Padrões de interação
- autosave opcional ou aviso de alterações não salvas;
- botões claros de salvar/publicar;
- feedback visual de sucesso/erro;
- drag and drop fluido;
- visualização prévia;
- tabelas com filtros e pesquisa;
- interface moderna.

---

# 15. Dashboard inicial

## 15.1. Objetivo
Dar visão geral do sistema.

## 15.2. Cards sugeridos
- total de projetos;
- projetos publicados;
- páginas publicadas;
- formulários ativos;
- total de leads recebidos;
- últimas submissões;
- último conteúdo editado.

---

# 16. Requisitos não funcionais

- sistema responsivo;
- boa performance;
- arquitetura escalável;
- segurança para área admin;
- autenticação com login e senha;
- permissões por tipo de usuário;
- versionamento básico de conteúdo sensível;
- uploads otimizados;
- usabilidade para usuários não técnicos.

---

# 17. Regras de negócio

1. A home deve possuir seções independentes e editáveis.
2. Cada item interno relevante das seções da home deve possuir switch on/off.
3. Botões editáveis devem suportar link interno e externo.
4. Links internos devem exibir autocomplete de páginas existentes.
5. Links externos devem abrir em nova aba.
6. Projetos devem suportar rascunho e publicação.
7. Páginas devem poder ser criadas livremente.
8. O editor rico deve permitir liberdade de criação sem exigir código.
9. Formulários devem ser criados visualmente.
10. O chat com IA deve ser configurável pelo painel.
11. O prompt da IA deve ser montado a partir de múltiplos campos.
12. A mensagem final do chat deve preservar o conteúdo do cliente.
13. Informações institucionais devem ser centralizadas em configurações globais.
14. Imagens devem ser gerenciáveis via biblioteca de mídia.

---

# 18. Fluxos principais

## 18.1. Editar seção da home
Admin acessa Home > escolhe seção > ativa/desativa itens necessários > edita campos > faz upload/seleciona imagem > configura botões > salva > publica.

## 18.2. Criar novo projeto
Admin acessa Projetos > Novo projeto > preenche informações básicas > usa editor rico > adiciona galeria > define capa > salva rascunho ou publica.

## 18.3. Criar página nova
Admin acessa Páginas > Nova página > define título/slug > usa editor rico > salva ou publica.

## 18.4. Criar formulário
Admin acessa Formulários > Novo formulário > arrasta campos > configura labels/help text/obrigatoriedade > salva > publica > incorpora em página.

## 18.5. Configurar IA
Admin acessa Chat com IA > preenche campos de treinamento > visualiza prompt final > testa no simulador > salva versão ativa.

---

# 19. Critérios de sucesso

O produto será considerado bem-sucedido quando permitir que a arquiteta:

- atualize a home sem ajuda técnica;
- controle a exibição de itens individuais em cada seção;
- publique novos projetos com facilidade;
- crie páginas livremente;
- monte formulários personalizados;
- altere os dados de contato do site;
- configure o comportamento da IA sem editar código;
- gerencie tudo de forma centralizada e intuitiva.

---

# 20. Roadmap sugerido

## Fase 1 — Base do CMS
- login admin;
- dashboard;
- gestão da home com switches por item;
- gestão de contatos/configurações;
- mídia.

## Fase 2 — Conteúdo avançado
- gestão de projetos;
- gestão de páginas;
- editor rico.

## Fase 3 — Captação
- criador de formulários;
- submissões;
- integrações básicas.

## Fase 4 — IA
- painel de treinamento;
- prompt builder;
- simulador;
- integração com WhatsApp.

---

# 21. Sugestão de stack

Para esse tipo de produto, uma stack moderna faria bastante sentido:

- **Frontend admin + site**: Next.js
- **UI**: Tailwind + shadcn/ui
- **Editor rico**: Tiptap ou similar
- **Banco**: Convex
- **Storage**: Convex
- **Auth**: auth própria
- **Form builder**: estrutura customizada com schema dinâmico
- **IA**: hugging face

---

# 22. Próximos entregáveis recomendados

Depois desse PRD, o ideal é criar:

1. mapa de módulos;
2. arquitetura de informação do painel;
3. lista de entidades do banco;
4. fluxos de usuário;
5. wireframes do admin;
6. task breakdown técnico por módulo.

