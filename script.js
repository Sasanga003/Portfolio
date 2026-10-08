/* ===========================
   LOADING SCREEN
=========================== */
const loader = document.getElementById("loader");
const loaderStart = Date.now();
const MIN_LOAD_TIME = 1000;

document.body.style.overflow = "hidden";

function hideLoader() {
  if (!loader || loader.classList.contains("hidden")) return;
  const wait = Math.max(0, MIN_LOAD_TIME - (Date.now() - loaderStart));
  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
  }, wait);
}

window.addEventListener("load", hideLoader);
setTimeout(hideLoader, 6000);

/* ===========================
   THEME TOGGLE
=========================== */
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const html = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className =
    theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

/* ===========================
   SECTION FADE TRANSITION
=========================== */
const pageTransition = document.getElementById("page-transition");
const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId.length <= 1) return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl || !pageTransition) return;

    e.preventDefault();
    pageTransition.classList.add("active");

    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: "auto", block: "start" });
      pageTransition.classList.remove("active");
    }, 150);
  });
});

/* ===========================
   COPY EMAIL TO CLIPBOARD
=========================== */
const copyEmailBtn = document.getElementById("copy-email-btn");

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const email = "sasanga.h.ranasinghe@gmail.com";
    const icon = copyEmailBtn.querySelector("i");

    navigator.clipboard
      .writeText(email)
      .then(() => {
        copyEmailBtn.classList.add("copied");
        icon.className = "fa-solid fa-check";
        setTimeout(() => {
          copyEmailBtn.classList.remove("copied");
          icon.className = "fa-regular fa-copy";
        }, 2000);
      })
      .catch(() => {});
  });
}

/* ===========================
   MOBILE MENU
=========================== */
const menuIcon = document.getElementById("menu-icon");
const navbar = document.getElementById("navbar");

menuIcon.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

navbar.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navbar.classList.remove("active"));
});

/* ===========================
   TYPING ANIMATION
=========================== */
const phrases = [
  "ICT Undergraduate",
  "Aspiring QA Engineer",

  "QA & Software Testing",
  "UI/UX Designer",
  "Graphic Designer",
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
const typingEl = document.getElementById("typing-text");

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typingEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 90);
}

type();

/* ===========================
   LIGHTBOX
=========================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");

function closeLightbox() {
  lightbox.classList.remove("active", "gallery");
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

/* ===========================
   CERTIFICATE IMAGES (LIGHTBOX)
=========================== */
const certImages = document.querySelectorAll(".cert-image");

certImages.forEach((item) => {
  item.addEventListener("click", () => {
    const src = item.querySelector("img").src;
    lightboxImg.src = src;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

/* ===========================
   PROJECT IMAGE GALLERY
=========================== */
const galleryBtn = document.getElementById("agri-gallery-btn");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
let galleryImages = [];
let galleryIndex = 0;

function showGalleryImage() {
  lightboxImg.src = galleryImages[galleryIndex];
}

function stepGallery(dir) {
  galleryIndex =
    (galleryIndex + dir + galleryImages.length) % galleryImages.length;
  showGalleryImage();
}

const subsidyMQ = window.matchMedia("(max-width: 850px)");
let subsidyList = [];
let subsidyOpen = false;

function renderSubsidyGallery() {
  if (!subsidyOpen) return;

  if (subsidyMQ.matches) {
    // Phones and tablets: vertical scrolling list
    lightbox.classList.remove("active", "gallery");
    shotsStrip.innerHTML = "";
    subsidyList.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Subsidy system screen ${i + 1}`;
      img.loading = "lazy";
      shotsStrip.appendChild(img);
    });
    shotsStrip.scrollTop = 0;
    shotsModal.classList.add("active", "vertical");
  } else {
    // Desktop: lightbox with arrows
    shotsModal.classList.remove("active", "vertical");
    shotsStrip.innerHTML = "";
    galleryImages = subsidyList;
    galleryIndex = 0;
    showGalleryImage();
    lightbox.classList.add("active", "gallery");
  }
  document.body.style.overflow = "hidden";
}

if (galleryBtn) {
  galleryBtn.addEventListener("click", () => {
    subsidyList = galleryBtn.dataset.images.split(",").map((s) => s.trim());
    subsidyOpen = true;
    renderSubsidyGallery();
  });
}

// Switch modes live while the window is being resized
subsidyMQ.addEventListener("change", renderSubsidyGallery);

lightboxPrev.addEventListener("click", () => stepGallery(-1));
lightboxNext.addEventListener("click", () => stepGallery(1));
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("gallery")) return;
  if (e.key === "ArrowLeft") stepGallery(-1);
  if (e.key === "ArrowRight") stepGallery(1);
});
/* ===========================
   SCREENS VIEWER (mobile screenshots)
=========================== */
const shotsModal = document.getElementById("shots-modal");
const shotsStrip = document.getElementById("shots-strip");
const shotsClose = document.getElementById("shots-close");

function closeShots() {
  shotsModal.classList.remove("active", "vertical");
  shotsStrip.innerHTML = "";
  document.body.style.overflow = "";
}

const shotsMQ = window.matchMedia("(max-width: 850px)");

// Landscape (Subsidy) images scroll vertically on small screens
function applyShotsMode() {
  const isWide = shotsStrip.classList.contains("wide");
  shotsModal.classList.toggle("vertical", isWide && shotsMQ.matches);
  shotsStrip.scrollTop = 0;
  shotsStrip.scrollLeft = 0;
}

document.querySelectorAll(".shots-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    shotsStrip.innerHTML = "";
    shotsStrip.classList.toggle("wide", btn.hasAttribute("data-wide"));
    btn.dataset.shots.split(",").forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src.trim();
      img.alt = `Screen ${i + 1}`;
      img.loading = "lazy";
      shotsStrip.appendChild(img);
    });
    applyShotsMode();
    shotsModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

// Switch modes live while the window is being resized
shotsMQ.addEventListener("change", () => {
  if (shotsModal.classList.contains("active")) applyShotsMode();
});

shotsClose.addEventListener("click", closeShots);
shotsModal.addEventListener("click", (e) => {
  if (e.target === shotsModal) closeShots();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeShots();
});
/* ===========================
   CERTIFICATES — SEE MORE
=========================== */
const seeMoreBtn = document.getElementById("see-more-certs");
const extraCerts = document.querySelectorAll(".cert-extra");

const certificationsSection = document.getElementById("achievements");
const achievementsGrid = document.querySelector(".achievements-grid");

if (seeMoreBtn) {
  seeMoreBtn.addEventListener("click", () => {
    const expanded = seeMoreBtn.classList.toggle("active");
    extraCerts.forEach((card) => card.classList.toggle("hidden", !expanded));
    achievementsGrid.classList.toggle("expanded", expanded);
    seeMoreBtn.innerHTML = expanded
      ? 'See Less <i class="fa-solid fa-chevron-up"></i>'
      : 'See More <i class="fa-solid fa-chevron-down"></i>';

    if (expanded && extraCerts.length > 0) {
      extraCerts[0].scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (certificationsSection) {
      certificationsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

/* ===========================
   SCROLL — ACTIVE NAV
=========================== */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + 100;
  sections.forEach((section) => {
    if (
      scrollY >= section.offsetTop &&
      scrollY < section.offsetTop + section.offsetHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${section.id}`)
          link.classList.add("active");
      });
    }
  });
});

/* ===========================
   CUSTOM FORM VALIDATION
=========================== */
const contactFields = [
  "contact-name-field",
  "contact-email-field",
  "contact-subject-field",
  "contact-message-field",
];

const emailFormatPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const contactFieldMessages = {
  "contact-name-field": {
    empty: "Please enter your name.",
  },
  "contact-email-field": {
    empty: "Please enter your email.",
    invalid: "Please enter a valid email address.",
  },
  "contact-subject-field": {
    empty: "Please enter a subject.",
  },
  "contact-message-field": {
    empty: "Please enter your message.",
  },
};

contactFields.forEach((fieldId) => {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId.replace("-field", "-error"));
  if (!field || !error) return;

  field.addEventListener("input", () => {
    if (field.value.trim() !== "") {
      field.classList.remove("field-invalid");
      error.classList.remove("visible");
    }
  });
});

function validateContactField(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId.replace("-field", "-error"));
  if (!field || !error) return true;

  const messages = contactFieldMessages[fieldId] || {};
  const value = field.value.trim();
  let isValid = true;
  let message = "";

  if (value === "") {
    isValid = false;
    message = messages.empty || "This field is required.";
  } else if (
    fieldId === "contact-email-field" &&
    !emailFormatPattern.test(value)
  ) {
    isValid = false;
    message = messages.invalid || "Please enter a valid value.";
  }

  field.classList.toggle("field-invalid", !isValid);
  error.classList.toggle("visible", !isValid);
  if (!isValid) error.textContent = message;
  return isValid;
}

/* ===========================
   CONTACT FORM
=========================== */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const allValid = contactFields
      .map((fieldId) => validateContactField(fieldId))
      .every(Boolean);
    if (!allValid) return;

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.textContent = "Sending...";
    btn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        btn.textContent = "Message Sent! ✓";
        btn.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
        contactForm.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      btn.textContent = "Failed — Try Again";
      btn.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
    } finally {
      btn.disabled = false;
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = "";
      }, 3000);
    }
  });
}

/* ===========================
   PROJECTS SLIDER
=========================== */
const projectsTrack = document.getElementById("projects-grid");
const projectsPrev = document.getElementById("projects-prev");
const projectsNext = document.getElementById("projects-next");

if (projectsTrack && projectsPrev && projectsNext) {
  const projectCards = projectsTrack.querySelectorAll(".project-card");
  let projectIndex = 0;

  function updateProjectsSlider() {
    // Cards visible at once (3 / 2 / 1) is set in CSS via --per-view
    const perView =
      parseInt(
        getComputedStyle(projectsTrack).getPropertyValue("--per-view"),
        10,
      ) || 3;
    const maxIndex = Math.max(0, projectCards.length - perView);
    projectIndex = Math.min(projectIndex, maxIndex);

    const step =
      projectCards.length > 1
        ? projectCards[1].offsetLeft - projectCards[0].offsetLeft
        : 0;
    projectsTrack.style.transform = `translateX(${-projectIndex * step}px)`;

    // Arrows only appear when there are more projects than fit on screen
    const needsArrows = maxIndex > 0;
    projectsPrev.hidden = !needsArrows;
    projectsNext.hidden = !needsArrows;
    projectsPrev.disabled = projectIndex === 0;
    projectsNext.disabled = projectIndex === maxIndex;
  }

  projectsPrev.addEventListener("click", () => {
    projectIndex--;
    updateProjectsSlider();
  });
  projectsNext.addEventListener("click", () => {
    projectIndex++;
    updateProjectsSlider();
  });
  window.addEventListener("resize", updateProjectsSlider);
  updateProjectsSlider();
}

/* ===========================
   SCROLL REVEAL
=========================== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(
    ".skill-card, .project-card, .achievement-card, .timeline-item",
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });
