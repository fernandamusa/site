// Configuração e inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Carregar configurações
    loadConfig();
    
    // Inicializar funcionalidades
    initThemeToggle();
    initMobileMenu();
    initSmoothScrolling();
    
    console.log('Site MD Dermatologia carregado com sucesso!');
});

// Função para carregar configurações do config.json
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        
        // Carregar conteúdo do currículo
        loadCurriculoContent(config.sobre.curriculo);
        
        // Carregar áreas de atuação
        loadAreasAtuacao(config.areasAtuacao);
        
        // Carregar conteúdo da clínica
        loadClinicaContent(config.clinica);
        
        // Inicializar carrossel com as fotos do config
        initCarousel(config.clinica.fotos);
        
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        displayConfigError();
    }
}

// Carregar conteúdo do currículo
function loadCurriculoContent(curriculo) {
    const container = document.getElementById('curriculo-content');
    if (container && curriculo && Array.isArray(curriculo)) {
        container.innerHTML = ''; // Limpar conteúdo existente
        curriculo.forEach(paragrafo => {
            const p = document.createElement('p');
            p.textContent = paragrafo;
            p.className = 'mb-4';
            container.appendChild(p);
        });
    } else {
        console.warn('Currículo não encontrado ou formato inválido no config.json');
    }
}

// Carregar áreas de atuação
function loadAreasAtuacao(areas) {
    const container = document.getElementById('areas-atuacao');
    if (container && areas && Array.isArray(areas)) {
        container.innerHTML = ''; // Limpar conteúdo existente
        areas.forEach((area, index) => {
            const card = createAreaCard(area, index);
            container.appendChild(card);
        });
    } else {
        console.warn('Áreas de atuação não encontradas ou formato inválido no config.json');
    }
}

// Criar card de área de atuação
function createAreaCard(area, index) {
    const card = document.createElement('div');
    // Adiciona a nova classe de estilo e as animações do AOS
    card.className = 'atuacao-card-novo';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 100).toString());

    // Verifica se a área tem os dados necessários (título, descrição, e o novo icon_svg)
    if (!area.titulo || !area.descricao || !area.icon_svg) {
        console.warn('Área de atuação com dados incompletos:', area);
        return card;
    }

    // Monta o novo HTML interno do card, baseado no seu exemplo
    card.innerHTML = `
        <div class="flex items-center mb-6">
            <div class="icon-circle">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    ${area.icon_svg}
                </svg>
            </div>
            <h3 class="text-2xl font-bold">${area.titulo}</h3>
        </div>
        <p class="leading-relaxed">
            ${area.descricao}
        </p>
    `;

    return card;
}

// Carregar conteúdo da clínica
function loadClinicaContent(clinica) {
    const container = document.getElementById('clinica-content');
    if (container && clinica && clinica.descricao && Array.isArray(clinica.descricao)) {
        container.innerHTML = ''; // Limpar conteúdo existente
        clinica.descricao.forEach(paragrafo => {
            const p = document.createElement('p');
            p.textContent = paragrafo;
            container.appendChild(p);
        });
    } else {
        console.warn('Descrição da clínica não encontrada ou formato inválido no config.json');
    }
}

// Exibir erro quando config.json não carrega
function displayConfigError() {
    // Exibir mensagem de erro nos containers principais
    const containers = [
        'curriculo-content',
        'areas-atuacao', 
        'clinica-content'
    ];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center text-red-600 dark:text-red-400 p-4">
                    <p>Erro ao carregar conteúdo. Verifique o arquivo config.json.</p>
                </div>
            `;
        }
    });
    
    console.error('Não foi possível carregar o config.json. Verifique se o arquivo existe e está no formato correto.');
}

// Toggle do modo escuro
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');

    if (!themeToggle || !sunIcon || !moonIcon) {
        console.warn('Elementos do toggle de tema não encontrados');
        return;
    }

    // Função para atualizar os ícones com base na classe .dark
    function updateIcons() {
        if (html.classList.contains('dark')) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // Verificar preferência salva ou do sistema na carga inicial
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.classList.add('dark');
    }

    // Define o ícone correto na carga da página
    updateIcons();

    // Adiciona o evento de clique para alternar o tema e os ícones
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');

        // Salvar preferência
        if (html.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }

        // Atualiza os ícones após o clique
        updateIcons();
    });
}

// Menu mobile
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) {
        console.warn('Elementos do menu mobile não encontrados');
        return;
    }
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Fechar menu ao clicar em um link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Smooth scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Carrossel da clínica (agora recebe as fotos do config.json)
function initCarousel(fotosConfig = null) {
    const slidesContainer = document.getElementById('carousel-slides');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!slidesContainer || !indicatorsContainer || !prevBtn || !nextBtn) {
        console.warn('Elementos do carrossel não encontrados');
        return;
    }
    
    // Usar fotos do config.json ou array vazio
    const slides = fotosConfig || [];
    
    if (slides.length === 0) {
        console.warn('Nenhuma foto encontrada para o carrossel no config.json');
        slidesContainer.innerHTML = '<div class="carousel-slide"><div class="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700"><p class="text-gray-500">Fotos não disponíveis</p></div></div>';
        return;
    }
    
    let currentSlide = 0;
    
    // Limpar containers
    slidesContainer.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    // Criar slides
    slides.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${src}" alt="Clínica MD Dermatologia - Foto ${index + 1}" loading="lazy" onerror="this.src='images/placeholder.jpg'">`;
        slidesContainer.appendChild(slide);
        
        // Criar indicador
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        indicator.setAttribute('aria-label', `Ir para slide ${index + 1}`);
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    // Atualizar slide ativo
    function updateSlide() {
        const translateX = -currentSlide * 100;
        slidesContainer.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar indicadores
        const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Ir para slide específico
    function goToSlide(index) {
        currentSlide = index;
        updateSlide();
    }
    
    // Slide anterior
    function prevSlide() {
        currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        updateSlide();
    }
    
    // Próximo slide
    function nextSlide() {
        currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
        updateSlide();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Auto-play (opcional) - apenas se houver mais de 1 slide
    if (slides.length > 1) {
        setInterval(nextSlide, 5000);
    }
    
    // Inicializar
    updateSlide();
}

// Lazy loading para imagens
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy-load');
            imageObserver.observe(img);
        });
    }
}

// Detectar scroll para animações da navbar
function initScrollEffects() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Adicionar sombra quando não está no topo
        if (currentScrollY > 10) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Inicializar efeitos adicionais
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    initScrollEffects();
});

// Service Worker para cache (PWA básico)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso');
            })
            .catch(registrationError => {
                console.log('Falha ao registrar SW');
            });
    });
}
