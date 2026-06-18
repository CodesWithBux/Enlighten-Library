/* =====================================================================
   Enlighten — shared logic for every page.
   Each HTML file sets <body data-page="..."> and app.js renders into #main.
   Pages handled here: home · book · cart · checkout · confirmation · categories · library
   (about / contact / privacy are static HTML and need no JS.)
   ===================================================================== */
(function () {
  "use strict";

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var cart = store.get("enl-cart", []);
  var library = store.get("enl-lib", []);
  var recents = store.get("enl-recents", []);

  var ZAR = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 });
  var money = function (n) { return ZAR.format(n); };
  var byId = function (id) { return BOOKS.filter(function (b) { return b.id === Number(id); })[0]; };
  var inCart = function (id) { return cart.indexOf(Number(id)) !== -1; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var param = function (n) { return new URLSearchParams(location.search).get(n); };
  var main = function () { return $("#main"); };
  var uniq = function (arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); };
  var genresOf = function () { return uniq(BOOKS.map(function (b) { return b.genre; })); };
  var authorsOf = function () { return uniq(BOOKS.map(function (b) { return b.author; })); };
  var slug = function (s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-"); };

  var ICON = {
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.9 1-5.8L3.5 9.2l5.9-.9z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>'
  };

  function coverHTML(b, cls) {
    cls = cls || "";
    if (b.img) return '<div class="cover has-img ' + cls + '"><img src="' + b.img + '" alt="Cover of ' + b.title + '"></div>';
    return '<div class="cover ' + cls + '" style="background:' + b.color + '">' +
      '<div class="c-title">' + b.title + '</div><div class="c-author">' + b.author + '</div></div>';
  }
  function cardHTML(b) {
    var added = inCart(b.id);
    return '<a class="card" href="book.html?id=' + b.id + '">' + coverHTML(b) +
      '<button class="quick-add' + (added ? " in-cart" : "") + '" data-action="add" data-id="' + b.id + '" ' +
      'aria-label="' + (added ? "Remove " : "Add ") + b.title + ' to cart">' + (added ? ICON.check : ICON.plus) + '</button>' +
      '<p class="card-title">' + b.title + '</p><p class="card-author">' + b.author + '</p>' +
      '<div class="card-row"><span class="rating">' + ICON.star + b.rating + '</span><span class="price">' + money(b.price) + '</span></div></a>';
  }
  function sectionHTML(title, books, moreHref) {
    return '<section class="section"><div class="section-head"><h2>' + title + '</h2>' +
      (moreHref ? '<a class="more" href="' + moreHref + '">View all</a>' : "") + '</div>' +
      '<div class="grid">' + books.map(cardHTML).join("") + '</div></section>';
  }
  function emptyState(msg, linkText, href) {
    return '<div class="empty-state"><p>' + msg + '</p><a class="btn btn-primary" href="' + href + '">' + linkText + '</a></div>';
  }

  function renderHome() {
    var f = BOOKS[0];
    main().innerHTML =
      '<section class="hero">' + coverHTML(f) +
      '<div class="hero-body"><p class="kicker">Featured</p><h1>' + f.title + '</h1>' +
      '<p class="meta">' + f.author + ' &middot; ' + f.genre + ' &middot; ' + f.year + '</p>' +
      '<p class="blurb">' + f.blurb + '</p><p class="price">' + money(f.price) + '</p>' +
      '<div class="actions" style="margin-top:14px">' +
      '<button class="btn btn-primary" data-action="add" data-id="' + f.id + '">' + ICON.plus + 'Add to cart</button>' +
      '<a class="btn btn-secondary" href="book.html?id=' + f.id + '">View details</a></div></div></section>' +
      sectionHTML("New arrivals", BOOKS.slice(0, 4), "categories.html") +
      sectionHTML("Trending books", BOOKS.slice(4, 8), "categories.html") +
      sectionHTML("Best seller", [BOOKS[7], BOOKS[2], BOOKS[0], BOOKS[5]], "categories.html");
  }

  function renderDetail() {
    var b = byId(param("id"));
    if (!b) { main().innerHTML = emptyState("That book could not be found.", "Back to home", "index.html"); return; }
    recents = [b.id].concat(recents.filter(function (x) { return x !== b.id; })).slice(0, 6);
    store.set("enl-recents", recents);
    document.title = b.title + " \u2014 Enlighten";
    var added = inCart(b.id), inLib = library.indexOf(b.id) !== -1;
    var sim = BOOKS.filter(function (x) { return x.id !== b.id; }).slice(0, 4);
    var rec = recents.filter(function (id) { return id !== b.id; }).map(byId).filter(Boolean).slice(0, 4);
    var reviews = REVIEWS.map(function (r) {
      return '<div class="review"><div class="review-top"><span class="review-av">' + r.initials + '</span>' +
        '<div><div class="review-name">' + r.name + '</div><div class="review-stars">' + "\u2605".repeat(r.stars) + '</div></div></div>' +
        '<p class="review-text">' + r.text + '</p><button class="read-more" data-action="read">Read more</button></div>';
    }).join("");
    main().innerHTML =
      '<a class="back" href="index.html">&larr; Back</a>' +
      '<section class="detail">' + coverHTML(b) +
      '<div><h1>' + b.title + '</h1><p class="meta">' + b.author + ' &middot; ' + b.genre + ' &middot; ' + b.year + '</p>' +
      '<p class="rate">' + ICON.star + ' ' + b.rating + ' &middot; ' + b.count + ' ratings</p>' +
      '<p class="price">' + money(b.price) + '</p>' +
      '<p class="blurb">' + b.blurb + '</p>' +
      '<p class="blurb">Part of the Enlighten public-domain collection \u2014 yours to keep and read offline.</p>' +
      '<div class="actions">' +
      '<button class="btn btn-primary" data-action="add" data-id="' + b.id + '">' + (added ? ICON.check + "In cart" : ICON.plus + "Add to cart") + '</button>' +
      '<button class="btn btn-secondary" data-action="library" data-id="' + b.id + '">' + (inLib ? "In your library \u2713" : "Add to library") + '</button>' +
      '</div></div></section>' +
      '<section class="reviews"><div class="section-head"><h2>Top reader reviews</h2></div>' + reviews + '</section>' +
      sectionHTML("Similar books", sim) +
      (rec.length ? sectionHTML("Recently viewed", rec) : "");
  }

  function renderCategories() {
    var q = param("q"), g = param("genre"), au = param("author");
    if (q || g || au) {
      var t = (q || "").toLowerCase();
      var list = BOOKS.filter(function (b) {
        if (g && b.genre.toLowerCase() !== g.toLowerCase()) return false;
        if (au && b.author.toLowerCase() !== au.toLowerCase()) return false;
        if (q && (b.title + " " + b.author + " " + b.genre).toLowerCase().indexOf(t) === -1) return false;
        return true;
      });
      var label = q ? "Results for \u201c" + q + "\u201d" : (g || au);
      main().innerHTML = '<h1 class="page-title">' + label + '</h1>' +
        '<p class="result-meta">' + list.length + ' book' + (list.length === 1 ? "" : "s") +
        ' &middot; <a href="categories.html">Clear filter</a></p>' +
        (list.length ? '<div class="grid">' + list.map(cardHTML).join("") + '</div>'
          : emptyState("No books match that filter.", "Browse all books", "categories.html"));
      var si = document.querySelector(".search input"); if (si && q) si.value = q;
      return;
    }
    var genres = genresOf();
    var chips = '<div class="chips">' + genres.map(function (gg) { return '<a class="chip" href="#cat-' + slug(gg) + '">' + gg + '</a>'; }).join("") + '</div>';
    var sections = genres.map(function (gg) {
      var l = BOOKS.filter(function (b) { return b.genre === gg; });
      return '<section class="section" id="cat-' + slug(gg) + '"><div class="section-head"><h2>' + gg + '</h2></div>' +
        '<div class="grid">' + l.map(cardHTML).join("") + '</div></section>';
    }).join("");
    main().innerHTML = '<h1 class="page-title">Categories</h1>' + chips + sections;
  }

  function renderLibrary() {
    var items = library.map(byId).filter(Boolean);
    main().innerHTML = '<h1 class="page-title">My library</h1>' +
      (items.length ? '<div class="grid">' + items.map(cardHTML).join("") + '</div>'
        : emptyState("Your library is empty. Add books from any detail page.", "Browse books", "index.html"));
  }

  function renderCartPage() {
    var items = cart.map(byId).filter(Boolean);
    if (!items.length) { main().innerHTML = '<h1 class="page-title">Your cart</h1>' + emptyState("Your cart is empty.", "Browse books", "index.html"); return; }
    var rows = items.map(function (b) {
      return '<div class="cart-item">' + coverHTML(b) +
        '<div class="ci-body"><p class="ci-title">' + b.title + '</p><p class="ci-author">' + b.author + '</p>' +
        '<div class="ci-foot"><span class="ci-price">' + money(b.price) + '</span>' +
        '<button class="ci-remove" data-action="remove" data-id="' + b.id + '">Remove</button></div></div></div>';
    }).join("");
    var total = items.reduce(function (s, b) { return s + b.price; }, 0);
    main().innerHTML = '<h1 class="page-title">Your cart</h1>' +
      '<div class="checkout"><div class="panel">' + rows + '</div>' +
      '<aside class="panel"><h2>Summary</h2>' +
      '<div class="summary-total"><span>Subtotal</span><strong>' + money(total) + '</strong></div>' +
      '<a class="btn btn-primary btn-block" href="checkout.html">Proceed to checkout</a>' +
      '<p class="demo-note" style="text-align:center;margin-top:12px">' + items.length + ' item' + (items.length === 1 ? "" : "s") + '</p></aside></div>';
  }

  function field(id, label, type) {
    return '<div class="field"><label for="f-' + id + '">' + label + '</label>' +
      '<input id="f-' + id + '" name="' + id + '" type="' + type + '" autocomplete="off">' +
      '<p class="err" id="err-' + id + '"></p></div>';
  }
  function renderCheckout() {
    var items = cart.map(byId).filter(Boolean);
    if (!items.length) { main().innerHTML = '<h1 class="page-title">Checkout</h1>' + emptyState("Your cart is empty.", "Browse books", "index.html"); return; }
    var total = items.reduce(function (s, b) { return s + b.price; }, 0);
    var summary = items.map(function (b) { return '<div class="summary-item"><span>' + b.title + '</span><span>' + money(b.price) + '</span></div>'; }).join("");
    main().innerHTML =
      '<a class="back" href="cart.html">&larr; Back to cart</a><h1 class="page-title">Checkout</h1>' +
      '<div class="checkout"><form class="panel" id="checkoutForm" novalidate>' +
      '<h2>Your details</h2>' + field("name", "Full name", "text") + field("email", "Email address", "email") +
      '<h2 style="margin-top:8px">Payment</h2><p class="demo-note">Demo only \u2014 no real payment is taken and no card data is stored.</p>' +
      field("card", "Card number", "text") +
      '<div class="field-row">' + field("exp", "Expiry (MM/YY)", "text") + field("cvc", "CVC", "text") + '</div>' +
      '<button type="submit" class="btn btn-primary btn-block">Place order &middot; ' + money(total) + '</button></form>' +
      '<aside class="panel"><h2>Order summary</h2>' + summary +
      '<div class="summary-total"><span>Total</span><strong>' + money(total) + '</strong></div>' +
      '<p class="demo-note">' + items.length + ' item' + (items.length === 1 ? "" : "s") + ' &middot; instant digital delivery</p></aside></div>';
  }

  function renderConfirmation() {
    var ref = param("ref") || store.get("enl-lastorder", "ENL-000000");
    main().innerHTML = '<div class="confirm"><div class="check">' + ICON.check + '</div>' +
      '<h1>Order confirmed</h1><p>Thanks \u2014 your books are ready in your library.</p>' +
      '<p>Reference <span class="ref">' + ref + '</span></p>' +
      '<a class="btn btn-primary" href="index.html" style="margin-top:18px;display:inline-flex">Back to home</a></div>';
  }

  function updateBadge() {
    var el = $("#cartCount"); if (!el) return;
    el.textContent = cart.length;
    el.className = "cart-count" + (cart.length ? "" : " empty");
  }
  function rerender() {
    var p = document.body.dataset.page;
    if (p === "home") renderHome();
    else if (p === "book") renderDetail();
    else if (p === "categories") renderCategories();
    else if (p === "library") renderLibrary();
    else if (p === "cart") renderCartPage();
    else if (p === "checkout") renderCheckout();
    else if (p === "confirmation") renderConfirmation();
  }
  function addToCart(id) {
    id = Number(id);
    if (inCart(id)) { cart.splice(cart.indexOf(id), 1); toast("Removed from cart"); }
    else { cart.push(id); toast("Added to cart"); }
    store.set("enl-cart", cart); updateBadge(); rerender();
  }
  function removeFromCart(id) {
    id = Number(id);
    if (inCart(id)) { cart.splice(cart.indexOf(id), 1); store.set("enl-cart", cart); updateBadge(); rerender(); }
  }
  function toggleLibrary(id) {
    id = Number(id); var i = library.indexOf(id);
    if (i !== -1) { library.splice(i, 1); toast("Removed from your library"); }
    else { library.push(id); toast("Added to your library"); }
    store.set("enl-lib", library); rerender();
  }
  function placeOrder(form) {
    var fields = ["name", "email", "card", "exp", "cvc"], ok = true;
    fields.forEach(function (f) {
      var input = form.elements[f], err = $("#err-" + f), val = input.value.trim(), msg = "";
      if (!val) msg = "Required";
      else if (f === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = "Enter a valid email";
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      err.textContent = msg; if (msg) ok = false;
    });
    if (!ok) { toast("Please fix the highlighted fields"); return; }
    var ref = "ENL-" + Math.floor(100000 + Math.random() * 900000);
    cart = []; store.set("enl-cart", cart); store.set("enl-lastorder", ref); updateBadge();
    location.href = "confirmation.html?ref=" + ref;
  }

  function openMenu() { var d = $("#navDrawer"); d.classList.add("open"); d.setAttribute("aria-hidden", "false"); $("#scrim").hidden = false; var bg = $(".burger"); if (bg) bg.setAttribute("aria-expanded", "true"); }
  function closeMenu() { var d = $("#navDrawer"); d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); $("#scrim").hidden = true; var bg = $(".burger"); if (bg) bg.setAttribute("aria-expanded", "false"); }
  var toastTimer;
  function toast(msg) { var t = $("#toast"); if (!t) return; t.textContent = msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200); }

  /* Filter dropdown (Genre / Author) + search — wired at runtime so the
     header markup stays simple. Both land on a filtered Categories page. */
  function setupFilterAndSearch() {
    var btn = document.querySelector(".filter-btn");
    if (btn && !btn.dataset.wired) {
      btn.dataset.wired = "1";
      var wrap = document.createElement("div");
      wrap.className = "filter-wrap";
      btn.parentNode.insertBefore(wrap, btn);
      wrap.appendChild(btn);
      btn.setAttribute("aria-haspopup", "true");
      btn.setAttribute("aria-expanded", "false");

      var menu = document.createElement("div");
      menu.className = "filter-menu";
      menu.hidden = true;
      menu.innerHTML =
        '<p class="fm-head">Genre</p>' +
        genresOf().map(function (g) { return '<a href="categories.html?genre=' + encodeURIComponent(g) + '">' + g + '</a>'; }).join("") +
        '<p class="fm-head">Author</p>' +
        authorsOf().map(function (a) { return '<a href="categories.html?author=' + encodeURIComponent(a) + '">' + a + '</a>'; }).join("");
      wrap.appendChild(menu);

      function setOpen(open) { menu.hidden = !open; btn.setAttribute("aria-expanded", String(open)); }
      btn.addEventListener("click", function (e) { e.stopPropagation(); setOpen(menu.hidden); });
      document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) setOpen(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    }

    var si = document.querySelector(".search input");
    if (si && !si.dataset.wired) {
      si.dataset.wired = "1";
      si.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          var v = si.value.trim();
          if (v) location.href = "categories.html?q=" + encodeURIComponent(v);
        }
      });
    }
  }

  function init() {
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-action]"); if (!el) return;
      var a = el.dataset.action.split(/\s+/);
      if (a.indexOf("add") !== -1) { e.preventDefault(); addToCart(el.dataset.id); }
      if (a.indexOf("remove") !== -1) { e.preventDefault(); removeFromCart(el.dataset.id); }
      if (a.indexOf("library") !== -1) toggleLibrary(el.dataset.id);
      if (a.indexOf("read") !== -1) toast("Opening reader\u2026");
      if (a.indexOf("open-menu") !== -1) openMenu();
      if (a.indexOf("close-menu") !== -1) closeMenu();
    });
    document.addEventListener("submit", function (e) { if (e.target.id === "checkoutForm") { e.preventDefault(); placeOrder(e.target); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

    var page = document.body.dataset.page;
    [].forEach.call(document.querySelectorAll("[data-nav]"), function (a) { if (a.dataset.nav === page) a.classList.add("on"); });

    setupFilterAndSearch();
    updateBadge();
    rerender();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
