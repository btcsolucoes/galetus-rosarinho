const PRESETS = {
  premium_cafe: {
    label: "Premium Café",
    keywords: ["café", "cafeteria", "brunch", "minimalista"],
    colors: { primary: "#5a3427", secondary: "#f7f0e8", accent: "#d6a36a" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { maxWidth: "1160px" },
    banner: "assets/placeholders/banner-cafe.svg"
  },
  regional_rustico: {
    label: "Regional Rústico",
    keywords: ["regional", "rústico", "rustico", "madeira", "pedra", "sofisticado", "quente"],
    colors: { primary: "#a31521", secondary: "#f4efea", accent: "#151110" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { maxWidth: "1120px" },
    banner: "assets/placeholders/banner-rustic.svg"
  },
  casual_moderno: {
    label: "Casual Moderno",
    keywords: ["casual", "moderno", "urbano", "leve"],
    colors: { primary: "#20313d", secondary: "#f4f7f8", accent: "#f3b55e" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { maxWidth: "1160px" },
    banner: "assets/placeholders/banner-modern.svg"
  },
  hamburgueria_escura: {
    label: "Hamburgueria Escura",
    keywords: ["hamburgueria", "burger", "escuro", "industrial", "intenso"],
    colors: { primary: "#1f1716", secondary: "#f4eee8", accent: "#c93f2c" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { maxWidth: "1180px" },
    banner: "assets/placeholders/banner-dark.svg"
  },
  executivo_clean: {
    label: "Executivo Clean",
    keywords: ["executivo", "almoço", "almoco", "clean", "corporativo"],
    colors: { primary: "#2a473e", secondary: "#f4f5f0", accent: "#c9a869" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { maxWidth: "1140px" },
    banner: "assets/placeholders/banner-clean.svg"
  },
  tropical_praia: {
    label: "Tropical Praia",
    keywords: ["praia", "tropical", "leve", "solar"],
    colors: { primary: "#156b65", secondary: "#f4f3e9", accent: "#f2b861" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { maxWidth: "1180px" },
    banner: "assets/placeholders/banner-tropical.svg"
  },
  doceria_delicada: {
    label: "Doceria Delicada",
    keywords: ["doce", "doceria", "delicada", "sobremesa"],
    colors: { primary: "#8b4b5e", secondary: "#fbf1f4", accent: "#e9c16c" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { maxWidth: "1120px" },
    banner: "assets/placeholders/banner-sweet.svg"
  }
};

const PLACEHOLDER_IMAGES = [
  "assets/placeholders/dish-1.svg",
  "assets/placeholders/dish-2.svg",
  "assets/placeholders/dish-3.svg",
  "assets/placeholders/dish-4.svg",
  "assets/placeholders/dish-5.svg",
  "assets/placeholders/dish-6.svg"
];

const SPECIAL_BADGES = new Set([
  "mais pedido",
  "mais pedida",
  "especial",
  "prato do dia",
  "destaque",
  "promoção",
  "promocao",
  "regional",
  "novidade",
  "combo"
]);

const state = {
  config: null,
  templateData: null,
  preset: null,
  theme: null,
  generatedCategories: [],
  generatedItems: [],
  filters: {
    search: "",
    category: "all",
    specialOnly: false
  }
};

const refs = {
  brandMark: document.querySelector("#brand-mark"),
  heroKicker: document.querySelector("#hero-kicker"),
  restaurantName: document.querySelector("#restaurant-name"),
  restaurantTagline: document.querySelector("#restaurant-tagline"),
  restaurantDescription: document.querySelector("#restaurant-description"),
  restaurantAddress: document.querySelector("#restaurant-address"),
  restaurantContact: document.querySelector("#restaurant-contact"),
  heroActions: document.querySelector("#hero-actions"),
  operationBadges: document.querySelector("#operation-badges"),
  categoryChips: document.querySelector("#category-chips"),
  categorySelect: document.querySelector("#category-select"),
  searchInput: document.querySelector("#search-input"),
  specialFilter: document.querySelector("#special-filter"),
  dailySpecialModule: document.querySelector("#daily-special-module"),
  dailySpecialKicker: document.querySelector("#daily-special-kicker"),
  dailySpecialTitle: document.querySelector("#daily-special-title"),
  dailySpecialCopy: document.querySelector("#daily-special-copy"),
  dailySpecialCard: document.querySelector("#daily-special-card"),
  featuredModule: document.querySelector("#featured-module"),
  highlightGrid: document.querySelector("#highlight-grid"),
  menuStage: document.querySelector("#menu-stage"),
  emptyState: document.querySelector("#empty-state"),
  resetFilters: document.querySelector("#reset-filters"),
  footerName: document.querySelector("#footer-name"),
  footerAddress: document.querySelector("#footer-address"),
  footerPhone: document.querySelector("#footer-phone"),
  footerWhatsapp: document.querySelector("#footer-whatsapp"),
  footerInstagram: document.querySelector("#footer-instagram"),
  footerCopy: document.querySelector("#footer-copy"),
  qrstackSignature: document.querySelector("#qrstack-signature"),
  cardTemplate: document.querySelector("#menu-card-template")
};

const sanitize = (value) => String(value ?? "").trim();
const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const normalize = (value) =>
  sanitize(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const currency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value || 0));

async function loadFiles() {
  const [configResponse, templateResponse] = await Promise.all([
    fetch("restaurant.config.json", { cache: "no-store" }),
    fetch("menu.template.json", { cache: "no-store" })
  ]);

  if (!configResponse.ok || !templateResponse.ok) {
    throw new Error("Não foi possível carregar os arquivos do cardápio.");
  }

  state.config = await configResponse.json();
  state.templateData = await templateResponse.json();
}

function inferWhatsAppDigits(config) {
  const raw = sanitize(config.whatsapp || config.phone);
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function buildInstagramUrl(handle) {
  if (!handle) return "";
  if (handle.startsWith("http")) return handle;
  return `https://instagram.com/${handle.replace("@", "")}`;
}

function resolvePresetKey(config) {
  const explicit = normalize(config.preferredStyle);
  if (explicit && explicit !== "auto") {
    if (PRESETS[explicit]) return explicit;
    if (explicit.includes("regional")) return "regional_rustico";
    if (explicit.includes("burger")) return "hamburgueria_escura";
    if (explicit.includes("executivo")) return "executivo_clean";
  }

  const context = normalize(
    [
      ...toArray(config.restaurantType),
      ...toArray(config.operationMode),
      config.visualReference,
      config.tagline,
      config.restaurantName
    ].join(" ")
  );

  const ranked = Object.entries(PRESETS)
    .map(([key, preset]) => ({
      key,
      score: preset.keywords.reduce((total, keyword) => {
        return total + (context.includes(normalize(keyword)) ? 1 : 0);
      }, 0)
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score > 0 ? ranked[0].key : "regional_rustico";
}

function buildTheme(config, preset) {
  return {
    primary: config.preferredPalette?.primary || preset.colors.primary,
    secondary: config.preferredPalette?.secondary || preset.colors.secondary,
    accent: config.preferredPalette?.accent || preset.colors.accent,
    headingFont: preset.fonts.heading,
    bodyFont: preset.fonts.body,
    maxWidth: preset.tokens.maxWidth,
    banner: config.bannerImage || preset.banner || "assets/placeholders/banner-generic.svg"
  };
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--secondary", theme.secondary);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--gold", theme.primary);
  root.style.setProperty("--font-heading", theme.headingFont);
  root.style.setProperty("--font-body", theme.bodyFont);
  root.style.setProperty("--max-width", theme.maxWidth);
}

function buildAutoTagline(config) {
  const types = toArray(config.restaurantType);
  if (types.length === 0) return "Cardápio da casa";
  return types
    .slice(0, 2)
    .map((type) => sanitize(type))
    .join(" • ");
}

function buildAutoDescription(config) {
  const typeCopy = toArray(config.restaurantType).join(", ");
  return `${config.restaurantName} combina ${typeCopy} em um salão pensado para almoço, mesa em família e chope gelado em clima acolhedor.`;
}

function formatOperationMode(mode) {
  const map = {
    salao: "Salão",
    delivery: "Delivery",
    retirada: "Retirada"
  };
  return map[normalize(mode)] || sanitize(mode);
}

function createActionLink(label, href, className) {
  const link = document.createElement("a");
  link.className = className;
  link.href = href;
  if (href.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  link.textContent = label;
  return link;
}

function buildWhatsAppUrl(message) {
  const digits = inferWhatsAppDigits(state.config);
  if (!digits) return "#";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function renderBrandMark() {
  refs.brandMark.innerHTML = "";

  if (!state.config.logoImage) {
    refs.brandMark.textContent = state.config.restaurantName.slice(0, 2).toUpperCase();
    return;
  }

  const image = document.createElement("img");
  image.src = state.config.logoImage;
  image.alt = `Logo ${state.config.restaurantName}`;
  image.loading = "eager";
  image.dataset.ignoreFallback = "true";
  image.addEventListener("error", () => {
    refs.brandMark.textContent = state.config.restaurantName.slice(0, 2).toUpperCase();
  });
  refs.brandMark.appendChild(image);
}

function renderHero() {
  const config = state.config;
  const whatsappUrl = buildWhatsAppUrl(`Olá! Quero saber mais sobre o cardápio da ${config.restaurantName}.`);
  const metaDescription = document.querySelector('meta[name="description"]');

  document.title = `${config.restaurantName} | Cardápio`;
  if (metaDescription) {
    metaDescription.content = `${config.restaurantName}: ${config.tagline || buildAutoTagline(config)} em ${config.address}.`;
  }

  renderBrandMark();

  refs.heroKicker.textContent = config.heroKicker || "Rosarinho • Recife";
  refs.restaurantName.textContent = config.restaurantName;
  refs.restaurantTagline.textContent = config.tagline || buildAutoTagline(config);
  refs.restaurantDescription.textContent = config.description || buildAutoDescription(config);
  refs.restaurantAddress.textContent = config.address || "Endereço não informado";
  refs.restaurantContact.textContent = config.openingHours || "Horário não informado";

  refs.heroActions.innerHTML = "";
  if (inferWhatsAppDigits(config)) {
    refs.heroActions.appendChild(
      createActionLink(config.primaryCtaLabel || "Falar no WhatsApp", whatsappUrl, "primary-button")
    );
  }
  refs.heroActions.appendChild(
    createActionLink(config.secondaryCtaLabel || "Ver cardápio", "#menu-stage", "secondary-button")
  );

  refs.operationBadges.innerHTML = "";
  const badges = [
    ...toArray(config.operationMode).map(formatOperationMode),
    config.instagram ? "Instagram ativo" : "",
    config.modules?.dailySpecial ? "Rotação diária" : ""
  ].filter(Boolean);

  badges.forEach((label) => {
    const badge = document.createElement("span");
    badge.className = "hero-badge";
    badge.textContent = label;
    refs.operationBadges.appendChild(badge);
  });

  refs.footerName.textContent = config.restaurantName;
  refs.footerAddress.textContent = config.address || "";
  refs.footerPhone.textContent = config.phone || "";
  refs.footerCopy.textContent = `${config.restaurantName} no Rosarinho, com almoço, grill, pizza e chope em um ambiente acolhedor.`;

  refs.footerWhatsapp.href = whatsappUrl;
  refs.footerWhatsapp.hidden = !inferWhatsAppDigits(config);

  const instagramUrl = buildInstagramUrl(config.instagram);
  refs.footerInstagram.href = instagramUrl || "#";
  refs.footerInstagram.hidden = !instagramUrl;
  refs.qrstackSignature.hidden = !config.modules?.qrStackSignature;
}

function chooseCategories() {
  const context = normalize(
    [
      state.config.tagline,
      state.config.visualReference,
      state.config.restaurantName,
      ...toArray(state.config.restaurantType),
      ...toArray(state.config.operationMode)
    ].join(" ")
  );

  const selected = state.templateData.categoryBlueprints
    .map((blueprint) => ({
      ...blueprint,
      score: blueprint.triggers.reduce((score, trigger) => {
        return score + (context.includes(normalize(trigger)) ? 1 : 0);
      }, 0)
    }))
    .filter((category) => category.score > 0 || ["petiscos", "executivos", "pizzas", "bebidas"].includes(category.id))
    .sort((a, b) => {
      if (a.score === b.score) return a.order - b.order;
      return b.score - a.score;
    });

  const unique = [];
  const seen = new Set();
  selected.forEach((category) => {
    if (seen.has(category.id)) return;
    unique.push(category);
    seen.add(category.id);
  });

  state.generatedCategories = unique.sort((a, b) => a.order - b.order).slice(0, 8);
}

function buildItemNotes(categoryId) {
  const notes = {
    petiscos: "Ideal para compartilhar.",
    executivos: "Disponível no almoço.",
    grill: "Cozinha de salão.",
    burgers: "Boa escolha para refeições rápidas.",
    pizzas: "Boa pedida para dividir.",
    regionais: "Leitura de casa.",
    bebidas: "Servido bem gelado.",
    sobremesas: "Finalização da casa."
  };
  return notes[categoryId] || "Seleção da casa.";
}

function generateItems() {
  let imageIndex = 0;
  const items = [];

  state.generatedCategories.forEach((category) => {
    const blueprints = state.templateData.itemBlueprints[category.id] || [];

    blueprints.forEach((blueprint, itemIndex) => {
      const [name, description, price, badge] = blueprint;
      const promotionalPrice =
        itemIndex === 0 && ["executivos", "pizzas", "petiscos"].includes(category.id)
          ? Math.max(Number(price) - 4, 8)
          : null;

      items.push({
        id: `${category.id}-${itemIndex + 1}`,
        categoryId: category.id,
        name,
        description,
        price,
        promotionalPrice,
        badge,
        image: PLACEHOLDER_IMAGES[imageIndex % PLACEHOLDER_IMAGES.length],
        availability: "available",
        featured: itemIndex === 0 || SPECIAL_BADGES.has(normalize(badge)),
        dailySpecial: category.id === "executivos" && itemIndex === 0,
        notes: buildItemNotes(category.id)
      });

      imageIndex += 1;
    });
  });

  state.generatedItems = items;
}

function updateCategoryNavigation() {
  document.querySelectorAll(".category-chip").forEach((chip) => {
    const isSpecialChip = chip.dataset.target === "daily-special";
    if (isSpecialChip) {
      chip.classList.remove("is-active");
      return;
    }

    const chipCategory = chip.dataset.categoryId || "all";
    chip.classList.toggle("is-active", chipCategory === state.filters.category);
  });

  refs.categorySelect.value = state.filters.category;
}

function setCategoryFilter(categoryId) {
  state.filters.category = categoryId;
  renderMenu();
  updateCategoryNavigation();
}

function buildCategoryNavigation() {
  refs.categoryChips.innerHTML = "";
  refs.categorySelect.innerHTML = '<option value="all">Todas as categorias</option>';

  if (state.config.modules?.dailySpecial) {
    const specialChip = document.createElement("button");
    specialChip.type = "button";
    specialChip.className = "category-chip";
    specialChip.dataset.target = "daily-special";
    specialChip.textContent = state.config.dailySpecialTitle || "Almoço de Hoje";
    specialChip.addEventListener("click", () => {
      const section = refs.dailySpecialModule;
      if (!section.hidden) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    refs.categoryChips.appendChild(specialChip);
  }

  const allChip = document.createElement("button");
  allChip.type = "button";
  allChip.className = "category-chip";
  allChip.dataset.categoryId = "all";
  allChip.textContent = "Tudo";
  allChip.addEventListener("click", () => {
    setCategoryFilter("all");
    refs.menuStage.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  refs.categoryChips.appendChild(allChip);

  state.generatedCategories.forEach((category) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "category-chip";
    chip.dataset.categoryId = category.id;
    chip.textContent = category.title;
    chip.addEventListener("click", () => {
      setCategoryFilter(category.id);
      refs.menuStage.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    refs.categoryChips.appendChild(chip);

    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.title;
    refs.categorySelect.appendChild(option);
  });

  updateCategoryNavigation();
}

function getCategoryById(categoryId) {
  return state.generatedCategories.find((category) => category.id === categoryId) || null;
}

function buildBadges(item) {
  const badges = [];
  if (item.badge) badges.push(`<span class="badge">${item.badge}</span>`);
  if (item.promotionalPrice) badges.push('<span class="badge badge-dark">Promoção</span>');
  if (item.availability !== "available") badges.push('<span class="badge badge-danger">Indisponível</span>');
  return badges;
}

function buildMiniCard(item) {
  return `
    <article class="menu-card">
      <div class="menu-image-wrap">
        <img class="menu-image" src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="menu-badges">${buildBadges(item).join("")}</div>
      </div>
      <div class="menu-body">
        <div class="menu-copy">
          <h3 class="menu-title">${item.name}</h3>
          <p class="menu-description">${item.description}</p>
        </div>
        <div class="menu-footer">
          <div class="menu-prices">
            <span class="menu-price">${currency(item.promotionalPrice ?? item.price)}</span>
            <span class="menu-price-old" ${item.promotionalPrice ? "" : "hidden"}>${currency(item.price)}</span>
          </div>
          <a class="menu-action" href="${buildWhatsAppUrl(`Olá! Quero saber mais sobre ${item.name}.`)}" target="_blank" rel="noreferrer">Consultar</a>
        </div>
      </div>
    </article>
  `;
}

function renderDailySpecial() {
  if (!state.config.modules?.dailySpecial) {
    refs.dailySpecialModule.hidden = true;
    return;
  }

  const candidate =
    state.generatedItems.find((item) => item.dailySpecial) ||
    state.generatedItems.find((item) => item.categoryId === "executivos") ||
    state.generatedItems.find((item) => item.featured);

  if (!candidate) {
    refs.dailySpecialModule.hidden = true;
    return;
  }

  refs.dailySpecialModule.hidden = false;
  refs.dailySpecialKicker.textContent = state.config.dailySpecialSubtitle || "Rotação diária";
  refs.dailySpecialTitle.textContent = state.config.dailySpecialTitle || "Almoço de Hoje";
  refs.dailySpecialCopy.textContent =
    state.config.dailySpecialDescription ||
    "Sugestão da casa para destacar o almoço e facilitar a escolha logo no início da navegação.";

  const category = getCategoryById(candidate.categoryId);

  refs.dailySpecialCard.innerHTML = `
    <div class="daily-grid">
      <div class="special-visual">
        <img src="${candidate.image}" alt="${candidate.name}" loading="lazy">
      </div>
      <div class="special-content">
        <span class="section-kicker">${candidate.badge || "Escolha da casa"}</span>
        <h3 class="special-name">${candidate.name}</h3>
        <p class="special-copy">${candidate.description}</p>
        <div class="special-meta">
          <span class="meta-pill">${category?.title || "Destaque"}</span>
          <span class="meta-pill">Disponível no salão</span>
        </div>
        <p class="special-note">Boa escolha para quem quer decidir rápido e seguir direto para um almoço bem servido.</p>
        <div class="special-footer">
          <div class="special-price">
            <span>Hoje</span>
            <strong>${currency(candidate.promotionalPrice ?? candidate.price)}</strong>
          </div>
          <a class="primary-button" href="${buildWhatsAppUrl(`Olá! Quero saber mais sobre ${candidate.name}.`)}" target="_blank" rel="noreferrer">Consultar</a>
        </div>
      </div>
    </div>
  `;

  attachImageFallbacks(refs.dailySpecialCard);
}

function renderHighlights() {
  const blocks = [];
  const featuredItems = state.generatedItems.filter((item) => item.featured).slice(0, 3);
  const promoItems = state.generatedItems.filter((item) => item.promotionalPrice).slice(0, 3);

  if (state.config.modules?.featuredItems && featuredItems.length) {
    blocks.push({
      kicker: "Mais pedidos",
      title: "Escolhas para começar bem",
      description: "Itens com forte apelo de salão, boa leitura de mesa e giro consistente.",
      items: featuredItems
    });
  }

  if (state.config.modules?.combos && promoItems.length) {
    blocks.push({
      kicker: "Ofertas da casa",
      title: "Preços que ajudam na decisão",
      description: "Sugestões para almoço, mesa compartilhada e pedidos com melhor percepção de valor.",
      items: promoItems
    });
  }

  refs.featuredModule.hidden = blocks.length === 0;
  refs.highlightGrid.innerHTML = "";

  blocks.forEach((block) => {
    const article = document.createElement("article");
    article.className = "highlight-card";
    article.innerHTML = `
      <span class="section-kicker">${block.kicker}</span>
      <h3>${block.title}</h3>
      <p>${block.description}</p>
      <div class="mini-cards">${block.items.map(buildMiniCard).join("")}</div>
    `;
    refs.highlightGrid.appendChild(article);
  });

  attachImageFallbacks(refs.highlightGrid);
}

function itemMatchesFilters(item) {
  const searchTerm = normalize(state.filters.search);
  const matchesSearch =
    !searchTerm || normalize(`${item.name} ${item.description} ${item.badge} ${item.notes}`).includes(searchTerm);
  const matchesCategory = state.filters.category === "all" || item.categoryId === state.filters.category;
  const matchesSpecial = !state.filters.specialOnly || item.featured || SPECIAL_BADGES.has(normalize(item.badge));
  return matchesSearch && matchesCategory && matchesSpecial;
}

function buildCard(item) {
  const card = refs.cardTemplate.content.firstElementChild.cloneNode(true);
  card.classList.toggle("is-unavailable", item.availability !== "available");

  const image = card.querySelector(".menu-image");
  image.src = item.image;
  image.alt = item.name;

  card.querySelector(".menu-badges").innerHTML = buildBadges(item).join("");
  card.querySelector(".menu-title").textContent = item.name;
  card.querySelector(".menu-description").textContent = item.description;

  const category = getCategoryById(item.categoryId);
  const metaNotes = [
    category?.subtitle || "",
    item.notes || ""
  ].filter(Boolean);

  card.querySelector(".menu-meta").innerHTML = metaNotes
    .map((note) => `<span class="menu-note">${note}</span>`)
    .join("");

  card.querySelector(".menu-price").textContent = currency(item.promotionalPrice ?? item.price);

  const oldPrice = card.querySelector(".menu-price-old");
  oldPrice.hidden = !item.promotionalPrice;
  if (item.promotionalPrice) {
    oldPrice.textContent = currency(item.price);
  }

  const action = card.querySelector(".menu-action");
  action.href = buildWhatsAppUrl(`Olá! Quero saber mais sobre ${item.name}.`);
  action.textContent = item.availability === "available" ? "Consultar" : "Indisponível";

  if (item.availability !== "available") {
    action.removeAttribute("target");
    action.removeAttribute("rel");
  }

  return card;
}

function renderMenu() {
  refs.menuStage.innerHTML = "";

  const visibleCategories = state.generatedCategories
    .map((category) => ({
      ...category,
      items: state.generatedItems.filter((item) => item.categoryId === category.id && itemMatchesFilters(item))
    }))
    .filter((category) => category.items.length > 0);

  refs.emptyState.hidden = visibleCategories.length > 0;

  visibleCategories.forEach((category) => {
    const section = document.createElement("section");
    section.className = "menu-section reveal";
    section.id = `section-${category.id}`;
    section.dataset.categorySection = category.id;
    section.innerHTML = `
      <div class="menu-head">
        <span class="section-kicker">${category.subtitle || ""}</span>
        <h2>${category.title}</h2>
        <p>${category.description || ""}</p>
      </div>
      <div class="menu-grid"></div>
    `;

    const grid = section.querySelector(".menu-grid");
    category.items.forEach((item) => {
      grid.appendChild(buildCard(item));
    });

    refs.menuStage.appendChild(section);
  });

  attachImageFallbacks(refs.menuStage);
  setupRevealObserver();
}

function setupControls() {
  refs.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value;
    renderMenu();
  });

  refs.categorySelect.addEventListener("change", (event) => {
    setCategoryFilter(event.target.value);
  });

  refs.specialFilter.addEventListener("change", (event) => {
    state.filters.specialOnly = event.target.checked;
    renderMenu();
  });

  refs.resetFilters.addEventListener("click", () => {
    state.filters = {
      search: "",
      category: "all",
      specialOnly: false
    };
    refs.searchInput.value = "";
    refs.specialFilter.checked = false;
    updateCategoryNavigation();
    renderMenu();
  });
}

function attachImageFallbacks(scope = document) {
  scope.querySelectorAll("img").forEach((image) => {
    if (image.dataset.ignoreFallback === "true") return;
    image.onerror = onImageError;
  });
}

function onImageError(event) {
  event.currentTarget.src = "assets/placeholders/fallback-dish.svg";
  event.currentTarget.onerror = null;
}

function setupRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => observer.observe(element));
}

async function init() {
  try {
    await loadFiles();
    const presetKey = resolvePresetKey(state.config);
    state.preset = PRESETS[presetKey];
    state.theme = buildTheme(state.config, state.preset);

    applyTheme(state.theme);
    chooseCategories();
    generateItems();
    renderHero();
    buildCategoryNavigation();
    renderDailySpecial();
    renderHighlights();
    renderMenu();
    setupControls();
    attachImageFallbacks();
    setupRevealObserver();
  } catch (error) {
    console.error(error);
    refs.menuStage.innerHTML = `
      <section class="menu-section">
        <div class="menu-head">
          <span class="section-kicker">Erro</span>
          <h2>Não foi possível carregar o cardápio</h2>
          <p>Verifique se os arquivos do projeto estão acessíveis corretamente em hospedagem estática.</p>
        </div>
      </section>
    `;
  }
}

init();
