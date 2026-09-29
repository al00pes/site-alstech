document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.getElementById('main-nav');

  const closeMenu = () => {
    mainNav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    menuToggle.textContent = '☰';
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    menuToggle.textContent = isOpen ? '×' : '☰';
  });

  mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const mobileNavigation = window.matchMedia('(max-width: 780px)');
  mobileNavigation.addEventListener('change', closeMenu);

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

  const projectData = {
    documentos: {
      category: 'Mineração',
      title: 'Automação da gestão de documentos',
      summary: 'Um ambiente centralizado para acompanhar a situação documental da operação.',
      challenge: 'Acompanhar documentos, responsáveis e prazos em controles manuais.',
      solution: 'Ambiente centralizado para visualizar documentos, responsáveis, vencimentos e pendências.',
      benefit: 'Mais organização, menos retrabalho e identificação rápida de pendências.',
      media: [
        { type: 'video', src: 'imagem/mineradora_ipe/apresentacao_dashboard.mp4', alt: 'Demonstração do dashboard de gestão de documentos' }
      ]
    },
    estoque: {
      category: 'Varejo',
      title: 'Controle de estoque e vendas',
      summary: 'Produtos, movimentações e vendas gerenciados em uma única solução.',
      challenge: 'Controles separados e dificuldade para acompanhar produtos e vendas.',
      solution: 'Sistema centralizado para cadastro, estoque, movimentações e vendas.',
      benefit: 'Mais controle da operação, menos erros manuais e acesso rápido às informações.',
      media: [
        { type: 'image', src: 'imagem/sistema_estoque/catalogo1.png', alt: 'Tela de cadastro e controle de produtos' },
        { type: 'image', src: 'imagem/sistema_estoque/vendas.png', alt: 'Tela de registro e acompanhamento de vendas' },
        { type: 'image', src: 'imagem/sistema_estoque/movimentacao.png', alt: 'Tela de movimentação do estoque' }
      ]
    },
    pizzaria: {
      category: 'Fast food',
      title: 'Gestão inteligente da produção de pizzas',
      summary: 'Visão integrada da operação para apoiar decisões rápidas e reduzir desperdícios.',
      challenge: 'Falta de integração entre estoque, produção, CMV e entregas.',
      solution: 'Controle integrado de estoque, produção, CMV e entregas em um painel visual.',
      benefit: 'Identificação rápida de atrasos, custos, desperdícios e pontos de atenção.',
      media: [
        { type: 'image', src: 'imagem/estoque_food/producao.png', alt: 'Painel de acompanhamento da produção' },
        { type: 'image', src: 'imagem/estoque_food/dash.png', alt: 'Dashboard geral da operação' },
        { type: 'image', src: 'imagem/estoque_food/insumo.png', alt: 'Painel de controle de insumos' }
      ]
    }
  };

  const projectsViewport = document.querySelector('.projects-viewport');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const projectDots = document.querySelector('.project-dots');
  const currentProject = document.getElementById('project-current');
  const totalProjects = document.getElementById('project-total');
  let selectedProjectIndex = 0;
  let projectScrollFrame;

  const selectProject = (newIndex, shouldScroll = true) => {
    selectedProjectIndex = (newIndex + projectCards.length) % projectCards.length;
    projectCards.forEach((card, index) => {
      const isSelected = index === selectedProjectIndex;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-label', `${isSelected ? 'Projeto selecionado: ' : 'Projeto: '}${projectData[card.dataset.project].title}`);
    });
    Array.from(projectDots.children).forEach((dot, index) => dot.setAttribute('aria-selected', String(index === selectedProjectIndex)));
    currentProject.textContent = String(selectedProjectIndex + 1);
    if (shouldScroll) {
      const card = projectCards[selectedProjectIndex];
      projectsViewport.scrollTo({ left: card.offsetLeft - projectCards[0].offsetLeft, behavior: 'smooth' });
    }
  };

  if (projectsViewport && projectCards.length) {
    totalProjects.textContent = String(projectCards.length);
    projectCards.forEach((card, index) => {
      const dot = document.createElement('button');
      dot.className = 'project-dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Selecionar projeto ${index + 1}`);
      dot.addEventListener('click', () => selectProject(index));
      projectDots.appendChild(dot);
      card.addEventListener('click', (event) => {
        if (!event.target.closest('button')) selectProject(index);
      });
    });
    selectProject(0, false);
    document.querySelector('.project-prev').addEventListener('click', () => selectProject(selectedProjectIndex - 1));
    document.querySelector('.project-next').addEventListener('click', () => selectProject(selectedProjectIndex + 1));
    projectsViewport.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        selectProject(selectedProjectIndex + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    projectsViewport.addEventListener('scroll', () => {
      cancelAnimationFrame(projectScrollFrame);
      projectScrollFrame = requestAnimationFrame(() => {
        const viewportCenter = projectsViewport.scrollLeft + projectsViewport.clientWidth / 2;
        const closestIndex = projectCards.reduce((closest, card, index) => {
          const cardCenter = card.offsetLeft - projectCards[0].offsetLeft + card.offsetWidth / 2;
          const closestCard = projectCards[closest];
          const closestCenter = closestCard.offsetLeft - projectCards[0].offsetLeft + closestCard.offsetWidth / 2;
          return Math.abs(cardCenter - viewportCenter) < Math.abs(closestCenter - viewportCenter) ? index : closest;
        }, 0);
        if (closestIndex !== selectedProjectIndex) selectProject(closestIndex, false);
      });
    }, { passive: true });
  }

  const projectDialog = document.getElementById('project-dialog');
  const projectDialogContent = document.getElementById('project-dialog-content');
  const approvalActions = projectDialog.querySelector('.approval-actions');
  const approvalFeedback = document.getElementById('approval-feedback');
  let galleryIndex = 0;

  const moveGallery = (newIndex) => {
    const track = projectDialog.querySelector('.project-gallery-track');
    const slides = projectDialog.querySelectorAll('.project-gallery-slide');
    if (!track || !slides.length) return;
    galleryIndex = (newIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${galleryIndex * 100}%)`;
    projectDialog.querySelector('.project-gallery-count').textContent = `${galleryIndex + 1} / ${slides.length}`;
  };

  const openProject = (projectId) => {
    const project = projectData[projectId];
    if (!project) return;
    const slides = project.media.map((item) => `<div class="project-gallery-slide">${item.type === 'video' ? `<video controls muted playsinline aria-label="${item.alt}"><source src="${item.src}" type="video/mp4"></video>` : `<img src="${item.src}" alt="${item.alt}" loading="lazy">`}</div>`).join('');
    projectDialogContent.innerHTML = `
      <header class="project-dialog-header"><span class="project-tag">${project.category}</span><h3 id="project-dialog-title">${project.title}</h3><p>${project.summary}</p></header>
      <div class="project-detail-grid">
        <dl class="case-details"><div><dt>Desafio</dt><dd>${project.challenge}</dd></div><div><dt>Solução</dt><dd>${project.solution}</dd></div><div><dt>Benefício</dt><dd>${project.benefit}</dd></div></dl>
        <div class="project-gallery"><div class="project-gallery-main"><div class="project-gallery-track">${slides}</div></div><div class="project-gallery-nav"><button class="gallery-prev" type="button" aria-label="Mídia anterior"><i class="fas fa-chevron-left" aria-hidden="true"></i></button><span class="project-gallery-count" aria-live="polite">1 / ${project.media.length}</span><button class="gallery-next" type="button" aria-label="Próxima mídia"><i class="fas fa-chevron-right" aria-hidden="true"></i></button></div></div>
      </div>`;
    galleryIndex = 0;
    projectDialog.querySelector('.gallery-prev').addEventListener('click', () => moveGallery(galleryIndex - 1));
    projectDialog.querySelector('.gallery-next').addEventListener('click', () => moveGallery(galleryIndex + 1));
    approvalActions.hidden = document.body.dataset.userRole !== 'approver';
    approvalFeedback.textContent = '';
    projectDialog.showModal();
  };

  document.querySelectorAll('.project-details-button').forEach((button) => button.addEventListener('click', () => openProject(button.dataset.project)));
  projectDialog.querySelector('.project-dialog-close').addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', (event) => { if (event.target === projectDialog) projectDialog.close(); });
  projectDialog.querySelector('.approval-approve').addEventListener('click', () => { approvalFeedback.textContent = 'Projeto aprovado com sucesso.'; });
  projectDialog.querySelector('.approval-reject').addEventListener('click', () => { approvalFeedback.textContent = 'Projeto marcado como rejeitado.'; });

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
