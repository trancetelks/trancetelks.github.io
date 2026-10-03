// ── PARTICLES ──
document.addEventListener("DOMContentLoaded", function () {
    particlesJS('particles', {
        particles: {
            number: { value: 90, density: { enable: true, value_area: 900 } },
            color: { value: ["#ff6b9d", "#ff7dee", "#ffffff", "#ffc3fa"] },
            shape: { type: ["circle", "star"] },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.08, sync: false } },
            size: { value: 2.6, random: true, anim: { enable: true, speed: 1.2, size_min: 0.4, sync: false } },
            line_linked: { enable: false },
            move: { enable: true, speed: 0.5, direction: "top", random: true, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "bubble" }, onclick: { enable: true, mode: "push" }, resize: true },
            modes: { bubble: { distance: 120, size: 5, duration: 1.5, opacity: 0.8, speed: 3 }, push: { particles_nb: 3 } }
        },
        retina_detect: true
    });
});

// ── NAVBAR scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── HAMBURGER ──
function toggleMenu() {
    const links   = document.getElementById('navLinks');
    const ham     = document.getElementById('hamburger');
    const overlay = document.getElementById('navOverlay');
    links.classList.toggle('open');
    ham.classList.toggle('active');
    overlay.classList.toggle('visible');
}
function closeMenu() {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
    document.getElementById('navOverlay').classList.remove('visible');
}

// ── EMBEDS (carga diferida) ──
// Los scripts de Instagram y TikTok son pesados (cada uno crea iframes
// completos por cada post). En vez de cargarlos siempre al abrir la página,
// los inyectamos solo cuando la sección "Contenido" entra en pantalla,
// y solo para la plataforma (pestaña) que está activa en ese momento.
const embedScripts = {
    tiktok:    { src: 'https://www.tiktok.com/embed.js',    loaded: false, loading: null },
    instagram: { src: 'https://www.instagram.com/embed.js', loaded: false, loading: null }
};

function loadEmbedScript(platform) {
    const entry = embedScripts[platform];
    if (!entry) return Promise.resolve();
    if (entry.loaded) return Promise.resolve();
    if (entry.loading) return entry.loading;

    entry.loading = new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = entry.src;
        script.async = true;
        script.onload = () => { entry.loaded = true; resolve(); };
        script.onerror = () => resolve(); // si falla, no bloqueamos el resto de la página
        document.body.appendChild(script);
    });
    return entry.loading;
}

function renderEmbeds(platform) {
    if (platform === 'instagram' && window.instgrm) instgrm.Embeds.process();
    if (platform === 'tiktok' && window.tiktokEmbed) window.tiktokEmbed.lib.render(document.querySelectorAll('.tiktok-embed'));
}

// Cuando la sección "Contenido" entra en pantalla, cargamos únicamente
// el embed de la pestaña activa en ese momento (por defecto, TikTok).
const contenidoSection = document.getElementById('contenido');
if (contenidoSection) {
    const contenidoObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeTab = document.querySelector('#contenido .tab-content.active');
                if (activeTab) {
                    loadEmbedScript(activeTab.id).then(() => renderEmbeds(activeTab.id));
                }
                obs.disconnect();
            }
        });
    }, { threshold: 0.15 });
    contenidoObserver.observe(contenidoSection);
}

// ── TABS ──
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(b => {
        if (b.textContent.toLowerCase().includes(tabName)) b.classList.add('active');
    });
    loadEmbedScript(tabName).then(() => {
        setTimeout(() => renderEmbeds(tabName), 100);
    });
}

// ── FLIP CARDS ──
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', e => {
        // Si el click fue en el botón "Ver perfil", no voltear — dejar que el link funcione
        if (e.target.closest('.profile-btn')) return;
        card.classList.toggle('flipped');
    });
});

// Blindaje extra: capturamos el click en profile-btn ANTES de que
// pueda llegar al listener de la card (fase de captura, no de burbuja),
// y detenemos su propagación de inmediato. Esto garantiza que el flip
// nunca se dispare al usar el botón "Ver perfil", sin importar el
// dispositivo o el orden de los demás listeners.
document.querySelectorAll('.profile-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.stopImmediatePropagation();
    }, true);
});

// ── SCROLL reveal ──
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.section, .social-card, .flip-card, .anime-item').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});