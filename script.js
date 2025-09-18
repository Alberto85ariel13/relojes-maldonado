const docReady = (fn) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
};

docReady(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navLinkItems = document.querySelectorAll(".nav-links a");
  const navInner = document.querySelector(".nav-inner");
  const scrollTopButton = document.querySelector(".scroll-top");
  const yearTag = document.getElementById("year");
  const whatsappForm = document.getElementById("whatsapp-form");
  const whatsappFeedback = document.querySelector(".form-feedback");
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterFeedback = document.querySelector(".newsletter-feedback");
  const animateItems = document.querySelectorAll("[data-animate]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const closeMenu = () => {
    if (!navToggle || !navLinks) return;
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (yearTag) {
    yearTag.textContent = new Date().getFullYear();
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      const nextState = !expanded;
      navToggle.setAttribute("aria-expanded", String(nextState));
      navLinks.classList.toggle("is-open", nextState);
    });

    navLinkItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.classList.contains("is-open")) return;
      if (navInner && navInner.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
        closeMenu();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  if (!prefersReducedMotion && animateItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    animateItems.forEach((item) => observer.observe(item));
  } else {
    animateItems.forEach((item) => item.classList.add("is-visible"));
  }

  if (scrollTopButton) {
    const toggleScrollTop = () => {
      if (window.scrollY > 400) {
        scrollTopButton.classList.add("is-visible");
      } else {
        scrollTopButton.classList.remove("is-visible");
      }
    };

    toggleScrollTop();
    window.addEventListener("scroll", toggleScrollTop);

    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  if (whatsappForm) {
    whatsappForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(whatsappForm);
      const nombre = formData.get("nombre")?.toString().trim();
      const email = formData.get("email")?.toString().trim();
      const telefono = formData.get("telefono")?.toString().trim();
      const servicio = formData.get("servicio")?.toString();
      const mensaje = formData.get("mensaje")?.toString().trim();

      if (!nombre || !telefono || !servicio || !mensaje) {
        if (whatsappFeedback) {
          whatsappFeedback.textContent = "Por favor completa los campos obligatorios.";
          whatsappFeedback.style.color = "#ffb657";
        }
        return;
      }

      const whatsappNumber = "34600123456";
      const messagePieces = [
        `Hola Relojes Maldonado, soy ${nombre}.`,
        servicio ? `Estoy interesado en: ${servicio}.` : "",
        mensaje ? `Detalle: ${mensaje}` : "",
        telefono ? `Mi teléfono es: ${telefono}.` : "",
        email ? `Puedes escribirme a: ${email}.` : "",
      ].filter(Boolean);

      const finalMessage = encodeURIComponent(messagePieces.join("\n"));
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${finalMessage}`;

      if (whatsappFeedback) {
        whatsappFeedback.textContent = "Redirigiéndote a WhatsApp...";
        whatsappFeedback.style.color = "#2cd4b2";
      }

      const popup = window.open(whatsappUrl, "_blank");
      if (popup) {
        popup.opener = null;
      }

      setTimeout(() => {
        whatsappForm.reset();
        if (whatsappFeedback) {
          whatsappFeedback.textContent = "Mensaje preparado. Si no ves WhatsApp, revisa bloqueadores o ventanas emergentes.";
          whatsappFeedback.style.color = "#98a0bc";
        }
      }, 800);
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = newsletterForm.elements["newsletter-email"].value.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (newsletterFeedback) {
          newsletterFeedback.textContent = "Introduce un correo válido.";
          newsletterFeedback.style.color = "#ffb657";
        }
        return;
      }

      if (newsletterFeedback) {
        newsletterFeedback.textContent = "¡Gracias! Te enviaremos novedades exclusivas.";
        newsletterFeedback.style.color = "#2cd4b2";
      }

      newsletterForm.reset();
    });
  }
});
