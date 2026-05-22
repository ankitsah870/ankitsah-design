if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.scrollTo({ top: 0, left: 0, behavior: "instant" });

document.addEventListener("DOMContentLoaded", function () {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}, { once: true });

window.addEventListener("beforeunload", function () {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
});

/* =========================================================
   SUCCESS MESSAGE
========================================================= */

function showSuccessMessage(el) {
    if (!el) return;

    if (el._hideTimer) { clearTimeout(el._hideTimer); el._hideTimer = null; }
    if (el._hideTransTimer) { clearTimeout(el._hideTransTimer); el._hideTransTimer = null; }

    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.maxHeight = "0px";
    el.style.overflow = "hidden";
    el.style.marginTop = "0px";
    el.style.paddingTop = "0px";
    el.style.paddingBottom = "0px";
    el.style.display = "block";
    el.style.visibility = "visible";

    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            var EASE = "cubic-bezier(0.22,1,0.36,1)";
            el.style.transition =
                "opacity 0.35s " + EASE + ", " +
                "max-height 0.4s " + EASE + ", " +
                "margin-top 0.35s " + EASE + ", " +
                "padding-top 0.35s " + EASE + ", " +
                "padding-bottom 0.35s " + EASE;

            el.style.opacity = "1";
            el.style.maxHeight = "120px";
            el.style.marginTop = "16px";
            el.style.paddingTop = "12px";
            el.style.paddingBottom = "12px";

            el._hideTimer = setTimeout(function () {
                hideSuccessMessage(el);
            }, 5000);
        });
    });
}

function hideSuccessMessage(el) {
    if (!el) return;

    var EASE = "cubic-bezier(0.22,1,0.36,1)";
    el.style.transition =
        "opacity 0.4s " + EASE + ", " +
        "max-height 0.45s " + EASE + " 0.05s, " +
        "margin-top 0.4s " + EASE + " 0.05s, " +
        "padding-top 0.4s " + EASE + " 0.05s, " +
        "padding-bottom 0.4s " + EASE + " 0.05s";

    el.style.opacity = "0";
    el.style.maxHeight = "0px";
    el.style.marginTop = "0px";
    el.style.paddingTop = "0px";
    el.style.paddingBottom = "0px";

    el._hideTransTimer = setTimeout(function () {
        el.style.transition = "";
        el.style.display = "none";
        el.style.visibility = "";
        el.style.maxHeight = "";
        el.style.marginTop = "";
        el.style.paddingTop = "";
        el.style.paddingBottom = "";
        el.style.opacity = "";
        el.style.overflow = "";
        el._hideTimer = null;
        el._hideTransTimer = null;
    }, 500);
}

/* =========================================================
   INIT — wait for GSAP to be available
========================================================= */

function init() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        requestAnimationFrame(init);
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var isMobile = window.innerWidth <= 768;

    /* =========================================================
       DESKTOP: Pre-hide ALL hero elements via gsap.set()
    ========================================================= */
    if (!isMobile) {
        gsap.set(".navbar-container", { opacity: 0, y: -30 });
        gsap.set(".hero-text h1", { opacity: 0, y: 80 });
        gsap.set(".hero-text p", { opacity: 0, y: 40 });
        gsap.set(".hero-buttons", { opacity: 0, y: 30 });
        gsap.set(".scroll", { opacity: 0, y: 20 });
        gsap.set(".hero-note", { opacity: 0, y: 20 });
    }

    /* =========================================================
       MOBILE — IO UTILITY
    ========================================================= */
    function observeEntrance(selector, options) {
        var defaults = {
            fromY: 30,
            fromX: 0,
            opacity: 0,
            duration: 0.65,
            ease: "cubic-bezier(0.22,1,0.36,1)",
            staggerDelay: 0,
            threshold: 0,
            rootMargin: "0px 0px -30px 0px"
        };
        var cfg = Object.assign({}, defaults, options);

        var elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        elements.forEach(function (el) {
            el.style.opacity = String(cfg.opacity);
            el.style.transform = "translateY(" + cfg.fromY + "px) translateX(" + cfg.fromX + "px)";
            el.style.transition = "none";
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                var el = entry.target;
                var index = Array.from(elements).indexOf(el);
                var delay = index * cfg.staggerDelay;

                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        el.style.transition =
                            "opacity " + cfg.duration + "s " + cfg.ease + " " + delay + "ms, " +
                            "transform " + cfg.duration + "s " + cfg.ease + " " + delay + "ms";
                        el.style.opacity = "1";
                        el.style.transform = "translateY(0) translateX(0)";

                        var totalMs = delay + cfg.duration * 1000 + 50;
                        setTimeout(function () {
                            el.style.transition = "";
                        }, totalMs);
                    });
                });

                observer.unobserve(el);
            });
        }, {
            threshold: cfg.threshold,
            rootMargin: cfg.rootMargin
        });

        elements.forEach(function (el) { observer.observe(el); });
    }

    /* =========================================================
       PAGE LOAD — NAVBAR
    ========================================================= */

    gsap.to(".navbar-container", {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.1
    });

    /* =========================================================
       PAGE LOAD — HERO
    ========================================================= */

    var heroTl = gsap.timeline({ delay: 0.3 });

    if (!isMobile) {
        heroTl
            .to(".hero-text h1", {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power4.out"
            })
            .to(".hero-text p", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.7")
            .to(".hero-buttons", {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power2.out"
            }, "-=0.5")
            .to(".scroll", {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power2.out"
            }, "-=0.25")
            .to(".hero-note", {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power2.out"
            }, "-=0.55");
    } else {
        heroTl
            .from(".hero-text h1", {
                y: 80,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out"
            })
            .from(".hero-text p", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.7")
            .from(".hero-buttons", {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out"
            }, "-=0.5")
            .from(".hero-bottom-container", {
                y: 20,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out"
            }, "-=0.4");
    }

    /* =========================================================
       HERO SCROLL OUT — desktop only
    ========================================================= */

    if (!isMobile) {
        gsap.fromTo(".hero-text",
            { y: 0, opacity: 1, scale: 1 },
            {
                y: -80,
                opacity: 0.15,
                scale: 0.98,
                scrollTrigger: {
                    trigger: ".hero",
                    start: "bottom bottom",
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            }
        );

        heroTl.eventCallback("onComplete", function () {
            gsap.fromTo(".scroll",
                { y: 0, opacity: 1 },
                {
                    y: -40,
                    opacity: 0,
                    scrollTrigger: {
                        trigger: ".hero",
                        start: "bottom bottom",
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                }
            );

            gsap.fromTo(".hero-note",
                { y: 0, opacity: 1 },
                {
                    y: -40,
                    opacity: 0,
                    scrollTrigger: {
                        trigger: ".hero",
                        start: "bottom bottom",
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                }
            );

            ScrollTrigger.refresh();
        });
    }

    /* =========================================================
       NAVBAR SCROLL CLASS
    ========================================================= */

    var navbar = document.querySelector(".navbar-container");

    if (navbar) {
        function handleNavbarScroll() {
            if (window.scrollY > 60) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }
        window.addEventListener("scroll", handleNavbarScroll, { passive: true });
        handleNavbarScroll();
    }

    /* =========================================================
       CRED SECTION
    ========================================================= */

    if (isMobile) {

        observeEntrance(".cred-left h2", {
            fromX: -40,
            fromY: 0,
            duration: 0.7
        });

        observeEntrance(".cred-card, .cred-card-special", {
            fromY: 40,
            duration: 0.65,
            staggerDelay: 100,
            rootMargin: "0px 0px -10px 0px"
        });

    } else {

        gsap.fromTo(".cred-left h2",
            { x: -60, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: ".cred",
                    start: "top 80%",
                    end: "top 55%",
                    scrub: 1
                }
            }
        );

        (function initCredCards() {
            var cards = document.querySelectorAll(".cred-card, .cred-card-special");

            cards.forEach(function (card) {
                card.style.opacity = "0";
                card.style.transform = "translateY(40px)";
                card.style.transition = "none";
            });

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;

                    var card = entry.target;
                    var index = Array.from(cards).indexOf(card);
                    var delay = index * 0.12;
                    var duration = 650;

                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            card.style.transition =
                                "opacity 0.65s cubic-bezier(0.22,1,0.36,1) " + delay + "s, " +
                                "transform 0.65s cubic-bezier(0.22,1,0.36,1) " + delay + "s";
                            card.style.opacity = "1";
                            card.style.transform = "translateY(0)";

                            setTimeout(function () {
                                card.style.transition = "";
                                card.style.willChange = "";
                            }, (delay * 1000) + duration + 50);
                        });
                    });

                    observer.unobserve(card);
                });
            }, {
                threshold: 0.1,
                rootMargin: "0px 0px -20px 0px"
            });

            cards.forEach(function (card) { observer.observe(card); });
        })();

    }

    /* =========================================================
       WORK SECTION
    ========================================================= */

    if (isMobile) {

        observeEntrance(".work-header", { fromY: 30, duration: 0.6 });
        observeEntrance(".work-main", { fromY: 40, duration: 0.55, rootMargin: "0px 0px -10px 0px" });

    } else {

        gsap.fromTo(".work-header",
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: ".work",
                    start: "top 85%",
                    end: "top 60%",
                    scrub: 1
                }
            }
        );

        gsap.fromTo(".work-main",
            { y: 100, opacity: 0, scale: 0.96 },
            {
                y: -40,
                opacity: 1,
                scale: 1,
                scrollTrigger: {
                    trigger: ".work-main",
                    start: "top 90%",
                    end: "top 55%",
                    scrub: 1
                }
            }
        );

    }

    /* =========================================================
       SOLVE SECTION
    ========================================================= */

    if (isMobile) {

        observeEntrance(".solve-left", { fromX: -40, fromY: 0, duration: 0.65 });
        observeEntrance(".solve-cards", { fromY: 30, duration: 0.6, rootMargin: "0px 0px -10px 0px" });

    } else {

        gsap.fromTo(".solve-left",
            { x: -60, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: ".solve",
                    start: "top 80%",
                    end: "top 55%",
                    scrub: 1
                }
            }
        );

        gsap.utils.toArray(".solve-card").forEach(function (card) {
            gsap.fromTo(card,
                { x: -100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 92%",
                        end: "top 60%",
                        scrub: 1
                    }
                }
            );
        });

    }

    /* =========================================================
       THINK SECTION
    ========================================================= */

    if (isMobile) {

        observeEntrance(".think-left", { fromY: 30, duration: 0.65 });
        observeEntrance(".think-right > *", {
            fromY: 20,
            duration: 0.6,
            staggerDelay: 80,
            rootMargin: "0px 0px -10px 0px"
        });
        observeEntrance(".think-cards", { fromY: 20, duration: 0.55, rootMargin: "0px 0px -5px 0px" });
        observeEntrance(".tool-list span", {
            fromY: 14,
            duration: 0.5,
            staggerDelay: 40,
            rootMargin: "0px 0px -5px 0px"
        });

    } else {

        gsap.fromTo(".think-left",
            { x: -80, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: ".think",
                    start: "top 80%",
                    end: "top 55%",
                    scrub: 1
                }
            }
        );

        gsap.fromTo(".think-right > *",
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                scrollTrigger: {
                    trigger: ".think-right",
                    start: "top 85%",
                    end: "top 55%",
                    scrub: 1
                }
            }
        );

        gsap.utils.toArray(".think-card").forEach(function (card) {
            gsap.fromTo(card,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 92%",
                        end: "top 60%",
                        scrub: 1
                    }
                }
            );
        });

        gsap.fromTo(".tool-list span",
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                scrollTrigger: {
                    trigger: ".tool-list",
                    start: "top 90%",
                    end: "top 65%",
                    scrub: 1
                }
            }
        );

    }

    /*
      BUG FIX — think-image parallax removed.
      The original gsap.fromTo(".think-image", { y: -30 }, { y: 30 })
      ScrollTrigger animated .think-image independently of its clipping
      parent (.think-left has overflow:hidden + border-radius:28px).
      As the user scrolled, the upward y-shift exposed the parent's
      #050505 background as a blank black gap above the gradient.

      Fix: parallax block deleted entirely. The card now scrolls with
      normal document flow — no independent child transform — so the
      overflow:hidden clip works correctly at all scroll positions.

      The thinkImageEl display/marginTop reset below is also removed
      since it was only needed as a workaround for that parallax.
    */

    /* =========================================================
       CONTACT SECTION
    ========================================================= */

    if (!isMobile) {

        gsap.fromTo(".contact-left > *",
            { x: -60, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                stagger: 0.12,
                scrollTrigger: {
                    trigger: ".contact",
                    start: "top 80%",
                    end: "top 60%",
                    scrub: 1
                }
            }
        );

        gsap.fromTo(".contact-card",
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: ".contact-card",
                    start: "top 90%",
                    end: "top 60%",
                    scrub: 1
                }
            }
        );

    }

    /* =========================================================
       FOOTER — "Get in Touch"
    ========================================================= */

    if (!isMobile) {

        gsap.to(".footer-hero h2", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".footer-hero",
                start: "top 90%",
                toggleActions: "play none none none"
            }
        });

    } else {

        var footerH2 = document.querySelector(".footer-hero h2");
        if (footerH2) {
            footerH2.style.opacity = "0";
            footerH2.style.transform = "translateY(30px)";
            footerH2.style.transition = "none";

            var footerObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            footerH2.style.transition =
                                "opacity 0.65s cubic-bezier(0.22,1,0.36,1), " +
                                "transform 0.65s cubic-bezier(0.22,1,0.36,1)";
                            footerH2.style.opacity = "1";
                            footerH2.style.transform = "translateY(0)";
                            setTimeout(function () {
                                footerH2.style.willChange = "";
                            }, 700);
                        });
                    });
                    footerObserver.unobserve(footerH2);
                });
            }, {
                threshold: 0,
                rootMargin: "0px 0px -20px 0px"
            });

            footerObserver.observe(footerH2);
        }

    }

    /* =========================================================
       HOVER EFFECTS — desktop only
    ========================================================= */

    if (!isMobile) {
        document.querySelectorAll(
            ".cred-card, .cred-card-special, .solve-card, .think-card"
        ).forEach(function (card) {

            card.addEventListener("mouseenter", function () {
                gsap.to(card, {
                    y: -8,
                    scale: 1.02,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });

            card.addEventListener("mouseleave", function () {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.inOut",
                    overwrite: "auto"
                });
            });

        });

        /* =========================================================
           MAGNETIC BUTTONS — desktop only
        ========================================================= */

        document.querySelectorAll(
            ".btn-primary, .btn-outline, .contact-btn"
        ).forEach(function (btn) {

            btn.addEventListener("mousemove", function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.12,
                    y: y * 0.12,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            btn.addEventListener("mouseleave", function () {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

        });
    }

    /* =========================================================
       FOOTER LIVE TIME
    ========================================================= */

    function updateTime() {
        var now = new Date();
        var time = now.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit"
        });
        var el = document.getElementById("footer-time");
        if (el) {
            el.textContent = "India \u2014 " + time;
        }
    }

    updateTime();
    setInterval(updateTime, 1000);

    /* =========================================================
       CUSTOM DROPDOWNS
    ========================================================= */

    function closeAll(current) {
        document.querySelectorAll(".dropdown").forEach(function (d) {
            if (d !== current) {
                d.classList.remove("open");
                var t = d.querySelector(".dropdown-trigger");
                if (t) t.setAttribute("aria-expanded", "false");
            }
        });
    }

    document.querySelectorAll(".dropdown").forEach(function (dropdown) {

        var trigger = dropdown.querySelector(".dropdown-trigger");
        var items = dropdown.querySelectorAll(".dropdown-item");
        var valueEl = dropdown.querySelector(".dropdown-value");
        var name = dropdown.dataset.name;

        var formGroup = dropdown.closest(".form-group");
        var input = formGroup
            ? formGroup.querySelector('input[name="' + name + '"]')
            : null;

        if (!input) {
            console.warn('[Dropdown] Hidden input[name="' + name + '"] not found inside .form-group.');
        }

        trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            var isOpen = dropdown.classList.contains("open");
            closeAll(dropdown);
            if (!isOpen) {
                dropdown.classList.add("open");
                trigger.setAttribute("aria-expanded", "true");
            } else {
                dropdown.classList.remove("open");
                trigger.setAttribute("aria-expanded", "false");
            }
        });

        items.forEach(function (item) {
            item.addEventListener("click", function (e) {
                e.stopPropagation();

                valueEl.textContent = item.textContent.trim();

                if (input) {
                    input.value = item.dataset.value || item.textContent.trim();
                }

                items.forEach(function (i) { i.classList.remove("active"); });
                item.classList.add("active");

                dropdown.classList.remove("open");
                trigger.setAttribute("aria-expanded", "false");
                trigger.style.borderColor = "";
            });
        });

    });

    document.addEventListener("click", function () {
        closeAll(null);
    });

    /* =========================================================
       CONTACT FORM
    ========================================================= */

    var form = document.getElementById("contact-form");
    var successMsg = document.getElementById("form-success");

    if (form) {

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            var nameField = form.querySelector('input[name="name"]');
            var emailField = form.querySelector('input[name="email"]');
            var scopeInput = form.querySelector('input[name="scope"]');
            var budgetInput = form.querySelector('input[name="budget"]');
            var messageField = form.querySelector('textarea[name="message"]');

            [nameField, emailField, messageField].forEach(function (f) {
                if (f) f.style.borderColor = "";
            });

            var scopeTrigger = form.querySelector('.dropdown[data-name="scope"] .dropdown-trigger');
            var budgetTrigger = form.querySelector('.dropdown[data-name="budget"] .dropdown-trigger');

            if (scopeTrigger) scopeTrigger.style.borderColor = "";
            if (budgetTrigger) budgetTrigger.style.borderColor = "";

            var valid = true;

            if (!nameField || !nameField.value.trim()) {
                if (nameField) nameField.style.borderColor = "#e05252";
                valid = false;
            }

            if (!emailField || !emailField.value.trim()) {
                if (emailField) emailField.style.borderColor = "#e05252";
                valid = false;
            }

            if (!scopeInput || !scopeInput.value.trim()) {
                if (scopeTrigger) scopeTrigger.style.borderColor = "#e05252";
                valid = false;
            }

            if (!budgetInput || !budgetInput.value.trim()) {
                if (budgetTrigger) budgetTrigger.style.borderColor = "#e05252";
                valid = false;
            }

            if (!messageField || !messageField.value.trim()) {
                if (messageField) messageField.style.borderColor = "#e05252";
                valid = false;
            }

            if (!valid) return;

            var submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "SENDING\u2026";
            }

            try {

                var data = new FormData(form);
                var response = await fetch(form.action, {
                    method: "POST",
                    body: data,
                    headers: { Accept: "application/json" }
                });

                if (response.ok) {

                    form.reset();

                    document.querySelectorAll(".dropdown").forEach(function (dropdown) {
                        var valEl = dropdown.querySelector(".dropdown-value");
                        var dName = dropdown.dataset.name;
                        var dGrp = dropdown.closest(".form-group");
                        var dInp = dGrp ? dGrp.querySelector('input[name="' + dName + '"]') : null;

                        if (valEl) {
                            valEl.textContent = dName === "budget" ? "Estimated budget" : "Select scope";
                        }
                        if (dInp) dInp.value = "";
                        dropdown.querySelectorAll(".dropdown-item").forEach(function (i) {
                            i.classList.remove("active");
                        });
                    });

                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = "CONTACT ME";
                    }

                    if (successMsg) {
                        successMsg.textContent = "\u2713 Message sent! I'll reply within 24 hours.";
                        successMsg.style.color = "";
                    }

                    showSuccessMessage(successMsg);

                    gsap.fromTo(".contact-card",
                        { borderColor: "rgba(251,201,129,0.5)" },
                        {
                            borderColor: "rgba(26,26,26,1)",
                            duration: 1.4,
                            ease: "power2.out"
                        }
                    );

                } else {

                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = "CONTACT ME";
                    }
                    if (successMsg) {
                        successMsg.textContent = "\u2717 Something went wrong. Please try again.";
                        successMsg.style.color = "#e05252";
                        showSuccessMessage(successMsg);
                    }

                }

            } catch (err) {

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "CONTACT ME";
                }
                if (successMsg) {
                    successMsg.textContent = "\u2717 Network error. Please check your connection.";
                    successMsg.style.color = "#e05252";
                    showSuccessMessage(successMsg);
                }

            }

        });

    }

} // end init()

init();
/* =========================================================
   MOBILE SIDEBAR
========================================================= */

const mobileMenuBtn = document.querySelector(".mobile-menu-toggle");

const mobileSidebar = document.querySelector(".mobile-sidebar");

const mobileOverlay = document.querySelector(".mobile-overlay");

const mobileClose = document.querySelector(".mobile-close");

function openMobileMenu() {

    mobileSidebar.classList.add("active");

    const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

    mobileLinks.forEach((link, index) => {

        setTimeout(() => {

            link.style.opacity = "1";
            link.style.transform = "translateX(0)";

        }, 120 + (index * 80));

    });

    setTimeout(() => {

        const contactBtn = document.querySelector(".mobile-contact-btn");

        if (contactBtn) {

            contactBtn.style.opacity = "1";
            contactBtn.style.transform = "translateY(0)";
        }

    }, 320);

    mobileOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}

function closeMobileMenu() {

    mobileSidebar.classList.remove("active");

    const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

    mobileLinks.forEach((link) => {

        link.style.opacity = "0";
        link.style.transform = "translateX(18px)";
    });

    const contactBtn = document.querySelector(".mobile-contact-btn");

    if (contactBtn) {

        contactBtn.style.opacity = "0";
        contactBtn.style.transform = "translateY(20px)";
    }

    mobileOverlay.classList.remove("active");

    document.body.style.overflow = "";
}

if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener("click", openMobileMenu);
}

if (mobileClose) {

    mobileClose.addEventListener("click", closeMobileMenu);
}

if (mobileOverlay) {

    mobileOverlay.addEventListener("click", closeMobileMenu);
}
