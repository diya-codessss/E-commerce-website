/* ShopZone: shared by index.html and wishlist.html. Needs products.js loaded first. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const P = window.PRODUCTS || [];
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  const isWL = document.body.dataset.page === "wishlist";
  const money = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n);
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const img = (id, w = 600) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
  const BLANK =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect width='4' height='3' fill='%231e293b'/%3E%3C/svg%3E";

  /* ---------- State: localStorage, always guarded and validated ---------- */
  const read = (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch {
      return d;
    }
  };
  const write = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* private mode or quota */
    }
  };
  const readWish = () => {
    const w = read("sz:wish", []);
    return Array.isArray(w) ? w.filter((id) => byId[id]) : [];
  };
  const readCart = () => {
    const c = read("sz:cart", {});
    return Object.fromEntries(
      Object.entries(c && typeof c === "object" ? c : {})
        .filter(([id, q]) => byId[id] && q > 0)
        .map(([id, q]) => [id, Math.min(99, Math.max(1, q | 0))]),
    );
  };
  let wish = readWish();
  let cart = readCart();
  const qty = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const total = () =>
    Object.entries(cart).reduce(
      (a, [id, q]) => a + Math.round(byId[id].price * 100) * q,
      0,
    ) / 100;

  /* ---------- Injected UI: cart drawer + toast (shared by both pages) ---------- */
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="overlay" id="overlay"></div>
    <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div class="drawer-head"><h2 id="drawer-title">Your cart</h2><button class="icon-btn" id="cart-close" type="button" aria-label="Close cart">✕</button></div>
      <ul class="lines" id="lines"></ul>
      <div class="drawer-foot"><div class="sum"><span>Total</span><strong id="total">$0.00</strong></div><button class="btn block" id="checkout" type="button">Checkout</button></div>
    </aside>
    <div class="toast" id="toast" role="status"></div>`,
  );
  const drawer = $("#drawer");

  let tt;
  const toast = (m) => {
    const t = $("#toast");
    t.textContent = m;
    t.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove("show"), 2400);
  };

  /* ---------- Cart ---------- */
  const badge = (sel, n) =>
    $$(sel).forEach((b) => {
      b.textContent = n;
      b.hidden = !n;
      const p = b.parentElement;
      p.setAttribute("aria-label", p.dataset.label + (n ? ` (${n})` : ""));
    });

  const renderCart = () => {
    const ids = Object.keys(cart);
    $("#lines").innerHTML = ids.length
      ? ids
          .map((id) => {
            const p = byId[id],
              n = esc(p.name);
            return `<li class="line"><img src="${img(p.img, 160)}" alt="" width="64" height="64" loading="lazy">
        <div class="li-info"><strong>${n}</strong><span class="muted">${money(p.price)}</span>
          <div class="qty"><button type="button" data-act="dec" data-id="${id}" aria-label="Decrease quantity of ${n}">−</button><span>${cart[id]}</span><button type="button" data-act="inc" data-id="${id}" aria-label="Increase quantity of ${n}">+</button></div></div>
        <button class="icon-btn" type="button" data-act="del" data-id="${id}" aria-label="Remove ${n} from cart">🗑</button></li>`;
          })
          .join("")
      : `<li class="empty-cart">Your cart is empty. Add something you like.</li>`;
    $("#total").textContent = money(total());
    $("#checkout").disabled = !ids.length;
    badge("[data-cart-count]", qty());
    badge("[data-wl-count]", wish.length);
  };
  const commit = () => {
    write("sz:cart", cart);
    renderCart();
  };
  const add = (id) => {
    cart[id] = Math.min(99, (cart[id] || 0) + 1);
    commit();
    toast(`${byId[id].name} added to cart`);
  };

  let lastFocus;
  const openCart = (open) => {
    drawer.classList.toggle("open", open);
    $("#overlay").classList.toggle("open", open);
    document.body.classList.toggle("lock", open);
    if (open) {
      lastFocus = document.activeElement;
      $("#cart-close").focus();
    } else if (lastFocus) lastFocus.focus();
  };

  $("#cart-open").addEventListener("click", () => openCart(true));
  $("#cart-close").addEventListener("click", () => openCart(false));
  $("#overlay").addEventListener("click", () => openCart(false));
  $("#checkout").addEventListener("click", () =>
    toast("Checkout isn't connected yet."),
  ); // TODO: connect a payment provider
  $("#lines").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const id = b.dataset.id;
    if (b.dataset.act === "inc") cart[id] = Math.min(99, cart[id] + 1);
    else if (b.dataset.act === "dec" && cart[id] > 1) cart[id]--;
    else delete cart[id];
    commit();
    (
      $(`[data-act="${b.dataset.act}"][data-id="${id}"]`, drawer) ||
      $("#cart-close")
    ).focus();
  });
  document.addEventListener("keydown", (e) => {
    if (!drawer.classList.contains("open")) return;
    if (e.key === "Escape") return openCart(false);
    if (e.key !== "Tab") return;
    const f = $$("button:not(:disabled)", drawer),
      a = f[0],
      z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) {
      e.preventDefault();
      z.focus();
    } else if (!e.shiftKey && document.activeElement === z) {
      e.preventDefault();
      a.focus();
    }
  });

  /* ---------- Products ---------- */
  const card = (p, i) => {
    const n = esc(p.name),
      on = wish.includes(p.id);
    return `<article class="card" data-id="${p.id}">
      <div class="media"><img src="${img(p.img)}" alt="${n}" width="600" height="600" loading="${i < 4 ? "eager" : "lazy"}" decoding="async">
        <span class="off">${p.off}% off</span>
        <button class="heart" type="button" data-act="wish" aria-pressed="${on}" aria-label="Save ${n} to wishlist">${on ? "❤️" : "🤍"}</button></div>
      <div class="body"><h3>${n}</h3><p class="rate" aria-label="Rated ${p.rating} out of 5">★ ${p.rating}</p><p class="price">${money(p.price)}</p>
        <button class="btn block" type="button" data-act="add">Add to cart</button></div></article>`;
  };

  const st = { cat: "all", q: "", sort: "featured" };
  const sorters = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    off: (a, b) => b.off - a.off,
  };
  const grid = $("#grid");

  const view = () => {
    const l = isWL
      ? wish.map((id) => byId[id])
      : P.filter(
          (p) =>
            (st.cat === "all" || p.cat === st.cat) &&
            `${p.name} ${p.cat}`.toLowerCase().includes(st.q),
        );
    if (!isWL && sorters[st.sort]) l.sort(sorters[st.sort]);
    grid.innerHTML = l.map(card).join("");
    $("#empty").hidden = l.length > 0;
    $("#count").textContent =
      `${l.length} ${isWL ? "saved " : ""}product${l.length === 1 ? "" : "s"}`;
  };

  const syncHearts = () =>
    $$(".heart").forEach((h) => {
      const on = wish.includes(h.closest(".card").dataset.id);
      h.setAttribute("aria-pressed", on);
      h.textContent = on ? "❤️" : "🤍";
    });

  const toggleWish = (id) => {
    const on = wish.includes(id);
    wish = on ? wish.filter((x) => x !== id) : [...wish, id];
    write("sz:wish", wish);
    toast(on ? "Removed from wishlist" : "Saved to wishlist");
    isWL ? view() : syncHearts();
    renderCart();
  };

  grid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const id = b.closest(".card").dataset.id;
    b.dataset.act === "add" ? add(id) : toggleWish(id);
  });
  // Broken or blocked photo: swap in a neutral placeholder once.
  grid.addEventListener(
    "error",
    (e) => {
      const i = e.target;
      if (i.tagName === "IMG" && !i.dataset.x) {
        i.dataset.x = 1;
        i.src = BLANK;
      }
    },
    true,
  );

  /* ---------- Shop page controls ---------- */
  if (!isWL) {
    let t;
    $("#q").addEventListener("input", (e) => {
      clearTimeout(t);
      t = setTimeout(() => {
        st.q = e.target.value.trim().toLowerCase();
        view();
      }, 120);
    });
    $("#search-form").addEventListener("submit", (e) => {
      e.preventDefault();
      $("#q").blur();
      $("#products").scrollIntoView();
    });
    $("#chips").addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      st.cat = b.dataset.cat;
      $$(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
      view();
    });
    $("#sort").addEventListener("change", (e) => {
      st.sort = e.target.value;
      view();
    });
    $("#reset").addEventListener("click", () => {
      Object.assign(st, { cat: "all", q: "", sort: "featured" });
      $("#q").value = "";
      $("#sort").value = "featured";
      $$(".chip").forEach((c) =>
        c.setAttribute("aria-pressed", c.dataset.cat === "all"),
      );
      view();
    });
    $("#news-form").addEventListener("submit", (e) => {
      e.preventDefault();
      e.target.reset();
      toast("Thanks for subscribing.");
    }); // TODO: send to your mailing list
  }

  // Keep other open tabs in sync.
  addEventListener("storage", (e) => {
    if (e.key !== "sz:cart" && e.key !== "sz:wish") return;
    wish = readWish();
    cart = readCart();
    renderCart();
    isWL ? view() : syncHearts();
  });

  renderCart();
  view();
})();
