    // ===== Live rows (home) and live product page: read BHE data at runtime, so admin edits show without a rebuild =====
    const rowsEsc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    const rowsPct = p => Math.round((1 - p.price / p.mrp) * 100);
    function homeRowIds() {
      const featured = BHE.sections.map(s => P.find(p => p.group === s.id && p.featured)).filter(Boolean).slice(0, 8).map(p => p.id);
      const news = P.filter(p => p.isNew).slice(0, 8).map(p => p.id);
      const offers = [...P].sort((a, b) => rowsPct(b) - rowsPct(a) || a.id - b.id).slice(0, 8).map(p => p.id);
      return { rowFeatured: featured, rowNew: news, rowOffers: offers };
    }
    function productRelatedIds(p) {
      return P.filter(q => q.group === p.group && q.id !== p.id)
        .sort((a, b) => (a.brand === p.brand) - (b.brand === p.brand) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
        .slice(0, 4).map(q => q.id);
    }
    function fillProduct(p) {
      const d = DET[p.t] || { f: [], w: ["", ""], d: "" }, sec = BHE.sections.find(s => s.id === p.group) || { label: "", col: ["#2563EB", "#EFF6FF", "#60A5FA"] };
      const c = sec.col, ok = (p.stock || "in_stock") !== "out_of_stock", st = p.stock || "in_stock";
      const cap = b => b[0] + b.slice(1).toLowerCase(), inrTxt = n => "₹" + Number(n).toLocaleString("en-IN"), pct = rowsPct(p);
      const name = p.name, brand = cap(p.brand), title = `${brand} ${name} ${p.specs[0]} – ${inrTxt(p.price)} | Bombay Hardware & Electricals, Patna`;
      document.title = title;
      const set = (sel, fn) => { const el = document.querySelector(sel); if (el) fn(el); };
      set("#pName", e => e.textContent = name);
      set("#pSpecs", e => e.innerHTML = p.specs.map(x => `<span class="text-xs font-extrabold rounded-md px-2.5 py-0.5" style="background:${c[1]};color:${c[0]}">${rowsEsc(x)}</span>`).join(""));
      set("#pPrice", e => e.textContent = inrTxt(p.price));
      set("#pMrp", e => e.textContent = inrTxt(p.mrp));
      set("#pOff", e => e.textContent = `${pct}% OFF · Save ${inrTxt(p.mrp - p.price)}`);
      set("#pDesc", e => e.textContent = p.desc || d.d);
      set("#pFeat", e => e.innerHTML = d.f.map(x => `<li>${rowsEsc(x)}</li>`).join(""));
      const row = (k, v) => `<div class="py-1.5 flex justify-between gap-2"><dt class="text-slate-500">${k}</dt><dd class="font-bold text-ink text-right">${v}</dd></div>`;
      set("#pDl", e => e.innerHTML = row("Brand", brand) + row("Category", `<a class="text-blue-700 hover:underline" href="${BASE}${p.group}.html">${rowsEsc(sec.label)}</a>`) + row("Model / Size", rowsEsc(p.specs[0])) + row("Feature", rowsEsc(p.specs[1])) + row("Warranty", rowsEsc(d.w[0] || "")) + row("Covers", rowsEsc(d.w[1] || "")));
      set("#pStock", e => {
        e.className = "mt-2 text-xs font-bold " + ({ in_stock: "text-emerald-700", on_order: "text-amber-700", out_of_stock: "text-rose-600" })[st];
        e.innerHTML = ({ in_stock: "● In stock at Bhootnath Road showroom", on_order: "● Available on order", out_of_stock: "● Currently out of stock" })[st] + ' <span class="font-medium text-slate-500">– final price &amp; stock confirmed on WhatsApp</span>';
      });
      set("#pAdd", e => { e.disabled = !ok; e.style.background = ok ? `linear-gradient(135deg, ${c[0]} 0%, ${c[2]} 100%)` : "#94A3B8"; e.textContent = ok ? "Add to Bag" : "Out of Stock"; });
      document.querySelectorAll("[data-buy]").forEach(e => { if (e.dataset.buy === String(p.id)) e.disabled = !ok; });
      const crumbLast = document.querySelector('nav[aria-label="Breadcrumb"] > span:last-child');
      if (crumbLast) crumbLast.textContent = name;
      set("#pLd", e => e.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: `${brand} ${name} ${p.specs[0]}`, brand: { "@type": "Brand", name: brand }, description: p.desc || d.d, image: new URL(getPhotoUrl(p), location.href).href, offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: "https://schema.org/" + ({ in_stock: "InStock", on_order: "BackOrder", out_of_stock: "OutOfStock" })[st], seller: { "@type": "Organization", name: "Bombay Hardware & Electricals" } } }));
    }
    function renderRows() {
      const ids = PAGE.type === "home" ? homeRowIds() : (PAGE.type === "product" ? { rowRelated: productRelatedIds(byId(PAGE.id) || {}) } : (PAGE.rows || {}));
      Object.entries(ids).forEach(([id, list]) => {
        const el = document.querySelector("#" + id);
        if (el) el.innerHTML = list.map(i => card(byId(i))).filter(Boolean).join("");
      });
      const pic1 = document.querySelector("#pPic");
      if (pic1 && PAGE.id) pic1.innerHTML = pic(byId(PAGE.id), 1.4);
      if (PAGE.type === "product" && byId(PAGE.id)) fillProduct(byId(PAGE.id));
    }
