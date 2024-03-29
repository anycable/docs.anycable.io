window.TurboViewTransitions = (function () {
  function shouldPerformTransition() {
    return !!(
      "undefined" !== typeof document &&
      document.head &&
      document.startViewTransition &&
      document.head.querySelector('meta[name="view-transition"]')
    );
  }
  const t = "data-turbo-transition";
  const e = "data-turbo-transition-active";
  const resetTransitions = (t, e) => {
    t = t || document;
    let { activeAttr: r } = e;
    t.querySelectorAll(`[${r}]`).forEach((t) => {
      t.style.viewTransitionName = "";
      t.removeAttribute(r);
    });
  };
  const activateTransitions = (t, e, r) => {
    let { transitionAttr: i, activeAttr: n } = r;
    let a = Array.from(t.querySelectorAll(`[${i}]`)).reduce((t, e) => {
      let r = e.id || "0";
      let n = e.getAttribute(i) || `__${r}`;
      t[n] ||
        (t[n] = {
          ids: {},
          active: false,
          discarded: false,
        });
      t[n].ids[r] = e;
      return t;
    }, {});
    Array.from(e.querySelectorAll(`[${i}]`)).forEach((t) => {
      let e = t.id || "0";
      let r = t.getAttribute(i) || `__${e}`;
      if (a[r] && a[r].ids[e]) {
        if (a[r].active) {
          a[r].discarded = true;
          return;
        }
        a[r].newEl = t;
        a[r].oldEl = a[r].ids[e];
        a[r].active = true;
      }
    });
    for (let t in a) {
      let { newEl: e, oldEl: r, active: i, discarded: o } = a[t];
      if (!o && i) {
        r.style.viewTransitionName = t;
        e.style.viewTransitionName = t;
        r.setAttribute(n, "");
        e.setAttribute(n, "");
      }
    }
  };
  async function performTransition(r, i, n, a = {}) {
    a.activeAttr = a.activeAttr || e;
    a.transitionAttr = a.transitionAttr || t;
    resetTransitions(r, a);
    activateTransitions(r, i, a);
    await document.startViewTransition(n).finished.then(() => {
      resetTransitions(r, a);
      resetTransitions(i, a);
    });
  }

  return { shouldPerformTransition, performTransition };
})();
