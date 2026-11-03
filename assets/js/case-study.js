(function () {
  'use strict';

  const caseStudy = document.querySelector('.case-study');
  if (!caseStudy) return;

  const title = caseStudy.querySelector('h1');
  const meta = caseStudy.querySelector('.case-meta');
  if (!title) return;

  const incompleteContent = /\[À\s*(?:COMPLÉTER|CONFIRMER)\]|à\s*compléter|à\s*confirmer|url\s+à\s+compléter/i;
  caseStudy.querySelectorAll('p, li, .video-placeholder').forEach((element) => {
    if (incompleteContent.test(element.textContent)) element.remove();
  });
  caseStudy.querySelectorAll(':scope > section').forEach((section) => {
    const hasContent = [...section.children].some((child) =>
      child.tagName !== 'H2' && child.textContent.trim()
    );
    if (!hasContent) section.remove();
  });

  const sections = [...caseStudy.querySelectorAll(':scope > section')];

  const slugify = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const lead = title.nextElementSibling;
  if (lead && lead.tagName === 'P' && !lead.classList.contains('case-kicker')) {
    lead.classList.add('case-lead');
  }

  if (!caseStudy.querySelector('.case-kicker')) {
    const category = meta?.querySelector('li')?.textContent.replace(/^.*?:\s*/, '') || 'Projet';
    const kicker = document.createElement('p');
    kicker.className = 'case-kicker';
    kicker.textContent = `Étude de cas · ${category}`;
    title.before(kicker);
  }

  if (!caseStudy.querySelector('.case-toc') && sections.length > 1) {
    const toc = document.createElement('nav');
    toc.className = 'case-toc';
    toc.setAttribute('aria-label', 'Navigation dans l’étude de cas');

    sections.forEach((section, index) => {
      const heading = section.querySelector('h2');
      if (!heading) return;
      const id = section.id || `${slugify(heading.textContent) || 'section'}-${index + 1}`;
      section.id = id;
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = heading.textContent;
      toc.append(link);
    });

    caseStudy.querySelector('.case-meta')?.after(toc);
  }

  sections.forEach((section, index) => {
    section.classList.add('case-section-reveal');
    section.style.transitionDelay = `${index * 70}ms`;
  });

  caseStudy.classList.add('case-ready');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          const link = caseStudy.querySelector(`.case-toc a[href="#${entry.target.id}"]`);
          caseStudy.querySelectorAll('.case-toc a').forEach((item) => item.removeAttribute('aria-current'));
          link?.setAttribute('aria-current', 'location');
        }
      });
    }, { rootMargin: '-10% 0px -20% 0px', threshold: 0.05 });

    sections.forEach((section) => observer.observe(section));
    requestAnimationFrame(() => {
      const firstSection = sections[0];
      if (firstSection && firstSection.getBoundingClientRect().top < window.innerHeight) {
        firstSection.classList.add('is-visible');
      }
    });
  } else {
    sections.forEach((section) => section.classList.add('is-visible'));
  }
})();
