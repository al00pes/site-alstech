document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    menuToggle.textContent = isOpen ? '×' : '☰';
  });

  mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mainNav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    menuToggle.textContent = '☰';
  }));

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('hidden');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.remove('hidden'));
  }

  const initCarousel = (id) => {
    const track = document.getElementById(`${id}-track`);
    if (!track) return;
    const slides = Array.from(track.children);
    if (slides.length <= 1) return;
    const nextButton = document.querySelector(`.carousel-control.next[data-target="${id}"]`);
    const prevButton = document.querySelector(`.carousel-control.prev[data-target="${id}"]`);
    let index = 0;
    let startX = 0;
    let dragDistance = 0;

    const move = (newIndex) => {
      index = (newIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    };
    nextButton?.addEventListener('click', () => move(index + 1));
    prevButton?.addEventListener('click', () => move(index - 1));
    track.addEventListener('pointerdown', (event) => {
      startX = event.clientX;
      dragDistance = 0;
      track.setPointerCapture(event.pointerId);
    });
    track.addEventListener('pointermove', (event) => {
      if (track.hasPointerCapture(event.pointerId)) dragDistance = event.clientX - startX;
    });
    track.addEventListener('pointerup', (event) => {
      track.releasePointerCapture(event.pointerId);
      if (Math.abs(dragDistance) > 50) move(index + (dragDistance < 0 ? 1 : -1));
    });
  };
  ['logistica', 'churn', 'saas'].forEach(initCarousel);

  document.getElementById('current-year').textContent = new Date().getFullYear();
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-message');
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    formStatus.textContent = 'Enviando sua mensagem...';
    try {
      const response = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Falha no envio');
      formStatus.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = 'Não foi possível enviar agora. Tente novamente em alguns instantes.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  });
});
