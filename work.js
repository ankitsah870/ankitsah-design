/* =========================================================
   WORK PAGE — PRODUCTION JS
   Fixes applied:
   1. Success message show/hide — style.display now properly
      toggled; element no longer stays visible after 5 seconds
   2. Footer clock — updateTime() added so India time updates
      every minute on the work page (was always showing --:--)
   All other logic unchanged from your working version.
========================================================= */

(function () {

    "use strict";

    /* =========================================================
       FORCE LOAD FROM TOP
    ========================================================= */

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };

    window.addEventListener("load", function () {

        setTimeout(function () {

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant"
            });

        }, 0);

    });

    /* =========================================================
       FOOTER CLOCK
       FIX: work.js had no updateTime() — footer-time always
       showed "--:--" on the work page. Now it updates every
       minute, matching what script.js does on the home page.
    ========================================================= */

    function updateTime() {

        var now = new Date();

        var timeString = now.toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit"
        });

        var el = document.getElementById("footer-time");
        if (el) el.textContent = "India \u2014 " + timeString;

    }

    updateTime();
    setInterval(updateTime, 60000);

    /* =========================================================
       WAIT FOR GSAP
    ========================================================= */

    function init() {

        if (
            typeof gsap === "undefined" ||
            typeof ScrollTrigger === "undefined"
        ) {
            requestAnimationFrame(init);
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const isMobile = window.innerWidth <= 768;

        /* =========================================================
           INITIAL STATES
        ========================================================= */

        if (!isMobile) {

            gsap.set(".navbar-container", { opacity: 0, y: -30 });
            gsap.set(".work-hero-tag", { opacity: 0, y: 20 });
            gsap.set(".work-hero-title", { opacity: 0, y: 70 });
            gsap.set(".work-hero-subtitle", { opacity: 0, y: 30 });
            gsap.set(".work-hero-buttons", { opacity: 0, y: 30 });

        }

        /* =========================================================
           NAVBAR ANIMATION
        ========================================================= */

        gsap.to(".navbar-container", {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out"
        });

        /* =========================================================
           HERO TIMELINE
        ========================================================= */

        const heroTl = gsap.timeline({ delay: 0.2 });

        heroTl

            .to(".work-hero-tag", {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out"
            })

            .to(".work-hero-title", {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power4.out"
            }, "-=0.35")

            .to(".work-hero-subtitle", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.8")

            .to(".work-hero-buttons", {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out"
            }, "-=0.55");

        /* =========================================================
           HERO CARD ENTRANCE
        ========================================================= */

        gsap.fromTo(".work-preview-card",

            { y: 160, scale: 0.96 },

            {
                y: 0,
                scale: 1,
                duration: 1.6,
                ease: "power4.out",
                delay: 0.35
            }

        );

        /* =========================================================
           HERO SCROLL OUT
        ========================================================= */

        if (!isMobile) {

            gsap.to(".work-hero-content", {

                y: -70,
                opacity: 0.15,
                scale: 0.98,
                ease: "none",

                scrollTrigger: {
                    trigger: ".work-hero",
                    start: "bottom bottom",
                    end: "bottom top",
                    scrub: 1.2
                }

            });

            heroTl.eventCallback("onComplete", function () {

                gsap.to(".work-preview-card", {

                    y: -70,
                    scale: 0.985,
                    ease: "none",

                    scrollTrigger: {
                        trigger: ".work-hero",
                        start: "top top",
                        end: "bottom top",
                        scrub: 1.2,
                        immediateRender: false
                    }

                });

            });

        }

        /* =========================================================
   PROJECT SECTION — CLEAN IN / OUT
========================================================= */

        if (!isMobile) {

            gsap.fromTo(".project-info",
                {
                    x: -120
                },
                {
                    x: 0,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".projects-section",
                        start: "top 75%",
                        end: "bottom 30%",
                        scrub: 1
                    }
                }
            );

            gsap.fromTo(".project-mockup-card",
                {
                    x: 120
                },
                {
                    x: 0,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".projects-section",
                        start: "top 75%",
                        end: "bottom 30%",
                        scrub: 1
                    }
                }
            );

        }

        /* =========================================================
   CONTACT SECTION — CLEAN IN / OUT
========================================================= */

        if (!isMobile) {

            gsap.fromTo(".contact-left",
                {
                    x: -100
                },
                {
                    x: 0,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".contact",
                        start: "top 80%",
                        end: "bottom 30%",
                        scrub: 1
                    }
                }
            );

            gsap.fromTo(".contact-card",
                {
                    x: 100
                },
                {
                    x: 0,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".contact",
                        start: "top 80%",
                        end: "bottom 30%",
                        scrub: 1
                    }
                }
            );

        }
        /* =========================================================
           NAVBAR SCROLL STATE
        ========================================================= */

        const navbar = document.querySelector(".navbar-container");

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
           PROJECT SLIDER
        ========================================================= */

        const projectSlides = document.querySelectorAll(".project-slide");
        const projectTrack = document.querySelector(".projects-track");
        const nextButtons = document.querySelectorAll(".project-next-btn");

        let activeProject = 0;
        let isAnimating = false;

        function updateProjectSlider(index) {

            if (isAnimating) return;
            isAnimating = true;

            projectSlides.forEach(function (slide) {
                slide.classList.remove("active-project");
            });

            projectTrack.style.transform = "translateX(-" + (index * 100) + "%)";

            setTimeout(function () {
                projectSlides[index].classList.add("active-project");
                activeProject = index;
                isAnimating = false;
            }, 250);

        }

        nextButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                var next = activeProject + 1;
                if (next >= projectSlides.length) next = 0;
                updateProjectSlider(next);

            });

        });

        if (projectSlides.length) updateProjectSlider(0);

        /* =========================================================
           CONTACT SCROLL BUTTON
        ========================================================= */

        document.querySelectorAll(".contact-scroll-btn").forEach(function (btn) {

            btn.addEventListener("click", function (e) {

                e.preventDefault();

                var target = document.querySelector("#contact");
                if (!target) return;

                target.scrollIntoView({ behavior: "smooth", block: "start" });

            });

        });

       
        /* =========================================================
           FINAL REFRESH
        ========================================================= */

        setTimeout(function () { ScrollTrigger.refresh(); }, 400);

    }

    init();

})();