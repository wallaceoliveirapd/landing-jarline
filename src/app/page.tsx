
// @ts-nocheck
"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChatWidget } from "@/components/chat-widget";

gsap.registerPlugin(ScrollTrigger);

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
      "A IA faz apenas perguntas essenciais",
      "Recebe uma orientação inicial mais clara",
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
      <div id="whatsapp-number" data-phone={whatsappNumber} style={{display: 'none'}} />

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
        <svg width="196" height="32" viewBox="0 0 196 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#nh)">
            <path
              d="M10.9484 0V12.3487C10.9484 14.1888 10.3103 15.7644 9.10629 16.8994C7.94498 17.997 6.30579 18.6005 4.49308 18.6005C2.76045 18.6005 1.14529 17.9596 0 16.8299L0.525927 16.416C1.60982 17.5323 2.9767 18.1198 4.49308 18.1198C5.86262 18.1198 6.92516 17.746 7.65131 17.0062C8.84466 15.7911 8.80995 13.9618 8.79126 12.979V0H10.9484Z"
              fill="#585947" />
            <path
              d="M29.2998 18.4296H26.8811L25.6424 15.2463L25.2606 14.3356H14.7474L13.0735 18.427H12.5422L19.6249 0.9347L19.9666 0.0534115H22.073L29.2171 18.224L29.2972 18.427L29.2998 18.4296ZM25.0791 13.8549L20.052 0.998794L15.1932 13.1953L14.9449 13.8576H25.0817L25.0791 13.8549Z"
              fill="#585947" />
            <path
              d="M43.2383 13.1312L42.8752 13.2995L46.2604 18.4296H43.5293L41.172 14.7202C40.8196 14.1647 40.1895 13.8282 39.5328 13.8416C39.3539 13.8469 39.1751 13.8496 39.0229 13.8496H34.0519V18.4296H31.8495V0.058754H39.0229C43.2704 0.058754 46.9972 3.23139 46.9972 6.84735V7.061C46.9972 9.67549 45.8386 11.7425 43.7322 12.8802C43.4786 13.0164 43.2357 13.1285 43.233 13.1312H43.2383ZM44.7841 7.07168V6.83667C44.7841 2.98837 42.4161 0.301776 39.0256 0.301776H34.0546V13.6039H39.0256C42.4161 13.6039 44.7841 10.9173 44.7841 7.07168Z"
              fill="#585947" />
            <path
              d="M61.9527 17.9489C61.7925 18.1332 61.6297 18.3175 61.5336 18.4296H50.3343V0.817195L50.3423 0.0240345H51.2606H52.5234V17.9462H61.9527V17.9489Z"
              fill="#585947" />
            <path d="M66.4271 0.0373878V18.4296H64.2139V0.825207L64.2192 0.0373878H66.4297H66.4271Z" fill="#585947" />
            <path
              d="M86.3377 0.0347176V18.4296H85.0722L71.0965 3.40498L71.0911 18.4296H70.6079V0.0347176H71.3581L85.8625 15.5614V0.0347176H86.3377Z"
              fill="#585947" />
            <path
              d="M92.694 17.8768H102.665L102.249 18.4296H90.5316V0.0427284H102.753L102.276 0.528773H92.6913V7.60846H102.497L102.115 8.08649H92.6967V17.8768H92.694Z"
              fill="#585947" />
            <path
              d="M131.629 0.0347176L124.487 18.3335L124.453 18.4296H122.245L115.085 0.0347176H117.479L124.295 17.4362L130.692 0.961406L131.065 0.0347176H131.626H131.629Z"
              fill="#585947" />
            <path d="M136.397 0.0373878V18.4296H134.184V0.825207L134.189 0.0373878H136.399H136.397Z" fill="#585947" />
            <path
              d="M142.735 17.8768H152.706L152.29 18.4296H140.572V0.0427284H152.794L152.316 0.528773H142.732V7.60846H152.538L152.156 8.08649H142.737V17.8768H142.735Z"
              fill="#585947" />
            <path d="M157.821 0.0373878V18.4296H155.608V0.825207L155.613 0.0373878H157.824H157.821Z" fill="#585947" />
            <path
              d="M188.554 16.4881L188.987 16.894C186.862 18.2774 184.374 19.0065 181.768 19.0065C175.873 19.0065 171.212 17.0383 168.983 13.6039L168.879 13.4437L164.215 13.449V18.4403H162.055V0.825206V0.0640933H168.393C172.568 0.0667639 176.231 3.16463 176.231 6.69512V6.82331C176.231 9.68617 173.668 11.9882 171.287 12.9149L170.889 13.0698L171.127 13.4276C172.753 15.8846 177.051 17.8261 180.268 18.2854C183.212 18.7074 186.154 18.0664 188.554 16.4881ZM173.965 6.82598V6.68978C173.965 3.03377 171.674 0.480703 168.393 0.480703H164.215V13.0351H168.393C171.674 13.0351 173.965 10.482 173.965 6.82598ZM195.098 18.4136H192.716L191.2 14.6881L191.085 14.349H180.74L179.87 16.432C179.849 16.4828 179.776 16.5362 179.691 16.5255C179.48 16.5068 179.259 16.4774 179.026 16.4374C178.954 16.4267 178.893 16.3866 178.863 16.3332C178.834 16.2798 178.85 16.2397 178.855 16.2264L185.439 0.0400581H187.47L195.004 18.208L195.098 18.4136ZM190.682 13.4944L185.719 1.74121L181.093 13.4944H190.682Z"
              fill="#585947" />
            <path
              d="M38.9162 30.0211H36.8205L36.4334 31.0893H35.7713L37.5093 26.3063H38.2328L39.9654 31.0893H39.3033L38.9162 30.0211ZM38.7373 29.511L37.867 27.0835L36.9967 29.511H38.7347H38.7373Z"
              fill="#585947" />
            <path
              d="M44.7735 31.0893L43.6282 29.1238H42.87V31.0893H42.2426V26.2796H43.7937C44.1568 26.2796 44.4638 26.3411 44.7147 26.4666C44.9657 26.5894 45.1526 26.7577 45.278 26.9713C45.4035 27.1823 45.4649 27.4253 45.4649 27.695C45.4649 28.0262 45.3688 28.3173 45.1793 28.571C44.9897 28.8247 44.7014 28.9929 44.3196 29.0757L45.5263 31.0893H44.7735ZM42.87 28.6191H43.7937C44.1327 28.6191 44.389 28.5363 44.5599 28.368C44.7307 28.1998 44.8162 27.9755 44.8162 27.695C44.8162 27.4146 44.7334 27.1903 44.5652 27.0327C44.397 26.8752 44.1407 26.7977 43.7964 26.7977H42.8726V28.6191H42.87Z"
              fill="#585947" />
            <path
              d="M51.8081 32L50.8497 31.0413C50.6147 31.1054 50.3771 31.1374 50.1315 31.1374C49.6857 31.1374 49.2772 31.0333 48.9115 30.8223C48.543 30.614 48.2521 30.3202 48.0385 29.9463C47.8249 29.5725 47.7181 29.1505 47.7181 28.6805C47.7181 28.2105 47.8249 27.7885 48.0385 27.4146C48.2521 27.0407 48.543 26.747 48.9115 26.5387C49.2799 26.3304 49.6857 26.2236 50.1315 26.2236C50.5773 26.2236 50.9912 26.3277 51.3596 26.5387C51.728 26.747 52.0163 27.0381 52.2299 27.412C52.4408 27.7858 52.5476 28.2078 52.5476 28.6805C52.5476 29.1532 52.4461 29.5538 52.2432 29.9223C52.0403 30.2908 51.7627 30.5793 51.4076 30.7902L52.6223 31.9973H51.8081V32ZM48.5911 29.69C48.7459 29.9784 48.9569 30.2027 49.2265 30.3603C49.4961 30.5178 49.7978 30.5953 50.1342 30.5953C50.4706 30.5953 50.7722 30.5178 51.0419 30.3603C51.3115 30.2054 51.5224 29.981 51.6773 29.69C51.8321 29.4015 51.9095 29.065 51.9095 28.6831C51.9095 28.3013 51.8321 27.9594 51.6773 27.671C51.5224 27.3826 51.3115 27.1609 51.0472 27.006C50.7802 26.8485 50.4759 26.771 50.1369 26.771C49.7978 26.771 49.4935 26.8485 49.2265 27.006C48.9595 27.1636 48.7486 27.3853 48.5964 27.671C48.4416 27.9594 48.3642 28.2959 48.3642 28.6831C48.3642 29.0704 48.4416 29.4015 48.5964 29.69H48.5911Z"
              fill="#585947" />
            <path
              d="M55.519 26.2823V29.3241C55.519 29.7514 55.6231 30.0692 55.834 30.2775C56.0422 30.4858 56.3332 30.5873 56.707 30.5873C57.0807 30.5873 57.3637 30.4831 57.5719 30.2775C57.7802 30.0718 57.887 29.7541 57.887 29.3241V26.2823H58.5143V29.3187C58.5143 29.7193 58.4343 30.0558 58.2741 30.3309C58.1139 30.606 57.895 30.8089 57.6227 30.9425C57.3504 31.076 57.0434 31.1427 56.7016 31.1427C56.3599 31.1427 56.0556 31.076 55.7806 30.9425C55.5083 30.8089 55.292 30.606 55.1319 30.3309C54.9743 30.0585 54.8943 29.7193 54.8943 29.3187V26.2823H55.5216H55.519Z"
              fill="#585947" />
            <path d="M61.7073 26.2823V31.092H61.0799V26.2823H61.7073Z" fill="#585947" />
            <path d="M67.2522 26.2823V26.7924H65.9414V31.092H65.314V26.7924H63.9952V26.2823H67.2522Z" fill="#585947" />
            <path
              d="M70.1701 26.7924V28.4001H71.9214V28.9182H70.1701V30.5739H72.1297V31.092H69.5427V26.2743H72.1297V26.7924H70.1701Z"
              fill="#585947" />
            <path d="M77.5571 26.2823V26.7924H76.2463V31.092H75.6189V26.7924H74.3001V26.2823H77.5571Z" fill="#585947" />
            <path
              d="M80.4617 26.2823V29.3241C80.4617 29.7514 80.5659 30.0692 80.7768 30.2775C80.985 30.4858 81.276 30.5873 81.6498 30.5873C82.0235 30.5873 82.3065 30.4831 82.5147 30.2775C82.723 30.0718 82.8298 29.7541 82.8298 29.3241V26.2823H83.4571V29.3187C83.4571 29.7193 83.377 30.0558 83.2169 30.3309C83.0567 30.606 82.8378 30.8089 82.5655 30.9425C82.2931 31.076 81.9861 31.1427 81.6444 31.1427C81.3027 31.1427 80.9983 31.076 80.7234 30.9425C80.4511 30.8089 80.2348 30.606 80.0746 30.3309C79.9171 30.0585 79.837 29.7193 79.837 29.3187V26.2823H80.4644H80.4617Z"
              fill="#585947" />
            <path
              d="M88.5536 31.0893L87.4083 29.1238H86.6501V31.0893H86.0227V26.2796H87.5738C87.9369 26.2796 88.2439 26.3411 88.4948 26.4666C88.7458 26.5894 88.9327 26.7577 89.0581 26.9713C89.1836 27.1823 89.245 27.4253 89.245 27.695C89.245 28.0262 89.1489 28.3173 88.9594 28.571C88.7698 28.8247 88.4815 28.9929 88.0997 29.0757L89.3064 31.0893H88.5536ZM86.6501 28.6191H87.5738C87.9128 28.6191 88.1691 28.5363 88.34 28.368C88.5108 28.1998 88.5963 27.9755 88.5963 27.695C88.5963 27.4146 88.5135 27.1903 88.3453 27.0327C88.1771 26.8752 87.9209 26.7977 87.5765 26.7977H86.6527V28.6191H86.6501Z"
              fill="#585947" />
            <path
              d="M94.5737 30.0211H92.478L92.0909 31.0893H91.4288L93.1667 26.3063H93.8902L95.6228 31.0893H94.9608L94.5737 30.0211ZM94.3948 29.511L93.5245 27.0835L92.6542 29.511H94.3921H94.3948Z"
              fill="#585947" />
            <path
              d="M101.886 26.7924V28.4001H103.637V28.9182H101.886V30.5739H103.846V31.092H101.259V26.2743H103.846V26.7924H101.886Z"
              fill="#585947" />
            <path d="M110.301 26.2823V31.092H109.674V26.2823H110.301Z" fill="#585947" />
            <path
              d="M116.668 31.0893H116.041L113.515 27.2597V31.0893H112.888V26.2716H113.515L116.041 30.0932V26.2716H116.668V31.0893Z"
              fill="#585947" />
            <path d="M122.213 26.2823V26.7924H120.902V31.092H120.275V26.7924H118.956V26.2823H122.213Z" fill="#585947" />
            <path
              d="M125.131 26.7924V28.4001H126.882V28.9182H125.131V30.5739H127.09V31.092H124.504V26.2743H127.09V26.7924H125.131Z"
              fill="#585947" />
            <path
              d="M132.091 31.0893L130.946 29.1238H130.187V31.0893H129.56V26.2796H131.111C131.474 26.2796 131.781 26.3411 132.032 26.4666C132.283 26.5894 132.47 26.7577 132.595 26.9713C132.721 27.1823 132.782 27.4253 132.782 27.695C132.782 28.0262 132.686 28.3173 132.497 28.571C132.307 28.8247 132.019 28.9929 131.637 29.0757L132.844 31.0893H132.091ZM130.187 28.6191H131.111C131.45 28.6191 131.706 28.5363 131.877 28.368C132.048 28.1998 132.134 27.9755 132.134 27.695C132.134 27.4146 132.051 27.1903 131.883 27.0327C131.714 26.8752 131.458 26.7977 131.114 26.7977H130.19V28.6191H130.187Z"
              fill="#585947" />
            <path d="M135.898 26.2823V31.092H135.271V26.2823H135.898Z" fill="#585947" />
            <path
              d="M139.443 30.8249C139.075 30.6166 138.784 30.3229 138.57 29.949C138.357 29.5751 138.25 29.1532 138.25 28.6831C138.25 28.2131 138.357 27.7912 138.57 27.4173C138.784 27.0434 139.075 26.7497 139.443 26.5414C139.812 26.333 140.217 26.2262 140.663 26.2262C141.109 26.2262 141.523 26.3304 141.891 26.5414C142.26 26.747 142.548 27.0407 142.762 27.4146C142.972 27.7885 143.079 28.2105 143.079 28.6831C143.079 29.1558 142.972 29.5805 142.762 29.9517C142.551 30.3256 142.26 30.6166 141.891 30.8249C141.523 31.0333 141.114 31.1401 140.663 31.1401C140.212 31.1401 139.809 31.0359 139.443 30.8249ZM141.574 30.3603C141.843 30.2054 142.054 29.981 142.209 29.69C142.364 29.4015 142.441 29.065 142.441 28.6831C142.441 28.3013 142.364 27.9594 142.209 27.671C142.054 27.3826 141.843 27.1609 141.579 27.006C141.312 26.8485 141.008 26.771 140.668 26.771C140.329 26.771 140.025 26.8485 139.758 27.006C139.491 27.1636 139.28 27.3853 139.128 27.671C138.973 27.9594 138.896 28.2959 138.896 28.6831C138.896 29.0704 138.973 29.4015 139.128 29.69C139.283 29.9784 139.494 30.2027 139.763 30.3603C140.033 30.5178 140.335 30.5953 140.671 30.5953C141.008 30.5953 141.309 30.5178 141.579 30.3603H141.574Z"
              fill="#585947" />
            <path
              d="M147.957 31.0893L146.811 29.1238H146.053V31.0893H145.426V26.2796H146.977C147.34 26.2796 147.647 26.3411 147.898 26.4666C148.149 26.5894 148.336 26.7577 148.461 26.9713C148.587 27.1823 148.648 27.4253 148.648 27.695C148.648 28.0262 148.552 28.3173 148.363 28.571C148.173 28.8247 147.885 28.9929 147.503 29.0757L148.71 31.0893H147.957ZM146.053 28.6191H146.977C147.316 28.6191 147.572 28.5363 147.743 28.368C147.914 28.1998 147.999 27.9755 147.999 27.695C147.999 27.4146 147.917 27.1903 147.749 27.0327C147.58 26.8752 147.324 26.7977 146.98 26.7977H146.056V28.6191H146.053Z"
              fill="#585947" />
            <path
              d="M151.764 26.7924V28.4001H153.515V28.9182H151.764V30.5739H153.723V31.092H151.136V26.2743H153.723V26.7924H151.764Z"
              fill="#585947" />
            <path
              d="M156.866 30.9692C156.615 30.857 156.417 30.6994 156.276 30.4991C156.134 30.2988 156.059 30.0665 156.054 29.8048H156.724C156.748 30.0291 156.842 30.2187 157.004 30.3736C157.167 30.5285 157.405 30.606 157.717 30.606C158.03 30.606 158.251 30.5312 158.425 30.3816C158.598 30.2321 158.684 30.0398 158.684 29.8048C158.684 29.6205 158.633 29.471 158.531 29.3561C158.43 29.2413 158.305 29.1532 158.152 29.0944C158 29.0357 157.795 28.9689 157.538 28.9021C157.221 28.8193 156.967 28.7366 156.777 28.6538C156.588 28.571 156.422 28.4401 156.289 28.2639C156.153 28.0876 156.086 27.8499 156.086 27.5508C156.086 27.2891 156.153 27.0568 156.286 26.8538C156.42 26.6508 156.607 26.496 156.85 26.3838C157.09 26.2743 157.367 26.2182 157.68 26.2182C158.131 26.2182 158.499 26.3304 158.788 26.5574C159.076 26.7817 159.236 27.0808 159.274 27.4547H158.585C158.561 27.2704 158.465 27.1075 158.296 26.9686C158.126 26.8298 157.901 26.7577 157.621 26.7577C157.359 26.7577 157.146 26.8244 156.98 26.9606C156.815 27.0968 156.732 27.2864 156.732 27.5295C156.732 27.703 156.783 27.8473 156.882 27.9568C156.98 28.0662 157.103 28.1517 157.247 28.2078C157.391 28.2639 157.597 28.3306 157.859 28.4054C158.176 28.4935 158.43 28.579 158.625 28.6645C158.817 28.7499 158.983 28.8808 159.121 29.057C159.26 29.2333 159.327 29.4736 159.327 29.7781C159.327 30.0131 159.266 30.2348 159.14 30.4404C159.015 30.6487 158.833 30.8143 158.587 30.9451C158.345 31.0733 158.056 31.1374 157.725 31.1374C157.394 31.1374 157.124 31.0813 156.874 30.9692H156.866Z"
              fill="#585947" />
          </g>
          <defs>
            <clipPath id="nh">
              <rect width="195.098" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </a>
      <div className="nav-links">
        <a href="#inicio" className="nav-link">Início</a>
        <a href="#sobre" className="nav-link">Sobre Mim</a>
        <a href="#projetos" className="nav-link">Projetos</a>
      </div>
      <div className="nav-ctas">
        <a href="#contato" className="btn btn-secondary">Contato</a>
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
        <a href="#contato" className="mobile-nav-link" data-close>Contato</a>
      </nav>
      <div className="mobile-nav-ctas">
        <a href="#contato" className="btn btn-secondary" data-close>Contato</a>
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
          <div className="hero-image-bg" style={{"backgroundImage":"url('assets/images/hero-bg.png')"}}></div>
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
            <div className="project-card" key={project._id}>
              <div className="project-card-bg" style={{backgroundImage: "url('" + (project.coverImage || "assets/images/project-1.png") + "')"}}></div>
              <div className="project-overlay"></div>
              <div className="project-info">
                <p className="project-title">{project.title}</p>
                <p className="project-desc">{project.category || "Projeto"}{project.subtitle ? " · " + project.subtitle : ""}</p>
              </div>
            </div>
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

    <div className="container" style={{"position":"relative","zIndex":"1"}}>
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
          {/*  Logo Footer — fill #E2E0D4  */}
          <svg width="180" height="30" viewBox="0 0 244 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#nf)">
              <path
                d="M13.6855 0V15.4359C13.6855 17.7359 12.8879 19.7055 11.3829 21.1242C9.93122 22.4962 7.88224 23.2507 5.61634 23.2507C3.45056 23.2507 1.43162 22.4495 0 21.0374L0.657409 20.52C2.01227 21.9154 3.72087 22.6498 5.61634 22.6498C7.32828 22.6498 8.65645 22.1824 9.56414 21.2578C11.0558 19.7389 11.0124 17.4522 10.9891 16.2237V0H13.6855Z"
                fill="#E2E0D4" />
              <path
                d="M36.6248 23.0367H33.6014L32.053 19.0575L31.5757 17.9192H18.4342L16.3419 23.0333H15.6778L24.5311 1.16802L24.9583 0.0664062H27.5912L36.5213 22.7796L36.6214 23.0333L36.6248 23.0367ZM31.3488 17.3183L25.0651 1.24813L18.9915 16.4938L18.6812 17.3216H31.3522L31.3488 17.3183Z"
                fill="#E2E0D4" />
              <path
                d="M54.0479 16.4138L53.5941 16.6241L57.8255 23.0368H54.4116L51.465 18.4C51.0245 17.7057 50.2369 17.2851 49.416 17.3018C49.1924 17.3084 48.9688 17.3118 48.7786 17.3118H42.5649V23.0368H39.8118V0.0732422H48.7786C54.0879 0.0732422 58.7465 4.03904 58.7465 8.55899V8.82604C58.7465 12.0942 57.2982 14.6779 54.6653 16.1C54.3482 16.2703 54.0446 16.4105 54.0412 16.4138H54.0479ZM55.9801 8.8394V8.54563C55.9801 3.73527 53.0201 0.37702 48.7819 0.37702H42.5683V17.0047H48.7819C53.0201 17.0047 55.9801 13.6464 55.9801 8.8394Z"
                fill="#E2E0D4" />
              <path
                d="M77.4409 22.4359C77.2407 22.6662 77.0371 22.8966 76.917 23.0368H62.9178V1.02124L62.9278 0.0297852H64.0758H65.6542V22.4326H77.4409V22.4359Z"
                fill="#E2E0D4" />
              <path d="M83.0338 0.046875V23.0372H80.2674V1.03165L80.274 0.046875H83.0372H83.0338Z" fill="#E2E0D4" />
              <path
                d="M107.922 0.043457V23.0371H106.34L88.8706 4.25629L88.8639 23.0371H88.2599V0.043457H89.1976L107.328 19.4518V0.043457H107.922Z"
                fill="#E2E0D4" />
              <path
                d="M115.867 22.3463H128.332L127.811 23.0373H113.164V0.0537109H128.442L127.844 0.661266H115.864V9.51088H128.121L127.644 10.1084H115.871V22.3463H115.867Z"
                fill="#E2E0D4" />
              <path
                d="M164.536 0.043457L155.609 22.9169L155.566 23.0371H152.806L143.856 0.043457H146.849L155.369 21.7953L163.365 1.20182L163.832 0.043457H164.532H164.536Z"
                fill="#E2E0D4" />
              <path d="M170.496 0.046875V23.0372H167.729V1.03165L167.736 0.046875H170.499H170.496Z" fill="#E2E0D4" />
              <path
                d="M178.418 22.3463H190.882L190.362 23.0373H175.715V0.0537109H190.993L190.395 0.661266H178.415V9.51088H190.672L190.195 10.1084H178.422V22.3463H178.418Z"
                fill="#E2E0D4" />
              <path d="M197.276 0.046875V23.0372H194.51V1.03165L194.517 0.046875H197.28H197.276Z" fill="#E2E0D4" />
              <path
                d="M235.693 20.6099L236.234 21.1173C233.577 22.8465 230.467 23.7578 227.21 23.7578C219.842 23.7578 214.015 21.2975 211.229 17.0046L211.099 16.8043L205.269 16.811V23.0501H202.569V1.03124V0.0798486H210.491C215.71 0.0831868 220.289 3.95552 220.289 8.36864V8.52887C220.289 12.1074 217.085 14.985 214.109 16.1433L213.611 16.337L213.908 16.7843C215.941 19.8554 221.313 22.2823 225.335 22.8565C229.015 23.3839 232.693 22.5828 235.693 20.6099ZM217.456 8.53221V8.36196C217.456 3.79194 214.592 0.60061 210.491 0.60061H205.269V16.2936H210.491C214.592 16.2936 217.456 13.1022 217.456 8.53221ZM243.872 23.0167H240.896L239 18.3599L238.857 17.936H225.925L224.837 20.5398C224.811 20.6032 224.721 20.67 224.614 20.6566C224.35 20.6332 224.073 20.5965 223.783 20.5464C223.693 20.5331 223.616 20.483 223.579 20.4163C223.543 20.3495 223.563 20.2994 223.569 20.2827L231.799 0.0498047H234.338L243.755 22.7597L243.872 23.0167ZM238.353 16.8677L232.149 2.17625L226.366 16.8677H238.353Z"
                fill="#E2E0D4" />
            </g>
            <defs>
              <clipPath id="nf">
                <rect width="243.872" height="39.9994" fill="white" />
              </clipPath>
            </defs>
          </svg>
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
              <a href="#" className="footer-contact-item" style={{"alignItems":"flex-start"}}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{"marginTop":"2px","flexShrink":"0"}}>
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
