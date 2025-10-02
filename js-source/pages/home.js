/**
 * EFECTIVA PORTAL - HOME PAGE JAVASCRIPT
 * Interacciones específicas de la página principal
 * Actualizado: 2025
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar todas las funcionalidades
  initScrollReveal();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initScrollToTop();
  initCounterAnimation();
  initParallax();
});

/* ========================================
   SCROLL REVEAL
   ======================================== */

/**
 * Detecta elementos al hacer scroll y les agrega la clase 'is-visible'
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Opcional: dejar de observar después de revelar
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/* ========================================
   HEADER SCROLL EFFECT
   ======================================== */

/**
 * Agrega clase al header cuando se hace scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Agregar clase 'is-scrolled' cuando scroll > threshold
    if (currentScroll > scrollThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    lastScroll = currentScroll;
  });
}

/* ========================================
   MOBILE MENU
   ======================================== */

/**
 * Maneja el menú móvil (hamburger menu)
 */
function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');
  const dropdownTriggers = document.querySelectorAll('.nav__item--dropdown > .nav__link');
  const megaTriggers = document.querySelectorAll('.nav__item--mega > .nav__link');
  
  if (!toggle || !menu) return;

  // Toggle del menú principal
  toggle.addEventListener('click', () => {
    const isActive = toggle.classList.toggle('is-active');
    menu.classList.toggle('is-active');
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  // Toggle de dropdowns en móvil
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 1023) {
        e.preventDefault();
        const parent = trigger.parentElement;
        parent.classList.toggle('is-active');
      }
    });
  });

  // Toggle de mega menus en móvil
  megaTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 1023) {
        e.preventDefault();
        const parent = trigger.parentElement;
        parent.classList.toggle('is-active');
      }
    });
  });

  // Cerrar menú al hacer clic en un link
  const menuLinks = menu.querySelectorAll('.nav__link:not(.nav__link--dropdown)');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1023) {
        toggle.classList.remove('is-active');
        menu.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  });

  // Cerrar menú al cambiar tamaño de ventana
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1023) {
      toggle.classList.remove('is-active');
      menu.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */

/**
 * Scroll suave para enlaces internos
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Ignorar si el href es solo "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Actualizar URL sin recargar
        history.pushState(null, '', href);
      }
    });
  });
}

/* ========================================
   SCROLL TO TOP
   ======================================== */

/**
 * Funcionalidad del botón "volver arriba"
 */
function initScrollToTop() {
  const scrollButton = document.querySelector('.home-hero__scroll');
  const backToTopButton = document.querySelector('.footer__back-to-top');
  
  // Scroll indicator del hero
  if (scrollButton) {
    scrollButton.addEventListener('click', () => {
      const nextSection = document.querySelector('.home-features');
      if (nextSection) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = nextSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  // Back to top button
  if (backToTopButton) {
    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ========================================
   COUNTER ANIMATION
   ======================================== */

/**
 * Anima números (contadores) cuando entran en el viewport
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.home-hero__stat-value');
  
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;
    const suffix = counter.textContent.replace(/[0-9]/g, '');

    const updateCounter = () => {
      current += increment;
      
      if (current < target) {
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + suffix;
      }
    };

    updateCounter();
  };

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Solo animar una vez
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

/* ========================================
   PARALLAX EFFECT
   ======================================== */

/**
 * Efecto parallax simple para elementos específicos
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax, .home-hero__shape');
  
  if (parallaxElements.length === 0) return;

  let ticking = false;

  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

/* ========================================
   USER MENU DROPDOWN
   ======================================== */

/**
 * Maneja el dropdown del usuario
 */
function initUserMenu() {
  const userTrigger = document.querySelector('.nav__user-trigger');
  const userMenu = document.querySelector('.nav__user');
  
  if (!userTrigger || !userMenu) return;

  userTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu.classList.toggle('is-active');
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!userMenu.contains(e.target)) {
      userMenu.classList.remove('is-active');
    }
  });
}

/* ========================================
   SEARCH FUNCTIONALITY
   ======================================== */

/**
 * Maneja la funcionalidad de búsqueda
 */
function initSearch() {
  const searchInput = document.querySelector('.nav__search-input');
  
  if (!searchInput) return;

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      
      if (searchTerm) {
        // Aquí puedes implementar la lógica de búsqueda
        console.log('Buscando:', searchTerm);
        
        // Ejemplo: redirigir a página de búsqueda
        // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
      }
    }
  });
}

/* ========================================
   NEWSLETTER FORM
   ======================================== */

/**
 * Maneja el formulario de newsletter
 */
function initNewsletterForm() {
  const form = document.querySelector('.footer__newsletter-form');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const input = form.querySelector('.footer__newsletter-input');
    const button = form.querySelector('.footer__newsletter-button');
    const email = input.value.trim();

    if (!email) return;

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    // Deshabilitar botón durante el envío
    button.disabled = true;
    button.textContent = 'Enviando...';

    try {
      // Aquí implementarías la llamada a tu API
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // Simulación de éxito
      setTimeout(() => {
        alert('¡Gracias por suscribirte!');
        input.value = '';
        button.disabled = false;
        button.textContent = 'Suscribirse';
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error. Por favor intenta de nuevo.');
      button.disabled = false;
      button.textContent = 'Suscribirse';
    }
  });
}

/* ========================================
   CARD ANIMATIONS ON HOVER
   ======================================== */

/**
 * Efecto de inclinación en las cards al mover el mouse
 */
function initCardTilt() {
  const cards = document.querySelectorAll('.card, .home-features__item');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ========================================
   LAZY LOADING DE IMÁGENES
   ======================================== */

/**
 * Carga perezosa de imágenes
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if (images.length === 0) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    imageObserver.observe(img);
  });
}

/* ========================================
   PERFORMANCE OPTIMIZATIONS
   ======================================== */

/**
 * Limpia las propiedades will-change después de las animaciones
 */
function cleanupAnimations() {
  const animatedElements = document.querySelectorAll('.will-animate');
  
  animatedElements.forEach(element => {
    element.addEventListener('animationend', () => {
      element.classList.remove('will-animate');
      element.classList.add('animation-complete');
    });
  });
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/**
 * Throttle function para optimizar eventos de scroll/resize
 */
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  
  return function(...args) {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;
    
    clearTimeout(timeoutId);
    
    if (timeSinceLastExec > delay) {
      lastExecTime = currentTime;
      func.apply(this, args);
    } else {
      timeoutId = setTimeout(() => {
        lastExecTime = Date.now();
        func.apply(this, args);
      }, delay - timeSinceLastExec);
    }
  };
}

/**
 * Debounce function para optimizar eventos
 */
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/* ========================================
   EXPORT (si usas módulos ES6)
   ======================================== */

// Si trabajas con módulos, puedes exportar las funciones
// export {
//   initScrollReveal,
//   initMobileMenu,
//   initSmoothScroll
// };