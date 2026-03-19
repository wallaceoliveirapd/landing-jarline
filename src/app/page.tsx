
// @ts-nocheck
"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChatWidget } from "@/components/chat-widget";
import { Logo } from "@/components/logo";
import Image from "next/image";


gsap.registerPlugin(ScrollTrigger);

// ─── Project carousel card — resolves coverImage via useQuery ─────────────────
function ProjectCarouselCard({ project }: { project: any }) {
  const isStorageId = project.coverImage && !project.coverImage.startsWith("http");
  const coverUrl = useQuery(api.files.getImageUrl, isStorageId ? { storageId: project.coverImage } : "skip");
  const bgImage = isStorageId ? (coverUrl || "assets/images/project-1.png") : (project.coverImage || "assets/images/project-1.png");
  return (
    <a href={`/projects/${project.slug}`} className="project-card" style={{ textDecoration: "none" }}>
      <div className="project-card-bg" style={{ backgroundImage: `url('${bgImage}')` }}></div>
      <div className="project-overlay"></div>
      <div className="project-info">
        <p className="project-title">{project.title}</p>
        <p className="project-desc">{project.category || "Projeto"}{project.subtitle ? " · " + project.subtitle : ""}</p>
      </div>
    </a>
  );
}

export default function Page() {
  const heroSettings = useQuery(api.settings.getSetting, { key: "hero" });
  const bigNumbersSettings = useQuery(api.settings.getSetting, { key: "bignumbers" });
  const aboutSettings = useQuery(api.settings.getSetting, { key: "about" });
  const projectsSettings = useQuery(api.settings.getSetting, { key: "home-projects" });
  const servicesSettings = useQuery(api.settings.getSetting, { key: "services" });
  const aiSectionSettings = useQuery(api.settings.getSetting, { key: "ai_section" });
  const footerSettings = useQuery(api.settings.getSetting, { key: "footer" });
  const projectsList = useQuery(api.projects.getProjects);
  const aiConfigSettings = useQuery(api.settings.getSetting, { key: "ai_config" });
  const aiConfig = aiConfigSettings?.value ?? null;
  const [showChat, setShowChat] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const queriesLoaded = heroSettings !== undefined && bigNumbersSettings !== undefined &&
    aboutSettings !== undefined && servicesSettings !== undefined &&
    aiSectionSettings !== undefined && footerSettings !== undefined && projectsList !== undefined;

  useEffect(() => {
    if (queriesLoaded && !hasInitiallyLoaded) {
      setHasInitiallyLoaded(true);
    }
  }, [queriesLoaded, hasInitiallyLoaded]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "preview_update") {
        setPreviewData(event.data.payload);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const defaultHero = {
    isEnabled: true,
    caption: "Soluções em arquitetura e interiores",
    title: "Arquitetura com alma e função",
    subtitle: "Projetos que unim funcionalidade, estética e sensibilidade para criar ambientes que fazem sentido para a sua rotina.",
    ctaPrimary: { isEnabled: true, text: "Ver projetos", link: "#projetos" },
    ctaSecondary: { isEnabled: true, text: "Saber mais", link: "#sobre" }
  };

  const defaultBigNumbers = {
    isEnabled: true,
    stats: [
      { isEnabled: true, number: "56", prefix: "+", label: "Projetos entregues e executados" },
      { isEnabled: true, number: "30", prefix: "+", label: "Clientes satisfeitos" },
      { isEnabled: true, number: "20", prefix: "+", label: "Ambientes transformados" },
      { isEnabled: true, number: "100", suffix: "%", label: "Projetos pensados de forma personalizada" }
    ]
  };

  const defaultAbout = {
    isEnabled: true,
    title: "Jarline Vieira",
    subtitle: "Prazer, sou",
    description: "Sou arquiteta e acredito que a arquitetura vai muito além de desenhar ambientes bonitas. Um espaço bem pensado pode melhorar a rotina, despertar sensações, valorizar histórias e transformar a forma como as pessoas vivem, trabalham e conectam com o lugar onde estão."
  };

  const defaultServices = {
    isEnabled: true,
    list: [
      { isEnabled: true, title: "Consultoria de Arquitetura", description: "Para quem precisa de direcionamento profissional, ideias mais claras e soluções práticas para o espaço.", num: "01" },
      { isEnabled: true, title: "Projeto de Interiores", description: "Desenvolvimento de ambientes internos com foco em conforto, funcionalidade, estética e identidade.", num: "02" },
      { isEnabled: true, title: "Projeto Arquitetônico", description: "Planejamento completo do espaço, considerando distribuição, aproveitamento e intenção estética.", num: "03" },
      { isEnabled: true, title: "Reforma e Readequação", description: "Para quem deseja renovar um ambiente existente, melhorar sua funcionalidade ou adaptar o espaço.", num: "04" },
      { isEnabled: true, title: "Acompanhamento de Projeto", description: "Suporte para auxiliar nas decisões ao longo do processo, trazendo mais segurança e clareza.", num: "05" }
    ]
  };

  const defaultAiSection = {
    isEnabled: true,
    title: "Descubra por onde começar",
    subtitle: "Nem sempre é fácil saber qual serviço escolher ou como explicar tudo o que você precisa logo no primeiro contato.",
    benefits: [
      "Você explica o que precisa do seu jeito",
      "Eu faço apenas perguntas essenciais",
      "Recebo uma orientação inicial mais clara",
      "Sua mensagem vai organizada direto para o WhatsApp"
    ]
  };

  const defaultFooter = {
    isEnabled: true,
    institutionalName: "Jarline Vieira",
    contact: { whatsapp: "5581999999999", email: "email@email.com", address: "Av. Monteiro da Franca, 815 — Manaíra, João Pessoa - PB" },
    social: { instagram: "" },
    copyright: "Todos os direitos reservados © 2026"
  };

  const hero = previewData?.hero ?? (hasInitiallyLoaded && heroSettings?.value ? heroSettings.value : defaultHero);
  const heroBgStorageId: string | undefined = hero?.heroBgStorageId;
  const heroBgIsStorageId = heroBgStorageId && !heroBgStorageId.startsWith("http");
  const heroBgUploadedUrl = useQuery(api.files.getImageUrl, heroBgIsStorageId ? { storageId: heroBgStorageId } : "skip");
  const bigNumbers = previewData?.bigNumbers ?? (hasInitiallyLoaded && bigNumbersSettings?.value ? bigNumbersSettings.value : defaultBigNumbers);
  const about = previewData?.about ?? (hasInitiallyLoaded && aboutSettings?.value ? aboutSettings.value : defaultAbout);
  const services = previewData?.services ?? (hasInitiallyLoaded && servicesSettings?.value ? servicesSettings.value : defaultServices);
  const aiSection = previewData?.aiSection ?? (hasInitiallyLoaded && aiSectionSettings?.value ? aiSectionSettings.value : defaultAiSection);
  const footer = previewData?.footer ?? (hasInitiallyLoaded && footerSettings?.value ? footerSettings.value : defaultFooter);
  const projectsData = previewData?.projects ?? (hasInitiallyLoaded && projectsSettings?.value ? projectsSettings.value : null);

  const formatHeroTitle = (title: string) => {
    return title.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < title.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const whatsappNumber = useMemo(() => {
    const num = footer?.contact?.whatsapp || "5581999999999";
    return num.replace(/\D/g, '');
  }, [footer?.contact?.whatsapp]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Original javascript behavior adapted to be robust inside an effect
      // Will execute after full component mount

      (() => {
        'use strict';

        /* ── Custom Cursor ─────────────────────────────────────── */
        const cursor = document.getElementById('cursor');
        const cursorRing = document.getElementById('cursorRing');
        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;

        document.addEventListener('mousemove', e => {
          mouseX = e.clientX; mouseY = e.clientY;
          if (cursor) cursor.style.left = mouseX + 'px';
          if (cursor) cursor.style.top = mouseY + 'px';
        });

        // Ring follows with lag
        (function animateRing() {
          ringX += (mouseX - ringX) * 0.12;
          ringY += (mouseY - ringY) * 0.12;
          if (cursorRing) cursorRing.style.left = ringX + 'px';
          if (cursorRing) cursorRing.style.top = ringY + 'px';
          requestAnimationFrame(animateRing);
        })();

        // Hover state on interactive elements
        const interactives = 'a, button, .btn, .stat-card, .service-card, .project-card, .nav-link';
        document.querySelectorAll(interactives).forEach(el => {
          el.addEventListener('mouseenter', () => { if (cursor) cursor.classList.add('hover'); if (cursorRing) cursorRing.classList.add('hover'); });
          el.addEventListener('mouseleave', () => { if (cursor) cursor.classList.remove('hover'); if (cursorRing) cursorRing.classList.remove('hover'); });
        });


        /* ── Scroll Progress ───────────────────────────────────── */
        const progressEl = document.getElementById('scroll-progress');
        window.addEventListener('scroll', () => {
          const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
          if (progressEl) progressEl.style.width = pct + '%';
        }, { passive: true });


        /* ── Navbar on scroll ──────────────────────────────────── */
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
          if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });


        /* ── Intersection Observer — Reveal ────────────────────── */
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
          });
        }, { threshold: 0.12 });

        document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('in');
          } else {
            io.observe(el);
          }
        });


        /* ── Counter Animation ─────────────────────────────────── */
        const counterIO = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = +el.dataset.count;
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            let start = 0;
            const dur = 1400;
            const step = ts => {
              if (!start) start = ts;
              const progress = Math.min((ts - start) / dur, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = prefix + Math.round(eased * target) + suffix;
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            counterIO.unobserve(el);
          });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));


        /* ── Carousel ──────────────────────────────────────────── */
        const carousel = document.getElementById('carousel');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const cardW = 376;

        if (carousel && nextBtn && prevBtn) {
          nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: cardW, behavior: 'smooth' });
          });
          prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -cardW, behavior: 'smooth' });
          });

          // Drag to scroll
          let isDown = false, startX, scrollLeft;
          carousel.addEventListener('mousedown', e => {
            isDown = true; carousel.classList.add('grabbing');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
          });
          document.addEventListener('mouseup', () => { isDown = false; carousel.classList.remove('grabbing'); });
          document.addEventListener('mouseleave', () => { isDown = false; carousel.classList.remove('grabbing'); });
          carousel.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.4;
            carousel.scrollLeft = scrollLeft - walk;
          });
        }


        /* ── Hero Mouse Parallax ───────────────────────────────── */
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
          document.addEventListener('mousemove', e => {
            if (window.innerWidth < 768) return;
            const rect = heroSection.getBoundingClientRect();
            if (e.clientY < rect.top || e.clientY > rect.bottom) return;

            const cx = (e.clientX / window.innerWidth - 0.5) * 2;
            const cy = (e.clientY / window.innerHeight - 0.5) * 2;

            document.querySelectorAll('[data-parallax]').forEach(el => {
              const depth = +el.dataset.parallax;
              el.style.transform = `translate(${cx * depth}px, ${cy * depth * 0.6}px)`;
            });
          });
        }


        /* ── AI Send Button ────────────────────────────────────── */
        /* Removed - React now handles this with setShowChat(true) */


        /* ── Mobile Menu ───────────────────────────────────────── */
        const hamburger = document.getElementById('navHamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const backdrop = document.getElementById('mobileBackdrop');

        if (hamburger && mobileMenu && backdrop) {
          function openMenu() {
            hamburger.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
          }
          function closeMenu() {
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }

          hamburger.addEventListener('click', () => {
            mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
          });
          backdrop.addEventListener('click', closeMenu);
          document.querySelectorAll('[data-close]').forEach(el => {
            el.addEventListener('click', () => {
              closeMenu();
            });
          });
          document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMenu();
          });
        }


        /* ── Smooth hash scroll ────────────────────────────────── */
        document.querySelectorAll('a[href^="#"]').forEach(a => {
          a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          });
        });

      })();

    });
    return () => ctx.revert();
  }, [hasInitiallyLoaded]);

  if (!hasInitiallyLoaded) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-100 border-t-primary animate-spin"></div>
          <p className="text-zinc-400 text-sm font-medium tracking-wide">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/*  Hidden data for JS  */}
      <div id="whatsapp-number" data-phone={whatsappNumber} style={{ display: 'none' }} />

      {/*  Scroll progress  */}
      <div id="scroll-progress"></div>

      {/*  Custom cursor  */}
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/*  ═══════════════════════════════════════════════════════════
       NAVBAR
  ═══════════════════════════════════════════════════════════  */}
      <nav className="navbar" id="navbar">
        <div className="navbar-inner container">
          <a href="#inicio" aria-label="Jarline Vieira">
            {/*  Logo Header — fill #585947  */}
            <Image src="/assets/images/logo/logo-header.svg" alt="Jarline Vieira" width={143.65} height={49} style={{ display: "block" }} />
          </a>
          <div className="nav-links">
            <a href="#inicio" className="nav-link">Início</a>
            <a href="#sobre" className="nav-link">Sobre Mim</a>
            <a href="#projetos" className="nav-link">Projetos</a>
          </div>
          <div className="nav-ctas">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Contato</a>
            <a href="#orcamento" className="btn btn-primary">Orçamento com IA</a>
          </div>
          <button className="nav-hamburger" id="navHamburger" aria-label="Abrir menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/*  Mobile Menu  */}
      <div className="mobile-menu" id="mobileMenu" aria-hidden="true">
        <div className="mobile-menu-backdrop" id="mobileBackdrop"></div>
        <div className="mobile-menu-drawer">
          <nav className="mobile-nav-links">
            <a href="#inicio" className="mobile-nav-link" data-close>Início</a>
            <a href="#sobre" className="mobile-nav-link" data-close>Sobre Mim</a>
            <a href="#projetos" className="mobile-nav-link" data-close>Projetos</a>
            <a href="#servicos" className="mobile-nav-link" data-close>Serviços</a>
            <a href="#orcamento" className="mobile-nav-link" data-close>Orçamento</a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="mobile-nav-link">Contato</a>
          </nav>
          <div className="mobile-nav-ctas">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Contato</a>
            <a href="#orcamento" className="btn btn-primary" data-close>Orçamento com IA</a>
          </div>
          <p className="mobile-menu-footer">Jarline Vieira — Arquitetura e Interiores</p>
        </div>
      </div>

      {/*  ═══════════════════════════════════════════════════════════
       HERO
  ═══════════════════════════════════════════════════════════  */}
      {(hero?.isEnabled !== false) && (
        <section className="hero" id="inicio">
          <div className="container-hero">
            <div className="hero-inner">

              {/*  Left card  */}
              <div className="hero-card parallax-layer reveal" data-parallax="4">
                <div className="hero-text">
                  <p className="hero-eyebrow reveal d1">{hero.caption}</p>
                  <h1 className="hero-headline reveal d2">{formatHeroTitle(hero.title)}</h1>
                  <p className="hero-body reveal d3 preserve-whitespace">{hero.subtitle}</p>
                </div>
                <div className="hero-actions reveal d4">
                  {hero.ctaPrimary?.isEnabled !== false && <a href={hero.ctaPrimary?.link || "#projetos"} className="btn btn-cream">{hero.ctaPrimary?.text || "Ver projetos"}</a>}
                  {hero.ctaSecondary?.isEnabled !== false && <a href={hero.ctaSecondary?.link || "#sobre"} className="btn btn-ghost-light">{hero.ctaSecondary?.text || "Saber mais"}</a>}
                </div>
              </div>

              {/*  Right image  */}
              <div className="hero-image reveal d2" data-parallax="-2">
                <div className="hero-image-bg" style={{ "backgroundImage": `url('${heroBgUploadedUrl || "assets/images/hero-bg.png"}')` }}></div>
                <img className="hero-photo" src="assets/images/architect-hero.png" alt="Jarline Vieira" />
              </div>

            </div>
          </div>
        </section>
      )}

      {/*  ═══════════════════════════════════════════════════════════
       STATS
  ═══════════════════════════════════════════════════════════  */}
      {(bigNumbers?.isEnabled !== false) && (
        <section className="stats">
          <div className="container">
            <div className="stats-grid">
              {bigNumbers.stats?.filter((s: any) => s.isEnabled !== false)?.map((stat: any, i: number) => (
                <div className={`stat-card reveal d${i + 1}`} key={i}>
                  <div className="stat-value" data-count={stat.number} data-prefix={stat.prefix} data-suffix={stat.suffix}>0</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*  ═══════════════════════════════════════════════════════════
       ABOUT
  ═══════════════════════════════════════════════════════════  */}
      {(about?.isEnabled !== false) && (
        <section className="about" id="sobre">
          <div className="container">
            <div className="about-inner">
              <div className="about-text">
                <p className="about-intro reveal-l preserve-whitespace">{about.subtitle}</p>
                <h2 className="about-name reveal-l d1">{about.title}</h2>
                <div className="about-bio reveal d2">
                  <p className="preserve-whitespace">{about.description}</p>
                </div>
              </div>
              <div className="about-image-wrap reveal-r">
                <video className="about-video" autoPlay muted loop playsInline>
                  <source src="assets/images/bg-video.mp4" type="video/mp4" />
                </video>
                <img className="about-photo" src="assets/images/img-aboutme.png" alt="Jarline Vieira" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/*  ═══════════════════════════════════════════════════════════
       PROJECTS
  ═══════════════════════════════════════════════════════════  */}
      {(projectsData?.isEnabled !== false && projectsList && projectsList.filter((p: any) => p.status === "published").length > 0) && (
        <section className="projects" id="projetos">
          <div className="container">
            <h2 className="section-heading white reveal">{projectsData?.title || "Meus projetos"}</h2>
            <div className="carousel-wrap">
              <div className="carousel" id="carousel">
                {projectsList?.filter((p: any) => p.status === "published").slice(0, 5).map((project: any) => (
                  <ProjectCarouselCard key={project._id} project={project} />
                ))}
              </div>
            </div>
            <div className="carousel-nav reveal">
              <button className="btn-icon" id="prevBtn" aria-label="Anterior">
                <svg viewBox="0 0 20 20" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 15 8 10 13 5" />
                </svg>
              </button>
              <button className="btn-icon" id="nextBtn" aria-label="Próximo">
                <svg viewBox="0 0 20 20" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="7 5 12 10 7 15" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/*  ═══════════════════════════════════════════════════════════
       SERVICES
  ═══════════════════════════════════════════════════════════  */}
      {(services?.isEnabled !== false) && (
        <section className="services" id="servicos">
          {/*  Watermark rows  */}
          <div className="watermark-row top" aria-hidden="true">
            <div className="watermark-track">
              <span className="watermark-word">meus serviços</span>
              <span className="watermark-word">meus serviços</span>
              <span className="watermark-word">meus serviços</span>
              <span className="watermark-word">meus serviços</span>
              <span className="watermark-word">meus serviços</span>
              <span className="watermark-word">meus serviços</span>
            </div>
          </div>
          <div className="watermark-row bottom" aria-hidden="true">
            <div className="watermark-track">
              <span className="watermark-word">meus serviços</span>
              <span className="watermark-word">meus serviços</span>
              <span className="watermark-word">meus serviços</span>
              <span className="watermark-word">meus serviços</span>
              <span className="watermark-word">meus serviços</span>
              <span className="watermark-word">meus serviços</span>
            </div>
          </div>

          <div className="container" style={{ "position": "relative", "zIndex": "1" }}>
            <h2 className="section-heading olive reveal">O que faço</h2>
            <div className="services-grid">
              {services.list?.map((service: any, i: number) => (
                <div className={`service-card reveal d${(i % 3) + 1}`} key={i}>
                  <p className="service-num">{service.num || `0${i + 1}`}</p>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc preserve-whitespace">{service.description}</p>
                </div>
              ))}
            </div>
            <div className="services-actions reveal">
              <a href="#orcamento" className="btn btn-primary">Falar comigo agora</a>
              <a href="#orcamento" className="btn btn-secondary">Orçamento com IA</a>
            </div>
          </div>
        </section>
      )}

      {/*  ═══════════════════════════════════════════════════════════
       AI SECTION
  ═══════════════════════════════════════════════════════════  */}
      {(aiSection?.isEnabled !== false) && (
        <section className="ai-section" id="orcamento">
          <div className="container">
            <div className="ai-header">
              <h2 className="ai-title reveal">{aiSection.title}</h2>
              <p className="ai-subtitle reveal d1 preserve-whitespace">{aiSection.subtitle}</p>
            </div>
            <div className="ai-card reveal d2">
              <div className="ai-agent-row">
                <div className="ai-avatar">
                  <img src="assets/images/img-ia.png" alt="Jal — Agente de IA" />
                </div>
                <div className="ai-agent-body">
                  <p className="ai-agent-name">Olá, me chamo a Jal</p>
                  <p className="ai-agent-sub">Sou sua agente de IA, vou te ajudar a entender o que você precisa e te direcionar da melhor forma.</p>
                  <ul className="ai-features">
                    {aiSection.benefits?.map((benefit: any, i: number) => (
                      <li className="ai-feature" key={i}>
                        <span className="ai-check"><svg viewBox="0 0 12 12">
                          <polyline points="2 6 5 9 10 3" />
                        </svg></span>
                        <span className="ai-feature-text">{typeof benefit === 'string' ? benefit : (benefit?.text || "")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="ai-input-box">
                <textarea
                  id="ai-message"
                  className="ai-textarea"
                  placeholder="Você pode escrever, com suas próprias palavras, o que deseja para o seu espaço."
                  rows="5"
                />
                <div className="ai-input-actions">
                  <button
                    className="btn btn-primary"
                    id="ai-send-btn"
                    type="button"
                    onClick={() => {
                      const msg = (document.getElementById('ai-message') as HTMLTextAreaElement)?.value;
                      if (msg?.trim()) {
                        setShowChat(true);
                        setChatInitialMessage(msg.trim());
                      }
                    }}
                  >
                    Enviar mensagem
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/*  ═══════════════════════════════════════════════════════════
       FOOTER
  ═══════════════════════════════════════════════════════════  */}
      {(footer?.isEnabled !== false) && (
        <footer className="footer" id="contato">
          <div className="container">
            <div className="footer-grid">

              {/*  Brand  */}
              <div className="footer-brand reveal">
                <img src="/assets/images/logo/logo-branca.svg" alt="Jarline Vieira" width="180" style={{ display: "block" }} />
                <p className="footer-copyright">{footer.copyright}</p>
              </div>

              {/*  Contato  */}
              <div className="reveal d1">
                <p className="footer-col-title">Contato</p>
                <div className="footer-contacts">
                  {footer.contact?.whatsapp && (
                    <a href={`https://wa.me/${footer.contact.whatsapp.replace(/\D/g, '')}`} className="footer-contact-item">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {footer.contact.whatsapp}
                    </a>
                  )}
                  {footer.contact?.email && (
                    <a href={`mailto:${footer.contact.email}`} className="footer-contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m2 7 10 7 10-7" />
                      </svg>
                      {footer.contact.email}
                    </a>
                  )}
                </div>
              </div>

              {/*  Endereço  */}
              <div className="reveal d2">
                <p className="footer-col-title">Endereço</p>
                <div className="footer-contacts">
                  {footer.contact?.address && (
                    <a href="#" className="footer-contact-item" style={{ "alignItems": "flex-start" }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{ "marginTop": "2px", "flexShrink": "0" }}>
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {footer.contact.address}
                    </a>
                  )}
                </div>
              </div>

              {/*  Social  */}
              <div className="reveal d3">
                <p className="footer-col-title">Siga-me</p>
                <div className="footer-social">
                  {footer.social?.instagram && (
                    <a href={footer.social.instagram} aria-label="Instagram">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>
        </footer>
      )}

      {/*  Chat Widget - Controlled by page */}
      <ChatWidget
        config={aiConfig}
        initialMessage={chatInitialMessage}
        isOpen={showChat}
        onOpenChange={setShowChat}
      />

      {/*  Map  */}
      <div className="footer-map">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=-35.3593%2C-7.5368%2C-35.2793%2C-7.4768&layer=mapnik&marker=-7.5068%2C-35.3193"
          title="Localização" loading="lazy" allowFullScreen>
        </iframe>
      </div>

      {/*  ═══════════════════════════════════════════════════════════
       JAVASCRIPT
  ═══════════════════════════════════════════════════════════  */}
    </>
  );
}
