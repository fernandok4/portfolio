# SEO para Atrair Clientes — Pesquisa Consolidada
**Data:** 2026-04-29 | **Site alvo:** kanasha.com.br

---

## 1. Contexto: O que o Google prioriza em 2026

O Google evoluiu para avaliar **intenção e credibilidade**, não apenas palavras-chave. Os fatores que mais impactam o ranqueamento para quem vende serviços:

1. **E-E-A-T** (Experience, Expertise, Authoritativeness, Trust) — o Google quer provar que você realmente faz o que diz
2. **Topical Authority** — ser reconhecido como referência em um nicho específico
3. **Core Web Vitals** — LCP < 2.5s, INP < 200ms, CLS < 0.1
4. **Intenção de busca** — conteúdo alinhado com o que o cliente procura quando quer contratar
5. **AI Overviews** — Google gera respostas automáticas; FAQ e structured data aumentam chance de aparecer em 73%

---

## 2. Palavras-chave alvo (por intenção de contratação)

### Primárias (quem quer contratar)
```
desenvolvedor software freelancer brasil
desenvolvedor app mobile flutter brasil
contratar desenvolvedor software santos sp
desenvolvedor sistema sob medida sp
agentes ia automação empresa brasil
```

### Secundárias (quem está pesquisando soluções)
```
quanto custa desenvolver um app
como desenvolver sistema sob medida
automação processos ia pequena empresa
integração pagamentos stripe brasil
mvp startup brasil
```

### Long-tail (alta conversão, menor concorrência)
```
desenvolvedor flutter freelancer são paulo
criar app mobile empresa santos sp
automação ia claude agentes brasil
sistema pagamento recorrente freelancer
```

---

## 3. Melhorias On-Page que mais convertem clientes

### 3.1 FAQ Schema (impacto: alto — AI Overviews)
Adicionar seção FAQ visível + JSON-LD `FAQPage`. Google usa isso para responder buscas do tipo "quanto custa um app" mostrando **seu site**.

### 3.2 `ProfessionalService` Schema
Substituir/complementar o schema `Person` com `ProfessionalService` para ranquear em buscas de serviço.

### 3.3 Heading hierarchy com keywords
- H1: deve conter a proposta de valor principal
- H2: deve incluir termos que clientes buscam ("apps mobile", "agentes de IA", "pagamentos")
- Sem keywords nos headings = invisível para o Google

### 3.4 Seção FAQ visível na página
Conteúdo Q&A ranqueia organicamente para perguntas long-tail. Clientes que buscam "quanto custa um app" precisam encontrar sua resposta.

---

## 4. E-E-A-T: Como demonstrar credibilidade para atrair clientes

O Google March 2026 update amplificou o peso da **Experiência real**. Para um desenvolvedor freelancer:

- **Cases específicos** — Mordi precisa estar detalhado quando lançar (resultados mensuráveis)
- **Números concretos** — "7+ anos em fintech", "~10 anos de experiência" ✓ (já aplicado)
- **Formação** — MBA USP/Esalq ✓ (já aplicado)
- **LinkedIn ativo** — publicar sobre projetos e resultados semanalmente
- **GitHub** — repositórios públicos com código real
- **Depoimentos** — quando tiver clientes, adicionar testimonials com nome real

---

## 5. Local SEO para Santos, SP

Para clientes que buscam desenvolvedor na região:

- `meta geo.region` e `geo.placename` ✓ (já aplicado)
- "Santos, SP" no title e description ✓ (já aplicado)
- `address` no JSON-LD ✓ (já aplicado)
- **Google Business Profile** — criar perfil em maps.google.com/business como "Desenvolvedor de Software"
- Mencionar Santos/SP naturalmente no texto da página

---

## 6. AI Overviews — aparecer nas respostas automáticas do Google

Em 2026, 15% das buscas mostram uma resposta automática gerada por IA no topo. Para aparecer:

- **FAQ Schema** (JSON-LD `FAQPage`) — mais impactante
- **Structured data completo** — Person + ProfessionalService + FAQ
- **Conteúdo Q&A** — perguntas e respostas reais na página
- **Consistência de entidade** — nome, email e URL iguais em todos os lugares (LinkedIn, GitHub, página)

---

## 7. Core Web Vitals — Status do kanasha.com.br

A página atual (single HTML file + nginx) tem vantagens nativas:

| Métrica | Meta Google | Status estimado |
|---|---|---|
| LCP | < 2.5s | ✅ provável (sem imagens pesadas) |
| INP | < 200ms | ✅ provável (JS mínimo) |
| CLS | < 0.1 | ✅ provável (layout fixo) |

**O que monitorar após publicar:**
- Google Search Console → Core Web Vitals report
- PageSpeed Insights (web.dev/measure)

---

## 8. Link Building para freelancer (off-page)

Backlinks são o fator off-page #1. Para um desenvolvedor:

| Fonte | Ação | Dificuldade |
|---|---|---|
| LinkedIn | Publicar artigos linkando para o site | Fácil |
| GitHub | Bio com link para kanasha.com.br | Fácil |
| Beacons.ai | Já tem perfil — adicionar link | Fácil |
| Dev.to / TabNews | Publicar artigos técnicos com link | Médio |
| Medium BR | Artigos sobre IA e desenvolvimento | Médio |
| Diretórios BR | BRFreelas, GetNinjas, Workana | Médio |

---

## 9. Plano de ação em prioridade

### Imediato (na página — feito nessa sessão)
- [x] Title com local "Santos, SP" e keywords
- [x] Meta description otimizada
- [x] Canonical para kanasha.com.br
- [x] og:image + twitter:card
- [x] Favicon
- [x] robots.txt + sitemap.xml
- [x] JSON-LD Person com LinkedIn, alumniOf, address
- [x] geo meta tags
- [ ] **FAQ Schema + seção FAQ** ← próximo passo
- [ ] **ProfessionalService Schema** ← próximo passo

### Curto prazo (fora da página)
- [ ] Publicar site em kanasha.com.br
- [ ] Criar Google Business Profile
- [ ] Submeter sitemap no Google Search Console
- [ ] Publicar 1 artigo/semana no LinkedIn linkando para o site
- [ ] Atualizar GitHub bio com link para kanasha.com.br

### Médio prazo (construção de autoridade)
- [ ] Publicar case do Mordi com métricas reais
- [ ] Escrever 2-3 artigos no Dev.to ou TabNews
- [ ] Solicitar depoimentos dos primeiros clientes

---

## Referências

- [Google Ranking Factors 2026 — Backlinko](https://backlinko.com/google-ranking-factors)
- [Core Web Vitals 2026 — Google Developers](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [E-E-A-T March 2026 — Digital Applied](https://www.digitalapplied.com/blog/e-e-a-t-march-2026-google-rewards-experience-content-guide)
- [AI Overviews Ranking Factors 2026 — Wellows](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [Structured Data Guide 2026 — Clickforest](https://www.clickforest.com/en/blog/structured-data-google)
- [Technical SEO Checklist 2026 — NoGood](https://nogood.io/blog/technical-seo-checklist/)
- [SEO para Freelancers — Xolo](https://blog.xolo.io/seo-guide-for-freelancers)
- [Top Serviços Freelancer Brasil 2026 — BRFreelas](https://brfreelas.com.br/blog/top-10-servicos-mais-contratados-por-freelancers-em-2026/)
