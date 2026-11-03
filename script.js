const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const themeToggle = document.getElementById("themeToggle");
const scrollProgress = document.getElementById("scrollProgress");
const navLinks = document.querySelectorAll(".sidebar-menu a");
const sections = document.querySelectorAll("main section[id]");

if (scrollProgress) {
  let progressFrame = 0;

  const updateScrollProgress = function () {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0
      ? Math.min(window.scrollY / scrollableHeight, 1)
      : 0;
    const percentage = Math.round(progress * 100);

    scrollProgress.style.transform = "scaleX(" + progress + ")";
    scrollProgress.setAttribute("aria-valuenow", String(percentage));
    progressFrame = 0;
  };

  const requestScrollProgressUpdate = function () {
    if (!progressFrame) {
      progressFrame = window.requestAnimationFrame(updateScrollProgress);
    }
  };

  window.addEventListener("scroll", requestScrollProgressUpdate, { passive: true });
  window.addEventListener("resize", requestScrollProgressUpdate);
  updateScrollProgress();
}

const revealItems = document.querySelectorAll(
  ".hero, .hero-text > *, .hero-photo-inner, .hero-tech-decoration, " +
  ".about-heading, .profile-photo-wrap, .biodata-card, .biodata-row, " +
  ".profile-info-card, .section > h2, .photo-card, .timeline-item, .social, .footer"
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        const section = entry.target.closest(".section");
        if (section) {
          section.classList.add("is-visible");
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -36px 0px"
  });

  revealItems.forEach(function (item) {
    item.classList.add("reveal-item");
    const siblingIndex = Array.prototype.indexOf.call(item.parentElement.children, item);
    item.style.setProperty("--reveal-delay", Math.min(siblingIndex, 4) * 70 + "ms");
    const clearRevealDelay = function (event) {
      if (event.propertyName === "opacity" && item.classList.contains("is-visible")) {
        item.style.removeProperty("--reveal-delay");
        item.removeEventListener("transitionend", clearRevealDelay);
      }
    };
    item.addEventListener("transitionend", clearRevealDelay);
    revealObserver.observe(item);
  });
  document.body.classList.add("has-reveal");
}

const setTheme = function (theme) {
  const isDark = theme === "dark";
  document.body.dataset.theme = isDark ? "dark" : "light";

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"
    );

    const icon = themeToggle.querySelector(".theme-toggle-icon");
    const label = themeToggle.querySelector(".theme-toggle-label");
    if (icon) {
      icon.textContent = isDark ? "☀" : "☾";
    }
    if (label) {
      label.textContent = isDark ? "Mode terang" : "Mode gelap";
    }
  }
};

if (themeToggle) {
  const savedTheme = localStorage.getItem("portfolio-theme");
  setTheme(savedTheme === "dark" ? "dark" : "light");

  themeToggle.addEventListener("click", function () {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });
}

if (menuButton && sidebar) {
  menuButton.addEventListener("click", function () {
    sidebar.classList.toggle("open");
  });
}

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    if (sidebar) {
      sidebar.classList.remove("open");
    }
  });
});

const setActiveLink = function (id) {
  navLinks.forEach(function (link) {
    const isActive = link.getAttribute("href") === "#" + id;
    link.classList.toggle("active", isActive);
  });
};

if (sections.length) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, {
    rootMargin: "-25% 0px -55% 0px",
    threshold: 0.1
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
