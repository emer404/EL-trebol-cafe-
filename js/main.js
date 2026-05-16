document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');

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

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      items.forEach(item => {
        // Add a small animation effect
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          if (filterValue === 'todos' || item.getAttribute('data-cat') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        }, 300);
      });
    });
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

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeCardModal();
    }

    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });
});
