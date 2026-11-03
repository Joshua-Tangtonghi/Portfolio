
(function() {
  "use strict";

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth'

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: scrollBehavior
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    if (prefersReducedMotion) {
      typed.textContent = typed_strings[0]
    } else {
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    }
  }

  /**
   * Interactive portfolio loading screen
   */
  const loadingScreen = select('#loading-screen')
  if (loadingScreen) {
    const loadingSkip = select('[data-loading-skip]')
    let hasVisited = false
    try {
      hasVisited = window.sessionStorage.getItem('portfolio-loading-seen') === 'true'
    } catch (error) {
      hasVisited = false
    }

    const dismissLoading = () => {
      loadingScreen.classList.add('is-loaded')
      try {
        window.sessionStorage.setItem('portfolio-loading-seen', 'true')
      } catch (error) {
        // Storage can be unavailable in private browsing; the loader still dismisses.
      }
    }

    if (hasVisited || prefersReducedMotion) {
      dismissLoading()
    } else {
      if (loadingSkip) loadingSkip.addEventListener('click', dismissLoading)
      window.addEventListener('load', () => window.setTimeout(dismissLoading, 1500), { once: true })
      window.setTimeout(dismissLoading, 1500)
    }
  }

  /**
   * Narrative portfolio chapters
   */
  const storyChapters = select('[data-story-chapter]', true)
  const storyTitle = select('[data-story-title]')
  const storyText = select('[data-story-text]')
  const storyPrompt = select('[data-story-prompt]')
  const storyNumber = select('.story-panel-number')
  const storyProgress = select('.story-progress-fill')
  const storyNext = select('[data-story-next]')
  const storyStart = select('[data-story-start]')
  const storyPanel = select('#story-panel')

  const storyData = [
    {
      title: 'Le déclic',
      text: "Tout commence par l'envie de comprendre comment les mondes numériques prennent vie, puis de les rendre réels avec mes propres outils.",
      prompt: 'Quelle piste veux-tu suivre ?'
    },
    {
      title: 'Construire',
      text: "Du Tetris multijoueur au développement web, j'apprends en construisant des projets concrets, en équipe comme en autonomie.",
      prompt: 'Le code devient un terrain de jeu.'
    },
    {
      title: 'Explorer',
      text: "La 3D, la réalité virtuelle et les mathématiques OpenGL m'ont appris à penser en volumes, en interactions et en expériences.",
      prompt: "L'immersion ouvre une nouvelle dimension."
    },
    {
      title: 'Créer',
      text: "Entre musique, IA et prototypes de jeux, je relie la technique à la créativité pour donner une identité forte à chaque projet.",
      prompt: "Tu connais maintenant mon parcours."
    }
  ]

  const selectStoryChapter = (index) => {
    const data = storyData[index]
    if (!data || !storyTitle || !storyText) return

    storyChapters.forEach((chapter, chapterIndex) => {
      chapter.classList.toggle('is-active', chapterIndex === index)
      chapter.setAttribute('aria-selected', String(chapterIndex === index))
      chapter.setAttribute('aria-current', chapterIndex === index ? 'step' : 'false')
      chapter.setAttribute('tabindex', chapterIndex === index ? '0' : '-1')
    })
    storyNumber.textContent = `CHAPITRE ${String(index + 1).padStart(2, '0')}`
    storyTitle.textContent = data.title
    storyText.textContent = data.text
    storyPrompt.textContent = data.prompt
    storyProgress.style.width = `${((index + 1) / storyData.length) * 100}%`
    storyPanel.setAttribute('aria-labelledby', `story-tab-${index}`)
    storyNext.innerHTML = index === storyData.length - 1
      ? 'Rejouer <i class="bi bi-arrow-repeat"></i>'
      : 'Continuer <i class="bi bi-arrow-right"></i>'
  }

  if (storyChapters.length) {
    storyChapters.forEach((chapter, index) => {
      chapter.addEventListener('click', () => selectStoryChapter(index))
      chapter.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          selectStoryChapter(index)
          return
        }
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
        event.preventDefault()
        const direction = event.key === 'ArrowRight' ? 1 : -1
        const nextIndex = (index + direction + storyChapters.length) % storyChapters.length
        storyChapters[nextIndex].focus()
        selectStoryChapter(nextIndex)
      })
    })
  }

  if (storyNext) {
    storyNext.addEventListener('click', () => {
      const currentIndex = storyChapters.findIndex(chapter => chapter.classList.contains('is-active'))
      selectStoryChapter((currentIndex + 1) % storyData.length)
    })
  }

  if (storyStart) {
    storyStart.addEventListener('click', () => {
      const story = select('#story')
      if (story) story.scrollIntoView({ behavior: scrollBehavior })
    })
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainers = select('.portfolio-container', true);
    if (portfolioContainers.length) {
      let portfolioIsotopes = portfolioContainers.map((portfolioContainer) => new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      }));

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotopes.forEach((portfolioIsotope) => {
          portfolioIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
        });
        AOS.refresh()
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });



  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });


})()