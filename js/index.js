const navbar = document.getElementById("navbar");
const sectionIds = ["about", "projects", "contact"];
const navLinks = document.querySelectorAll(".desktop-nav a[href^='#'], .mobile-menu a[href^='#']");
const desktopNavLinks = document.querySelectorAll(".desktop-nav a[href^='#']");
const mobileNavLinks = document.querySelectorAll(".mobile-menu a[href^='#']");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

/* NAVBAR SHADOW */
function updateNavbarShadow() {
    if (!navbar) return;

    if (window.scrollY > 10) {
        navbar.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
    } else {
        navbar.style.boxShadow = "none";
    }
}

updateNavbarShadow();
window.addEventListener("scroll", updateNavbarShadow, { passive: true });

/* SMOOTH SCROLL MEJORADO */
navLinks.forEach((link) => {
    link.addEventListener("click", function(e) {
        const href = this.getAttribute("href");

        // Caso 1: Es un ancla interna (ej: "#about")
        if (href.startsWith("#")) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                closeMobileMenu();
            }
        } 
        // Caso 2: Es un link a otra página con ancla (ej: "../index.html#about")
        // No hacemos nada, dejamos que el navegador cambie de página normalmente.
    });
});

/* ACTIVE SECTION IN NAV */
const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

if (sections.length) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const activeId = `#${entry.target.id}`;

                desktopNavLinks.forEach((link) => {
                    if (link.getAttribute("href") === activeId) {
                        link.setAttribute("aria-current", "page");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });

                mobileNavLinks.forEach((link) => {
                    if (link.getAttribute("href") === activeId) {
                        link.setAttribute("aria-current", "page");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        }, {
            rootMargin: "-40% 0px -45% 0px",
            threshold: 0.1
        }
    );

    sections.forEach((section) => observer.observe(section));
}

/* THEME TOGGLE */
function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-mode", isDark);

    if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Activar modo claro" : "Activar modo oscuro"
        );
    }

    localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
} else {
    applyTheme("light");
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-mode");
        applyTheme(isDark ? "light" : "dark");
    });
}

/* MOBILE MENU */
function openMobileMenu() {
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.add("is-open");
    menuToggle.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú");
}

function closeMobileMenu() {
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
}

function toggleMobileMenu() {
    if (!mobileMenu) return;

    const isOpen = mobileMenu.classList.contains("is-open");
    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu);
}

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMobileMenu();
    }
});
