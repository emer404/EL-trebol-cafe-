document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header scroll state
  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = '';
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${current}`);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  function closeMobileMenu() {
    menuToggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });

  // Filter functionality
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.category-item');
  const dropdownBtn = document.querySelector('.dropdown-btn');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  // Dropdown toggle
  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('open');
      dropdownBtn.classList.toggle('dropdown-active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('open');
      dropdownBtn.classList.remove('dropdown-active');
    });

    // Prevent dropdown from closing when clicking inside
    dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Dropdown item filtering
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      const subfilter = item.getAttribute('data-subfilter');
      
      // Remove active class from all main filter buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to bebidas button
      dropdownBtn.classList.add('active');
      
      // Close dropdown
      dropdownMenu.classList.remove('open');
      dropdownBtn.classList.remove('dropdown-active');
      
      items.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          const cat = card.getAttribute('data-cat');
          const subcat = card.getAttribute('data-subcat');
          
          if (cat === 'bebidas' && subcat === subfilter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Skip dropdown button
      if (btn.classList.contains('dropdown-btn')) return;
      
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      dropdownBtn.classList.remove('active');
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      items.forEach(item => {
        // Add a small animation effect
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          if (filterValue === 'todos') {
            // En 'Todos' mostrar solo bebidas, ocultar coworking
            if (item.getAttribute('data-cat') !== 'espacios') {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          } else if (item.getAttribute('data-cat') === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
          
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        }, 300);
      });
    });
  });

  // Ocultar card de coworking al cargar (solo se muestra con filtro Coworking)
  items.forEach(item => {
    if (item.getAttribute('data-cat') === 'espacios') {
      item.style.display = 'none';
    }
  });

  // ---- Pagination ----
  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  const paginationPrev = document.querySelector('.pagination-prev');
  const paginationNext = document.querySelector('.pagination-next');
  const paginationCurrent = document.querySelector('.pagination-current');
  const paginationTotal = document.querySelector('.pagination-total');
  const paginationControls = document.querySelector('.pagination-controls');

  function getVisibleItems() {
    return Array.from(items).filter(item => item.style.display !== 'none');
  }

  function updatePagination() {
    const visibleItems = getVisibleItems();
    const totalPages = Math.max(1, Math.ceil(visibleItems.length / ITEMS_PER_PAGE));
    
    // Reset page if current exceeds total
    if (currentPage > totalPages) currentPage = totalPages;
    
    paginationCurrent.textContent = currentPage;
    paginationTotal.textContent = totalPages;
    
    // Enable/disable buttons
    paginationPrev.disabled = currentPage <= 1;
    paginationNext.disabled = currentPage >= totalPages;
    
    // Show items for current page
    visibleItems.forEach((item, index) => {
      const shouldShow = Math.floor(index / ITEMS_PER_PAGE) + 1 === currentPage;
      if (shouldShow) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (paginationPrev) {
    paginationPrev.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updatePagination();
      }
    });
  }

  if (paginationNext) {
    paginationNext.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      const totalPages = Math.max(1, Math.ceil(visibleItems.length / ITEMS_PER_PAGE));
      if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
      }
    });
  }

  // Initialize pagination
  updatePagination();

  // Update pagination when filters change (after animation completes)
  function applyPaginationAfterFilter() {
    setTimeout(() => {
      currentPage = 1;
      updatePagination();
    }, 400);
  }
  
  // Hook into all filter buttons (including dropdown)
  filterBtns.forEach(btn => {
    if (!btn.classList.contains('dropdown-btn')) {
      btn.addEventListener('click', applyPaginationAfterFilter);
    }
  });
  dropdownItems.forEach(item => {
    item.addEventListener('click', applyPaginationAfterFilter);
  });

  // Expanded card detail
  const modal = document.getElementById('cardModal');
  const modalImage = document.getElementById('modalImage');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalPrice = document.getElementById('modalPrice');
  const closeModalTriggers = document.querySelectorAll('[data-close-modal]');

  const categoryLabels = {
    bebidas: 'Bebida',
    espacios: 'Coworking'
  };

  function openCardModal(card) {
    const image = card.querySelector('.card-img-wrapper img');
    const title = card.querySelector('h3');
    const description = card.querySelector('p');
    const price = card.querySelector('.price');
    const category = card.getAttribute('data-cat');

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalCategory.textContent = categoryLabels[category] || 'Detalle';
    modalTitle.textContent = title.textContent;
    modalDescription.textContent = description.textContent;
    modalPrice.textContent = price.textContent;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeCardModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  items.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Ver detalle de ${item.querySelector('h3').textContent}`);

    item.addEventListener('click', () => openCardModal(item));
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCardModal(item);
      }
    });
  });

  closeModalTriggers.forEach(trigger => {
    trigger.addEventListener('click', closeCardModal);
  });

  const contactForm = document.querySelector('[data-contact-form]');

  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const message = [
        'Hola Trébol Café, quiero más información.',
        `Nombre: ${formData.get('nombre')}`,
        `Correo: ${formData.get('correo')}`,
        `Teléfono: ${formData.get('telefono') || 'No indicado'}`,
        `Mensaje: ${formData.get('mensaje')}`
      ].join('\n');

      window.open(`https://wa.me/573213298852?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      contactForm.reset();
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeCardModal();
    }

    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });
});
