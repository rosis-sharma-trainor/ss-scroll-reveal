import "@/styles/components/scroll-reveal.css";
import { animate, inView, stagger } from "motion";

const animateSlideReveal = (el) => {
  animate(el, { x: [0, "100%"] }, { duration: 1.2, delay: 0.2, easing: "ease" });
};

const variants = {
  "fade-up": {
    opacity: 1,
    translate: "0px 0px",
  },
  "slide-up": {
    transform: "translate3d(0, 0, 0)",
  },
  "fade-up-left": {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
  },
  "fade-down": {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
  },
  "fade-left": {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
  },
  "fade-left-slow": {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
  },
  "fade-right": {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
  },
  "slide-right": {
    transform: "translate3d(0, 0, 0)",
  },
  "fade-in": {
    opacity: 1,
  },
  "scale-in": {
    opacity: 1,
    transform: ["scale(0)", "scale(1)"],
  },
  "scale-out": {
    transform: ["scale(0)", "scale(1)"],
  },
};

const reveal = (group) => {
  if (group.dataset.srGroup === "sequence") {
    const sequence = [];

    group.querySelectorAll(`[data-sr]`).forEach((el) => {
      const variant = variants[el.dataset.sr];

      if (variant && el.style.display !== "none") {
        sequence.push([el, variant, { duration: 0.8, at: "-0.4" }]);
      }
    });

    inView(
      group,
      () => {
        animate(sequence).then(() => {
          group.setAttribute("data-sr-done", true);
        });
      },
      {
        margin: "0px 0px -25% 0px",
      },
    );
  } else {
    for (const [key, opts] of Object.entries(variants)) {
      const els = Array.from(group.querySelectorAll(`[data-sr="${key}"]:not([data-sr-done])`)).filter((el) => {
        return (
          window.getComputedStyle(el).display !== "none" && el.offsetHeight !== 0 && !el.closest('[aria-hidden="true"]')
        );
      });

      let duration = 0.7;

      if (key === "fade-in" || key === "fade-left-slow" || key === "scale-in") {
        duration = 1.1;
      }

      if (els.length) {
        els.forEach((el, index) => {
          const checklists = el.querySelectorAll("[class*=as-checklist], ul.as-list");

          if (checklists.length) {
            let children = [];

            Array.from(el.children).forEach((child) => {
              // If the child is a checklist or list, animate each list item individually
              if (
                [
                  "as-list",
                  "as-checklist-red",
                  "as-checklist-blue",
                  "as-checklist-green",
                ].some((className) => child.classList.contains(className))
              ) {
                const lis = Array.from(child.querySelectorAll("li"));

                children = [...children, ...lis];
              } else {
                children.push(child);
              }
            });

            if (!el.querySelector(".ignore-sr")) {
              children.map((child) => child.setAttribute("data-sr", "fade-up"));

              el.removeAttribute("data-sr");
              els.splice(index, 1, ...children);
            }
          }
        });

        let staggerAmount = 0.1;

        if (els.length > 15) {
          staggerAmount = 0.03;
        }

        const doAnimation = () => {
          animate(els, opts, {
            duration,
            delay: stagger(staggerAmount),
          }).then(() => {
            els.forEach((el) => {
              el.setAttribute("data-sr-done", true);
            });

            group.setAttribute("data-sr-done", true);
          });
        };

        if (group.dataset.srGroup === "onload") {
          doAnimation();
        } else {
          inView(group, doAnimation, {
            margin: "0px 0px -25% 0px",
          });
        }
      }
    }
  }
};

const handleMutations = (group, mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      reveal(group);
    }

    if (mutation.type === "attributes" && mutation.attributeName === "aria-hidden") {
      reveal(group);
    }
  }
};

export default {
  init: () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    document.querySelectorAll("[data-slide-reveal]").forEach((el) => {
      const observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          animateSlideReveal(el);

          observer.disconnect();
        }
      });

      observer.observe(el);
    });

    document.querySelectorAll("[data-sr-group]").forEach((group) => {
      if (group.closest("[data-disable-animations]")) {
        group.removeAttribute("data-sr-group");
        return;
      }

      if (group.dataset.srGroup === "mobile") {
        if (window.matchMedia("(max-width: 767px)").matches) {
          reveal(group);
        }

        return;
      }

      if (group.dataset.srGroup === "observe") {
        const observer = new MutationObserver(handleMutations.bind(null, group));

        observer.observe(group, {
          childList: true,
          subtree: true,
          attributes: true,
        });

        reveal(group);

        return;
      }

      if (group.dataset.srGroup === "observe-only-children") {
        const observer = new MutationObserver(handleMutations.bind(null, group));

        observer.observe(group, {
          childList: true,
          subtree: true,
        });

        return;
      }

      if (group.dataset.srGroup !== "trigger") {
        reveal(group);
      }
    });
  },
  reveal,
};
