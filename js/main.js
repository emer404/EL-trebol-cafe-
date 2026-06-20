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
  const dropdownBtns = document.querySelectorAll('.dropdown-btn');
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let activeFilter = 'todos';
  let activeSubfilter = null;
  const paginationPrev = document.querySelector('.pagination-prev');
  const paginationNext = document.querySelector('.pagination-next');
  const paginationCurrent = document.querySelector('.pagination-current');
  const paginationTotal = document.querySelector('.pagination-total');
  const paginationControls = document.querySelector('.pagination-controls');

  function closeDropdowns() {
    dropdownMenus.forEach(menu => menu.classList.remove('open'));
    dropdownBtns.forEach(btn => btn.classList.remove('dropdown-active'));
  }

  dropdownBtns.forEach(dropdownBtn => {
    const dropdownMenu = dropdownBtn.nextElementSibling;

    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.contains('open');
      closeDropdowns();

      if (isOpen) return;

      dropdownMenu.classList.toggle('open');
      dropdownBtn.classList.toggle('dropdown-active');
    });

    dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  document.addEventListener('click', closeDropdowns);

  function getFilteredItems() {
    return Array.from(items).filter(item => {
      const category = item.getAttribute('data-cat');
      const subcategory = item.getAttribute('data-subcat');

      if (activeFilter === 'todos') {
        return category !== 'espacios';
      }

      if (activeSubfilter) {
        return category === activeFilter && subcategory === activeSubfilter;
      }

      return category === activeFilter;
    });
  }

  function updatePagination() {
    const filteredItems = getFilteredItems();
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));

    if (currentPage > totalPages) currentPage = totalPages;

    const firstItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastItem = firstItem + ITEMS_PER_PAGE;

    items.forEach(item => {
      item.style.display = 'none';
      item.style.opacity = '0';
      item.style.transform = 'scale(0.9)';
    });

    filteredItems.slice(firstItem, lastItem).forEach(item => {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      }, 50);
    });

    if (paginationCurrent) paginationCurrent.textContent = currentPage;
    if (paginationTotal) paginationTotal.textContent = totalPages;
    if (paginationPrev) paginationPrev.disabled = currentPage <= 1;
    if (paginationNext) paginationNext.disabled = currentPage >= totalPages;
    if (paginationControls) paginationControls.classList.toggle('hidden', filteredItems.length <= ITEMS_PER_PAGE);
  }

  function setActiveFilter(filter, subfilter = null) {
    activeFilter = filter;
    activeSubfilter = subfilter;
    currentPage = 1;

    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });

    updatePagination();
  }

  dropdownItems.forEach(dropdownItem => {
    dropdownItem.addEventListener('click', () => {
      const dropdown = dropdownItem.closest('.filter-dropdown');
      const button = dropdown.querySelector('.dropdown-btn');
      const filter = button.getAttribute('data-filter');
      const subfilter = dropdownItem.getAttribute('data-subfilter');

      closeDropdowns();
      setActiveFilter(filter, subfilter);
    });
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('dropdown-btn')) return;
      setActiveFilter(btn.getAttribute('data-filter'));
    });
  });

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
      const totalPages = Math.max(1, Math.ceil(getFilteredItems().length / ITEMS_PER_PAGE));
      if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
      }
    });
  }

  updatePagination();

  // Expanded card detail
  const modal = document.getElementById('cardModal');
  const modalImage = document.getElementById('modalImage');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalPrice = document.getElementById('modalPrice');
  const modalReserveLink = document.getElementById('modalReserveLink');
  const modalPrev = document.querySelector('.card-modal-prev');
  const modalNext = document.querySelector('.card-modal-next');
  const closeModalTriggers = document.querySelectorAll('[data-close-modal]');
  let modalGallery = [];
  let modalGalleryIndex = 0;

  const categoryLabels = {
    bebidas: 'Bebida',
    comidas: 'Comida',
    espacios: 'Coworking'
  };

  function updateModalImage() {
    modalImage.src = modalGallery[modalGalleryIndex];
  }

  function showModalGalleryImage(direction) {
    if (modalGallery.length <= 1) return;

    modalGalleryIndex = (modalGalleryIndex + direction + modalGallery.length) % modalGallery.length;
    updateModalImage();
  }

  function openCardModal(card) {
    const image = card.querySelector('.card-img-wrapper img');
    const title = card.querySelector('h3');
    const description = card.querySelector('p');
    const price = card.querySelector('.price');
    const category = card.getAttribute('data-cat');
    const gallery = card.getAttribute('data-gallery');

    modalGallery = gallery ? gallery.split(',').map(src => src.trim()).filter(Boolean) : [image.getAttribute('src')];
    modalGalleryIndex = 0;
    updateModalImage();
    modalImage.alt = image.alt;
    modal.classList.toggle('has-gallery', modalGallery.length > 1);
    modalCategory.textContent = categoryLabels[category] || 'Detalle';
    modalTitle.textContent = title.textContent;
    modalDescription.textContent = description.textContent;
    modalPrice.textContent = price.textContent;

    if (modalReserveLink) {
      const message = [
        'Hola Trébol Café, quiero reservar este producto.',
        `Producto: ${title.textContent}`,
        `Categoría: ${categoryLabels[category] || 'Detalle'}`,
        `Precio: ${price.textContent}`
      ].join('\n');

      modalReserveLink.href = `https://wa.me/573213298852?text=${encodeURIComponent(message)}`;
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeCardModal() {
    modal.classList.remove('is-open');
    modal.classList.remove('has-gallery');
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

  if (modalPrev && modalNext) {
    modalPrev.addEventListener('click', event => {
      event.stopPropagation();
      showModalGalleryImage(-1);
    });

    modalNext.addEventListener('click', event => {
      event.stopPropagation();
      showModalGalleryImage(1);
    });
  }

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

    if (event.key === 'ArrowLeft' && modal.classList.contains('is-open')) {
      showModalGalleryImage(-1);
    }

    if (event.key === 'ArrowRight' && modal.classList.contains('is-open')) {
      showModalGalleryImage(1);
    }

    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });
});
