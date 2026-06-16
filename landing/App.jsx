import { useState, useEffect, useRef } from "react";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #fdf8f3;
    --warm-white: #fff9f4;
    --sand: #f0e8dc;
    --terracotta: #c96a3b;
    --terracotta-light: #e07d4e;
    --terracotta-dark: #a8542d;
    --sage: #7a9e7e;
    --sage-light: #a8c5ab;
    --plum: #4a3550;
    --plum-light: #6b4f7a;
    --text-dark: #1e1714;
    --text-mid: #4a3d35;
    --text-light: #8a7060;
    --border: #e8ddd4;
    --shadow-soft: 0 4px 24px rgba(74, 53, 80, 0.08);
    --shadow-hover: 0 12px 40px rgba(74, 53, 80, 0.16);
    --radius: 20px;
    --radius-sm: 12px;
    --serif: 'Playfair Display', Georgia, serif;
    --sans: 'Inter', system-ui, sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--sans);
    background: var(--cream);
    color: var(--text-dark);
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* HEADER */
  .header {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 0 5%;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(253, 248, 243, 0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(232, 221, 212, 0.6);
    transition: box-shadow 0.3s ease;
  }
  .header.scrolled { box-shadow: var(--shadow-soft); }

  .logo {
    font-family: var(--serif);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--plum);
    text-decoration: none;
    letter-spacing: -0.02em;
  }
  .logo span { color: var(--terracotta); }

  .nav {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .nav a {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-mid);
    text-decoration: none;
    transition: color 0.2s;
  }
  .nav a:hover { color: var(--plum); }

  .nav-mobile-hidden { display: flex; gap: 2rem; }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--terracotta);
    color: #fff;
    padding: 0.6rem 1.4rem;
    border-radius: 100px;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  }
  .btn-primary:hover {
    background: var(--terracotta-dark);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(201, 106, 59, 0.35);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    color: var(--plum);
    padding: 0.6rem 1.4rem;
    border-radius: 100px;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    border: 2px solid var(--plum);
    cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.15s;
  }
  .btn-secondary:hover {
    background: var(--plum);
    color: #fff;
    transform: translateY(-1px);
  }

  /* HERO */
  .hero {
    min-height: 100vh;
    padding: 120px 5% 80px;
    display: flex;
    align-items: center;
    background: linear-gradient(160deg, var(--warm-white) 0%, var(--sand) 60%, #ecddd0 100%);
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,106,59,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero::after {
    content: '';
    position: absolute;
    bottom: -10%;
    left: -5%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(122,158,126,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-inner {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(122, 158, 126, 0.15);
    color: #4d7a52;
    padding: 0.35rem 1rem;
    border-radius: 100px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .hero-badge::before { content: '✦'; font-size: 0.6rem; }

  .hero-title {
    font-family: var(--serif);
    font-size: clamp(2.6rem, 5vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    color: var(--text-dark);
    letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
  }
  .hero-title em {
    font-style: normal;
    color: var(--terracotta);
    position: relative;
  }
  .hero-title em::after {
    content: '';
    position: absolute;
    bottom: 2px; left: 0; right: 0;
    height: 3px;
    background: var(--terracotta);
    opacity: 0.3;
    border-radius: 2px;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: var(--text-mid);
    line-height: 1.7;
    max-width: 440px;
    margin-bottom: 2.5rem;
  }

  .hero-ctas {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  /* Phone mockup */
  .phone-mockup {
    width: 260px;
    height: 520px;
    background: var(--plum);
    border-radius: 36px;
    padding: 14px;
    box-shadow: 0 30px 80px rgba(74, 53, 80, 0.35), 0 0 0 1px rgba(255,255,255,0.1);
    position: relative;
    transform: rotate(2deg);
    transition: transform 0.4s ease;
  }
  .phone-mockup:hover { transform: rotate(0deg) scale(1.02); }

  .phone-notch {
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 24px;
    background: var(--plum);
    border-radius: 0 0 14px 14px;
    z-index: 2;
  }

  .phone-screen {
    width: 100%;
    height: 100%;
    background: linear-gradient(160deg, #fdf5ee 0%, #f5e6d8 100%);
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .phone-status-bar {
    padding: 12px 16px 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--text-mid);
  }

  .phone-app-header {
    padding: 8px 16px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .phone-app-title {
    font-family: var(--serif);
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--plum);
  }
  .phone-avatar-row {
    display: flex;
    gap: 4px;
  }
  .phone-avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid white;
  }

  .phone-ai-card {
    margin: 0 12px 10px;
    background: linear-gradient(135deg, var(--plum) 0%, var(--plum-light) 100%);
    border-radius: 14px;
    padding: 12px;
    color: white;
  }
  .phone-ai-label {
    font-size: 0.55rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 4px;
  }
  .phone-ai-msg {
    font-size: 0.65rem;
    line-height: 1.4;
    opacity: 0.95;
  }

  .phone-tasks {
    padding: 0 12px;
    flex: 1;
  }
  .phone-tasks-label {
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--text-light);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .phone-task-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    background: white;
    border-radius: 10px;
    margin-bottom: 6px;
    box-shadow: 0 1px 6px rgba(74,53,80,0.06);
  }
  .phone-task-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .phone-task-text {
    font-size: 0.6rem;
    color: var(--text-mid);
    flex: 1;
  }
  .phone-task-tag {
    font-size: 0.5rem;
    padding: 2px 6px;
    border-radius: 100px;
    font-weight: 600;
  }

  .phone-float-card {
    position: absolute;
    background: white;
    border-radius: 14px;
    padding: 10px 14px;
    box-shadow: var(--shadow-hover);
    font-size: 0.7rem;
  }
  .phone-float-card.left {
    left: -60px;
    top: 30%;
    transform: rotate(-4deg);
  }
  .phone-float-card.right {
    right: -50px;
    bottom: 25%;
    transform: rotate(3deg);
  }
  .float-emoji { font-size: 1rem; display: block; margin-bottom: 2px; }
  .float-label { font-size: 0.6rem; color: var(--text-light); }
  .float-value { font-size: 0.75rem; font-weight: 700; color: var(--text-dark); }

  /* SECTIONS COMMUNES */
  .section {
    padding: 100px 5%;
  }
  .section-inner {
    max-width: 1100px;
    margin: 0 auto;
  }
  .section-tag {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--terracotta);
    margin-bottom: 1rem;
  }
  .section-title {
    font-family: var(--serif);
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 700;
    line-height: 1.15;
    color: var(--text-dark);
    letter-spacing: -0.02em;
    margin-bottom: 1.2rem;
  }
  .section-subtitle {
    font-size: 1.05rem;
    color: var(--text-mid);
    max-width: 540px;
    line-height: 1.7;
  }

  /* REVEAL ANIMATIONS */
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }
  .reveal-delay-5 { transition-delay: 0.5s; }

  /* PROBLÈME */
  .problem-section {
    background: var(--plum);
    color: white;
  }
  .problem-lines {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 5%;
  }
  .problem-line {
    font-family: var(--serif);
    font-size: clamp(1.6rem, 3.5vw, 2.6rem);
    font-weight: 400;
    line-height: 1.3;
    margin-bottom: 0.5rem;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    color: rgba(255,255,255,0.5);
  }
  .problem-line.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .problem-line.accent {
    font-weight: 700;
    color: white;
  }
  .problem-line.emphasis {
    color: var(--terracotta-light);
    font-style: italic;
  }
  .problem-line.final {
    color: var(--sage-light);
    font-size: clamp(1.1rem, 2.5vw, 1.4rem);
    font-family: var(--sans);
    font-weight: 400;
    margin-top: 2rem;
    font-style: normal;
  }

  /* FONCTIONNALITÉS */
  .features-section { background: var(--warm-white); }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 3.5rem;
  }

  .feature-card {
    background: white;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-soft);
    cursor: default;
    transition: box-shadow 0.35s ease, transform 0.35s ease;
    border: 1px solid var(--border);
  }
  .feature-card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-4px);
  }

  .feature-card-image {
    overflow: hidden;
    height: 190px;
    position: relative;
  }
  .feature-card-image-inner {
    width: 100%;
    height: 100%;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .feature-card:hover .feature-card-image-inner {
    transform: scale(1.07);
  }

  .feature-card-body {
    padding: 1.25rem 1.4rem 1.4rem;
  }
  .feature-icon {
    font-size: 1.3rem;
    margin-bottom: 0.6rem;
    display: block;
  }
  .feature-title {
    font-family: var(--serif);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.4rem;
    transition: color 0.25s;
  }
  .feature-card:hover .feature-title { color: var(--terracotta); }
  .feature-desc {
    font-size: 0.85rem;
    color: var(--text-light);
    line-height: 1.6;
  }

  /* Mockups fonctionnalités */
  .feat-mock {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 8px;
  }
  .feat-mock-title {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .feat-mock-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.6);
    border-radius: 8px;
    padding: 6px 10px;
  }
  .feat-mock-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .feat-mock-text { font-size: 0.6rem; flex: 1; }
  .feat-mock-assign {
    font-size: 0.5rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 100px;
  }

  .feat-mock-bar {
    height: 6px;
    border-radius: 100px;
    margin-top: 2px;
  }
  .feat-mock-bar-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.55rem;
    margin-bottom: 3px;
  }

  .feat-mock-chat {
    background: rgba(255,255,255,0.75);
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 0.6rem;
    line-height: 1.4;
  }
  .chat-bubble {
    padding: 6px 10px;
    border-radius: 10px;
    font-size: 0.6rem;
    margin-bottom: 4px;
    max-width: 85%;
    line-height: 1.35;
  }
  .chat-bubble.ai { background: var(--plum); color: white; border-radius: 10px 10px 10px 2px; }
  .chat-bubble.user { background: white; color: var(--text-dark); margin-left: auto; border-radius: 10px 10px 2px 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

  .feat-mock-reward {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.7);
    border-radius: 10px;
    padding: 7px 10px;
  }
  .reward-badge {
    font-size: 1.1rem;
  }
  .reward-info { font-size: 0.6rem; }
  .reward-name { font-weight: 700; color: var(--text-dark); }
  .reward-stars { color: #f5a623; font-size: 0.55rem; }

  /* COMMENT ÇA MARCHE */
  .how-section { background: var(--cream); }
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 3.5rem;
    position: relative;
  }
  .steps-grid::before {
    content: '';
    position: absolute;
    top: 48px;
    left: calc(16.66% + 20px);
    right: calc(16.66% + 20px);
    height: 2px;
    background: linear-gradient(90deg, var(--terracotta), var(--sage));
    opacity: 0.3;
  }

  .step-card {
    text-align: center;
    padding: 2rem 1.5rem;
    position: relative;
  }
  .step-number {
    font-family: var(--serif);
    font-size: 2.8rem;
    font-weight: 700;
    color: var(--border);
    line-height: 1;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
  }
  .step-number-inner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    color: var(--terracotta);
    font-family: var(--serif);
  }

  .step-icon-wrap {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    font-size: 1.8rem;
    position: relative;
  }

  .step-title {
    font-family: var(--serif);
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.6rem;
  }
  .step-desc {
    font-size: 0.9rem;
    color: var(--text-light);
    line-height: 1.65;
  }

  /* RÉASSURANCE */
  .reassurance-section { background: var(--sand); }
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;
  }
  .pillar-card {
    background: white;
    border-radius: var(--radius);
    padding: 1.75rem 1.5rem;
    box-shadow: var(--shadow-soft);
    border: 1px solid rgba(255,255,255,0.8);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .pillar-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }
  .pillar-icon {
    font-size: 1.6rem;
    margin-bottom: 0.9rem;
    display: block;
  }
  .pillar-title {
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
  .pillar-desc {
    font-size: 0.825rem;
    color: var(--text-light);
    line-height: 1.6;
  }

  /* TÉMOIGNAGES */
  .testimonials-section { background: var(--warm-white); }
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;
  }
  .testimonial-card {
    background: white;
    border-radius: var(--radius);
    padding: 2rem;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition: transform 0.3s ease;
  }
  .testimonial-card:hover { transform: translateY(-3px); }
  .testimonial-stars {
    color: #f5a623;
    font-size: 0.9rem;
    letter-spacing: 2px;
  }
  .testimonial-quote {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-mid);
    font-style: italic;
    flex: 1;
  }
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .testimonial-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .testimonial-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-dark);
  }
  .testimonial-role {
    font-size: 0.775rem;
    color: var(--text-light);
  }

  /* FAQ */
  .faq-section { background: var(--cream); }
  .faq-list {
    max-width: 720px;
    margin: 3rem auto 0;
  }
  .faq-item {
    border-bottom: 1px solid var(--border);
    overflow: hidden;
  }
  .faq-question {
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    padding: 1.4rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    text-align: left;
    font-family: var(--sans);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark);
    transition: color 0.2s;
  }
  .faq-question:hover { color: var(--terracotta); }
  .faq-chevron {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--sand);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.3s ease, background 0.2s;
    font-size: 0.7rem;
    color: var(--plum);
  }
  .faq-chevron.open {
    transform: rotate(180deg);
    background: var(--terracotta);
    color: white;
  }
  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease, padding 0.3s ease;
  }
  .faq-answer.open {
    max-height: 300px;
    padding-bottom: 1.4rem;
  }
  .faq-answer-text {
    font-size: 0.9rem;
    color: var(--text-mid);
    line-height: 1.75;
  }

  /* CTA FINAL */
  .cta-final {
    background: linear-gradient(135deg, var(--plum) 0%, #2e1f3a 100%);
    padding: 120px 5%;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cta-final::before {
    content: '';
    position: absolute;
    top: -30%;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,106,59,0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-final-tag {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sage-light);
    margin-bottom: 1.25rem;
  }
  .cta-final-title {
    font-family: var(--serif);
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 700;
    color: white;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
  }
  .cta-final-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.65);
    margin-bottom: 2.5rem;
    max-width: 440px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.7;
  }
  .cta-final .btn-primary {
    font-size: 1rem;
    padding: 0.85rem 2rem;
    background: var(--terracotta);
    box-shadow: 0 8px 32px rgba(201, 106, 59, 0.4);
  }
  .cta-final .btn-primary:hover {
    background: var(--terracotta-light);
    box-shadow: 0 12px 40px rgba(201, 106, 59, 0.55);
  }
  .cta-note {
    margin-top: 1.25rem;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.4);
  }

  /* FOOTER */
  .footer {
    background: var(--text-dark);
    padding: 3rem 5%;
    color: rgba(255,255,255,0.5);
  }
  .footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .footer-logo {
    font-family: var(--serif);
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }
  .footer-logo span { color: var(--terracotta-light); }
  .footer-links {
    display: flex;
    gap: 1.75rem;
    flex-wrap: wrap;
  }
  .footer-links a {
    font-size: 0.825rem;
    color: rgba(255,255,255,0.45);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-links a:hover { color: white; }
  .footer-copy { font-size: 0.8rem; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .hero-inner {
      grid-template-columns: 1fr;
      text-align: center;
    }
    .hero-visual { order: -1; }
    .hero-subtitle { margin: 0 auto 2.5rem; }
    .hero-ctas { justify-content: center; }
    .phone-float-card { display: none; }
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    .steps-grid { grid-template-columns: 1fr; }
    .steps-grid::before { display: none; }
    .pillars-grid { grid-template-columns: repeat(2, 1fr); }
    .testimonials-grid { grid-template-columns: 1fr; }
    .nav-mobile-hidden { display: none; }
  }

  @media (max-width: 600px) {
    .features-grid { grid-template-columns: 1fr; }
    .pillars-grid { grid-template-columns: 1fr; }
    .hero { padding: 100px 5% 60px; }
    .section { padding: 70px 5%; }
    .phone-mockup { width: 220px; height: 440px; }
  }
`;

const features = [
  {
    icon: "✓",
    title: "Tâches partagées",
    desc: "Répartissez les responsabilités équitablement. Chaque parent voit ce qui lui appartient, sans négociation constante.",
    gradient: "linear-gradient(135deg, #f5e6d8 0%, #ecddd0 100%)",
    mock: "tasks",
  },
  {
    icon: "⭐",
    title: "Missions & récompenses enfants",
    desc: "Impliquez les enfants avec des défis adaptés à leur âge. Chaque mission accomplie devient une victoire collective.",
    gradient: "linear-gradient(135deg, #e8f0e9 0%, #d4e6d6 100%)",
    mock: "rewards",
  },
  {
    icon: "₪",
    title: "Budget familial",
    desc: "Visualisez les dépenses du foyer en un coup d'œil. Pas de surprises en fin de mois.",
    gradient: "linear-gradient(135deg, #ede8f5 0%, #ddd5ed 100%)",
    mock: "budget",
  },
  {
    icon: "✦",
    title: "Assistant IA qui anticipe",
    desc: "L'IA apprend vos habitudes et vous suggère ce dont votre famille aura besoin — avant que vous ne le demandiez.",
    gradient: "linear-gradient(135deg, #f0e8e0 0%, #e5d5c8 100%)",
    mock: "ai",
  },
  {
    icon: "◎",
    title: "Suivi du bien-être parental",
    desc: "Un espace pour vous. Identifiez les périodes de surcharge et trouvez des moments de respiration.",
    gradient: "linear-gradient(135deg, #e8f0e9 0%, #d4e8da 100%)",
    mock: "wellbeing",
  },
  {
    icon: "♡",
    title: "Moments à deux",
    desc: "Ne laissez pas la logistique empiéter sur votre relation. Planifiez des moments rien que pour vous.",
    gradient: "linear-gradient(135deg, #f5e8ee 0%, #edd5e0 100%)",
    mock: "couple",
  },
];

function FeatureMock({ type }) {
  if (type === "tasks") return (
    <div className="feat-mock" style={{ background: "linear-gradient(135deg, #f5e6d8 0%, #ecddd0 100%)" }}>
      <div className="feat-mock-title" style={{ color: "#a05a35" }}>Aujourd'hui</div>
      {[
        { color: "#c96a3b", text: "Rdv pédiatre — Emma", assign: "Marie", bg: "#fde8dc", col: "#c96a3b" },
        { color: "#7a9e7e", text: "Courses semaine", assign: "Thomas", bg: "#e8f0e9", col: "#4d7a52" },
        { color: "#9b85b0", text: "Réunion école", assign: "Marie", bg: "#ede8f5", col: "#6b4f7a" },
      ].map((t, i) => (
        <div key={i} className="feat-mock-row">
          <div className="feat-mock-dot" style={{ background: t.color }} />
          <span className="feat-mock-text">{t.text}</span>
          <span className="feat-mock-assign" style={{ background: t.bg, color: t.col }}>{t.assign}</span>
        </div>
      ))}
    </div>
  );

  if (type === "rewards") return (
    <div className="feat-mock" style={{ background: "linear-gradient(135deg, #e8f0e9 0%, #d4e6d6 100%)" }}>
      <div className="feat-mock-title" style={{ color: "#4d7a52" }}>Missions de Léo</div>
      {[
        { emoji: "🌟", name: "Ranger sa chambre", stars: "★★★", done: true },
        { emoji: "📚", name: "15 min de lecture", stars: "★★☆", done: false },
        { emoji: "🐕", name: "Sortir le chien", stars: "★★★", done: true },
      ].map((r, i) => (
        <div key={i} className="feat-mock-reward" style={{ opacity: r.done ? 1 : 0.7 }}>
          <span className="reward-badge">{r.emoji}</span>
          <div className="reward-info">
            <div className="reward-name" style={{ textDecoration: r.done ? "line-through" : "none", color: r.done ? "#aaa" : "inherit" }}>{r.name}</div>
            <div className="reward-stars">{r.stars}</div>
          </div>
        </div>
      ))}
    </div>
  );

  if (type === "budget") return (
    <div className="feat-mock" style={{ background: "linear-gradient(135deg, #ede8f5 0%, #ddd5ed 100%)" }}>
      <div className="feat-mock-title" style={{ color: "#6b4f7a" }}>Budget juin</div>
      {[
        { label: "Courses", pct: 72, color: "#c96a3b", val: "360 / 500€" },
        { label: "Loisirs", pct: 45, color: "#7a9e7e", val: "90 / 200€" },
        { label: "École", pct: 88, color: "#9b85b0", val: "132 / 150€" },
      ].map((b, i) => (
        <div key={i} style={{ marginBottom: "8px" }}>
          <div className="feat-mock-bar-label"><span style={{ fontSize: "0.58rem", color: "#666" }}>{b.label}</span><span style={{ fontSize: "0.55rem", color: "#999" }}>{b.val}</span></div>
          <div style={{ height: "6px", borderRadius: "100px", background: "rgba(255,255,255,0.5)" }}>
            <div className="feat-mock-bar" style={{ width: `${b.pct}%`, background: b.color, height: "6px", margin: 0, transition: "width 1s" }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (type === "ai") return (
    <div className="feat-mock" style={{ background: "linear-gradient(135deg, #f0e8e0 0%, #e5d5c8 100%)", paddingBottom: "10px" }}>
      <div className="feat-mock-title" style={{ color: "#a05a35" }}>Assistant IA</div>
      <div className="chat-bubble ai">Demain c'est mercredi — pensez aux activités d'après-midi pour Emma 🎨</div>
      <div className="chat-bubble user">Merci ! Tu peux réserver le cours de dessin ?</div>
      <div className="chat-bubble ai">C'est fait ✓ J'ai aussi ajouté le trajet dans les tâches de Thomas.</div>
    </div>
  );

  if (type === "wellbeing") return (
    <div className="feat-mock" style={{ background: "linear-gradient(135deg, #e8f0e9 0%, #d4e8da 100%)" }}>
      <div className="feat-mock-title" style={{ color: "#4d7a52" }}>Votre semaine</div>
      <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
        {["L","M","M","J","V","S","D"].map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "3px" }}>{d}</div>
            <div style={{ height: "28px", borderRadius: "4px", background: ["#c96a3b","#e07d4e","#7a9e7e","#a8c5ab","#e07d4e","#c96a3b","#7a9e7e"][i], opacity: 0.7 + i * 0.03 }} />
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: "8px", padding: "6px 10px", fontSize: "0.6rem", color: "#4d7a52" }}>
        💡 Jeudi semble plus calme — idéal pour une pause 30 min.
      </div>
    </div>
  );

  if (type === "couple") return (
    <div className="feat-mock" style={{ background: "linear-gradient(135deg, #f5e8ee 0%, #edd5e0 100%)" }}>
      <div className="feat-mock-title" style={{ color: "#904060" }}>Moments à deux</div>
      <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "10px", padding: "10px", marginBottom: "6px" }}>
        <div style={{ fontSize: "0.85rem", marginBottom: "4px" }}>🍷</div>
        <div style={{ fontSize: "0.65rem", fontWeight: "700", color: "#4a3d35" }}>Dîner sans écrans</div>
        <div style={{ fontSize: "0.55rem", color: "#8a7060" }}>Vendredi 20h • Babysitter confirmée ✓</div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: "10px", padding: "10px" }}>
        <div style={{ fontSize: "0.85rem", marginBottom: "4px" }}>🚶</div>
        <div style={{ fontSize: "0.65rem", fontWeight: "700", color: "#4a3d35" }}>Balade dimanche matin</div>
        <div style={{ fontSize: "0.55rem", color: "#8a7060" }}>À planifier — suggéré par l'IA</div>
      </div>
    </div>
  );

  return null;
}

const faqs = [
  {
    q: "Est-ce vraiment gratuit au départ ?",
    a: "Oui. Notre Famille propose une version gratuite complète pour découvrir toutes les fonctionnalités essentielles. Sans carte bancaire requise au départ. Une offre famille étendue est disponible pour ceux qui souhaitent aller plus loin."
  },
  {
    q: "Mes données sont-elles privées et sécurisées ?",
    a: "Absolument. Vos données familiales ne sont jamais vendues ni partagées avec des tiers. Elles sont chiffrées et stockées en Europe, conformément au RGPD. Vous pouvez les supprimer à tout moment, définitivement."
  },
  {
    q: "Sur quels appareils l'app fonctionne-t-elle ?",
    a: "Notre Famille est disponible sur iOS et Android. Une version web accessible depuis navigateur est également prévue pour ceux qui préfèrent travailler depuis un ordinateur."
  },
  {
    q: "Comment l'IA anticipe-t-elle les besoins de ma famille ?",
    a: "L'assistant apprend progressivement les habitudes de votre foyer : rythme des courses, activités des enfants, événements récurrents. Il croise ces données avec le calendrier pour anticiper les tâches à venir et vous les suggérer avant qu'elles deviennent urgentes."
  },
  {
    q: "Mon ou ma partenaire peut-il aussi utiliser l'app ?",
    a: "C'est justement là l'essentiel. Notre Famille est conçue pour être utilisée en duo. Chaque parent a son propre espace, mais partage la vision globale de la famille. L'équité dans la répartition est au cœur de l'expérience."
  },
  {
    q: "L'app fonctionne-t-elle pour les familles monoparentales ?",
    a: "Tout à fait. Notre Famille s'adapte à toutes les configurations familiales. En famille monoparentale, l'assistant IA joue un rôle encore plus important pour vous aider à tout anticiper seul·e, avec plus d'efficacité."
  }
];

function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const elements = ref.current.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useProblemReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const lines = ref.current.querySelectorAll(".problem-line");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            lines.forEach((line, i) => {
              setTimeout(() => line.classList.add("visible"), i * 180);
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const heroRef = useRef(null);
  const featRef = useRef(null);
  const howRef = useRef(null);
  const reassRef = useRef(null);
  const testimRef = useRef(null);
  const faqRef = useRef(null);
  const problemRef = useRef(null);

  useReveal(featRef);
  useReveal(howRef);
  useReveal(reassRef);
  useReveal(testimRef);
  useReveal(faqRef);
  useProblemReveal(problemRef);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* HEADER */}
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <a href="#" className="logo">Notre<span>Famille</span></a>
        <nav className="nav">
          <div className="nav-mobile-hidden">
            <a href="#features">Fonctionnalités</a>
            <a href="#how">Comment ça marche</a>
            <a href="#testimonials">Témoignages</a>
          </div>
          <a href="#cta" className="btn-primary">Essayer gratuitement</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">Assistant IA familial</div>
            <h1 className="hero-title">
              Vous portez tout.<br />
              <em>Notre Famille</em><br />
              porte le reste.
            </h1>
            <p className="hero-subtitle">
              L'assistant IA qui apprend les habitudes de votre foyer et anticipe les besoins de votre famille — avant même que vous y pensiez.
            </p>
            <div className="hero-ctas">
              <a href="#cta" className="btn-primary">Commencer gratuitement →</a>
              <a href="#how" className="btn-secondary">Voir comment ça marche</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="phone-float-card left">
              <span className="float-emoji">✓</span>
              <div className="float-label">Tâches aujourd'hui</div>
              <div className="float-value">4 sur 6 faites</div>
            </div>

            <div className="phone-mockup">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-status-bar">
                  <span>9:41</span>
                  <span>●●●</span>
                </div>
                <div className="phone-app-header">
                  <div className="phone-app-title">Bonjour Marie ✦</div>
                  <div className="phone-avatar-row">
                    <div className="phone-avatar" style={{ background: "linear-gradient(135deg, #c96a3b, #e07d4e)" }} />
                    <div className="phone-avatar" style={{ background: "linear-gradient(135deg, #4a3550, #6b4f7a)" }} />
                  </div>
                </div>
                <div className="phone-ai-card">
                  <div className="phone-ai-label">✦ Assistant IA</div>
                  <div className="phone-ai-msg">Demain, Emma a natation à 17h. Thomas peut récupérer si vous confirmez maintenant.</div>
                </div>
                <div className="phone-tasks">
                  <div className="phone-tasks-label">À faire</div>
                  {[
                    { color: "#c96a3b", text: "Appel médecin", tag: "Urgent", tagBg: "#fde8dc", tagCol: "#c96a3b" },
                    { color: "#7a9e7e", text: "Repas semaine", tag: "Courses", tagBg: "#e8f0e9", tagCol: "#4d7a52" },
                    { color: "#9b85b0", text: "Cotisation école", tag: "Budget", tagBg: "#ede8f5", tagCol: "#6b4f7a" },
                  ].map((t, i) => (
                    <div key={i} className="phone-task-item">
                      <div className="phone-task-dot" style={{ background: t.color }} />
                      <span className="phone-task-text">{t.text}</span>
                      <span className="phone-task-tag" style={{ background: t.tagBg, color: t.tagCol }}>{t.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="phone-float-card right">
              <span className="float-emoji">⚖️</span>
              <div className="float-label">Répartition</div>
              <div className="float-value">Équilibrée</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLÈME */}
      <section className="section problem-section" ref={problemRef}>
        <div className="problem-lines">
          <p className="problem-line accent">Les tâches s'accumulent.</p>
          <p className="problem-line accent">Les listes mentales aussi.</p>
          <p className="problem-line">Les rendez-vous à ne pas oublier.</p>
          <p className="problem-line">Les courses, les devoirs, le dîner.</p>
          <p className="problem-line">La réunion d'école. La facture. Le cadeau d'anniversaire.</p>
          <p className="problem-line emphasis">Et personne ne voit tout ça.</p>
          <p className="problem-line accent">Sauf vous.</p>
          <p className="problem-line final">Notre Famille est conçu pour alléger ce que personne ne devrait porter seul·e.</p>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section className="section features-section" id="features" ref={featRef}>
        <div className="section-inner">
          <div className="reveal">
            <span className="section-tag">Fonctionnalités</span>
            <h2 className="section-title">Tout ce dont votre famille<br />a besoin, au même endroit.</h2>
            <p className="section-subtitle">Des outils pensés pour le quotidien réel des familles — pas pour un quotidien idéal qui n'existe pas.</p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className={`feature-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="feature-card-image">
                  <div className="feature-card-image-inner">
                    <FeatureMock type={f.mock} />
                  </div>
                </div>
                <div className="feature-card-body">
                  <span className="feature-icon">{f.icon}</span>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="section how-section" id="how" ref={howRef}>
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: "center" }}>
            <span className="section-tag">Comment ça marche</span>
            <h2 className="section-title">Prêt en quelques minutes,<br />utile pour des années.</h2>
          </div>

          <div className="steps-grid">
            {[
              {
                num: "01",
                emoji: "👨‍👩‍👧",
                bg: "linear-gradient(135deg, rgba(201,106,59,0.12), rgba(224,125,78,0.08))",
                title: "Créez votre espace famille",
                desc: "Invitez votre partenaire, ajoutez les enfants. En trois minutes, votre famille est connectée et prête à collaborer.",
              },
              {
                num: "02",
                emoji: "🧠",
                bg: "linear-gradient(135deg, rgba(74,53,80,0.1), rgba(107,79,122,0.07))",
                title: "L'IA apprend vos habitudes",
                desc: "Plus vous utilisez l'app, plus l'assistant comprend votre rythme familial et personnalise ses suggestions.",
              },
              {
                num: "03",
                emoji: "✦",
                bg: "linear-gradient(135deg, rgba(122,158,126,0.12), rgba(168,197,171,0.08))",
                title: "Recevez des suggestions avant d'en avoir besoin",
                desc: "L'assistant anticipe les tâches à venir, équilibre la charge entre les parents et vous laisse souffler.",
              },
            ].map((s, i) => (
              <div key={i} className={`step-card reveal reveal-delay-${i + 1}`}>
                <div className="step-icon-wrap" style={{ background: s.bg }}>
                  <span style={{ fontSize: "1.8rem" }}>{s.emoji}</span>
                </div>
                <div style={{ position: "relative", display: "inline-block", marginBottom: "1rem" }}>
                  <span className="step-number">{s.num}</span>
                </div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RÉASSURANCE */}
      <section className="section reassurance-section" ref={reassRef}>
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: "center" }}>
            <span className="section-tag">Pourquoi Notre Famille</span>
            <h2 className="section-title">Conçu avec soin,<br />pas à la va-vite.</h2>
          </div>

          <div className="pillars-grid">
            {[
              {
                icon: "⚖️",
                title: "Équité entre les parents",
                desc: "Notre Famille rend visible qui fait quoi. Pas pour pointer du doigt — pour rééquilibrer naturellement.",
              },
              {
                icon: "🔒",
                title: "Données strictement privées",
                desc: "Chiffrées, stockées en Europe, jamais revendues. Vos informations familiales restent chez vous.",
              },
              {
                icon: "📱",
                title: "Mobile avant tout",
                desc: "Conçu pour être utilisé en deux secondes, n'importe où. Entre deux réunions, en attendant le bus.",
              },
              {
                icon: "✦",
                title: "Une IA vraiment utile",
                desc: "Pas un gadget. Un assistant qui apprend votre famille et anticipe ses besoins réels — sans jamais être intrusif.",
              },
            ].map((p, i) => (
              <div key={i} className={`pillar-card reveal reveal-delay-${i + 1}`}>
                <span className="pillar-icon">{p.icon}</span>
                <h3 className="pillar-title">{p.title}</h3>
                <p className="pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="section testimonials-section" id="testimonials" ref={testimRef}>
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: "center" }}>
            <span className="section-tag">Témoignages</span>
            <h2 className="section-title">Des familles qui respirent<br />un peu mieux.</h2>
          </div>

          <div className="testimonials-grid">
            {[
              {
                stars: "★★★★★",
                quote: "Avant, j'avais l'impression d'être la seule à voir toute la logistique. Depuis qu'on utilise Notre Famille, Thomas voit enfin tout ce qui tourne en arrière-plan. Ça a changé quelque chose de fondamental entre nous.",
                name: "Sarah",
                role: "Maman de 2 enfants, Lyon",
                emoji: "👩",
                bg: "linear-gradient(135deg, #fde8dc, #f5d5c4)",
              },
              {
                stars: "★★★★★",
                quote: "Je suis parent solo depuis deux ans. L'assistant IA, c'est un peu comme avoir quelqu'un qui pense avec moi. Il me rappelle les choses avant qu'elles deviennent urgentes. C'est con, mais ça change tout.",
                name: "Julien",
                role: "Papa solo de 3 enfants, Bordeaux",
                emoji: "👨",
                bg: "linear-gradient(135deg, #e0ddf0, #d0cce8)",
              },
              {
                stars: "★★★★☆",
                quote: "Les missions pour les enfants, c'est brillant. Mes deux filles adorent cocher leurs défis. Et moi j'ai moins à courir derrière elles pour les petites tâches du quotidien. Double bénéfice.",
                name: "Amina",
                role: "Maman de 2 filles, Paris",
                emoji: "👩",
                bg: "linear-gradient(135deg, #ddf0de, #cce8ce)",
              },
            ].map((t, i) => (
              <div key={i} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
                <div className="testimonial-stars">{t.stars}</div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.bg }}>
                    {t.emoji}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section" ref={faqRef}>
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: "center" }}>
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">Les questions<br />qu'on nous pose souvent.</h2>
          </div>

          <div className="faq-list reveal">
            {faqs.map((item, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span className={`faq-chevron${openFaq === i ? " open" : ""}`}>▾</span>
                </button>
                <div className={`faq-answer${openFaq === i ? " open" : ""}`}>
                  <p className="faq-answer-text">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final" id="cta">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="cta-final-tag">Rejoignez les premières familles</div>
          <h2 className="cta-final-title">Vous méritez de partager la charge — pas de la porter seul·e.</h2>
          <p className="cta-final-sub">Essayez Notre Famille gratuitement et découvrez ce que ça fait de souffler un peu.</p>
          <a href="#" className="btn-primary">Essayer Notre Famille →</a>
          <p className="cta-note">Gratuit · Sans carte bancaire · Disponible sur iOS & Android</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">Notre<span>Famille</span></div>
          <div className="footer-links">
            <a href="#">À propos</a>
            <a href="#">Confidentialité</a>
            <a href="#">Conditions d'utilisation</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-copy">© 2025 Notre Famille</div>
        </div>
      </footer>
    </>
  );
}
