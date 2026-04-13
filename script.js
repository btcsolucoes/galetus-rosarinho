const PRESETS = {
  premium_cafe: {
    label: "Premium Cafe",
    keywords: ["cafe", "cafeteria", "brunch", "minimalista"],
    colors: { primary: "#5A3427", secondary: "#F7F0E8", accent: "#D6A36A" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { heroLayout: "1fr 1fr", heroAlign: "left", maxWidth: "1160px" },
    banner: "assets/placeholders/banner-cafe.svg"
  },
  regional_rustico: {
    label: "Regional Rustico",
    keywords: ["regional", "rustico", "madeira", "pedra", "sofisticado", "quente"],
    colors: { primary: "#7A151A", secondary: "#F4EDE6", accent: "#EDE7DF" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { heroLayout: "1.08fr .92fr", heroAlign: "left", maxWidth: "1200px" },
    banner: "assets/placeholders/banner-rustic.svg"
  },
  casual_moderno: {
    label: "Casual Moderno",
    keywords: ["casual", "moderno", "urbano", "leve"],
    colors: { primary: "#20313D", secondary: "#F4F7F8", accent: "#F3B55E" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { heroLayout: "1fr 1fr", heroAlign: "left", maxWidth: "1160px" },
    banner: "assets/placeholders/banner-modern.svg"
  },
  hamburgueria_escura: {
    label: "Hamburgueria Escura",
    keywords: ["hamburgueria", "burger", "escuro", "industrial", "intenso"],
    colors: { primary: "#181312", secondary: "#F4EEE8", accent: "#C93F2C" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { heroLayout: "1fr 1fr", heroAlign: "left", maxWidth: "1180px" },
    banner: "assets/placeholders/banner-dark.svg"
  },
  executivo_clean: {
    label: "Executivo Clean",
    keywords: ["executivo", "almoco", "clean", "corporativo"],
    colors: { primary: "#2A473E", secondary: "#F4F5F0", accent: "#C9A869" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { heroLayout: "1fr .95fr", heroAlign: "left", maxWidth: "1140px" },
    banner: "assets/placeholders/banner-clean.svg"
  },
  tropical_praia: {
    label: "Tropical Praia",
    keywords: ["praia", "tropical", "leve", "solar"],
    colors: { primary: "#156B65", secondary: "#F4F3E9", accent: "#F2B861" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { heroLayout: "1fr 1fr", heroAlign: "left", maxWidth: "1180px" },
    banner: "assets/placeholders/banner-tropical.svg"
  },
  doceria_delicada: {
    label: "Doceria Delicada",
    keywords: ["doce", "doceria", "delicado", "sobremesa"],
    colors: { primary: "#8B4B5E", secondary: "#FBF1F4", accent: "#E9C16C" },
    fonts: { heading: '"Cormorant Garamond"', body: '"Bricolage Grotesque"' },
    tokens: { heroLayout: "1fr 1fr", heroAlign: "left", maxWidth: "1120px" },
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
  presetLabel: document.querySelector("#preset-label"),
  heroCardTitle: document.querySelector("#hero-card-title"),
  heroCardCopy: document.querySelector("#hero-card-copy"),
  heroBanner: document.querySelector("#hero-banner"),
  categoryChips: document.querySelector("#category-chips"),
  categorySelect: document.querySelector("#category-select"),
  searchInput: document.querySelector("#search-input"),
  specialFilter: document.querySelector("#special-filter"),
  dailySpecialModule: document.querySelector("#daily-special-module"),
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
const normalize = (value) =>
  sanitize(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const currency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value));

const isSpecialItem = (item) =>
  item.featured ||
  item.dailySpecial ||
  ["especial", "mais pedido", "prato do dia", "destaque", "combo", "novidade", "regional"].includes(normalize(item.badge));

async function loadFiles() {
  const [configResponse, templateResponse] = await Promise.all([
    fetch("restaurant.config.json", { cache: "no-store" }),
    fetch("menu.template.json", { cache: "no-store" })
  ]);

  if (!configResponse.ok || !templateResponse.ok) {
    throw new Error("Nao foi possivel carregar os arquivos do cardapio.");
  }

  state.config = await configResponse.json();
  state.templateData = await templateResponse.json();
}

function inferWhatsAppDigits(config) {
  const raw = config.whatsapp || config.phone || "";
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
  const rawTypes = Array.isArray(config.restaurantType) ? config.restaurantType : [config.restaurantType];
  const context = normalize([
    ...rawTypes,
    ...(config.operationMode || []),
    config.visualReference,
    config.tagline,
    config.preferredStyle,
    config.restaurantName
  ].join(" "));

  const explicit = normalize(config.preferredStyle);
  if (explicit && explicit !== "auto") {
    const directMatch = Object.keys(PRESETS).find((key) => normalize(key) === explicit);
    if (directMatch) return directMatch;
    if (explicit.includes("regional")) return "regional_rustico";
    if (explicit.includes("burger")) return "hamburgueria_escura";
    if (explicit.includes("executivo")) return "executivo_clean";
    if (explicit.includes("tropical")) return "tropical_praia";
  }

  const ranked = Object.entries(PRESETS)
    .map(([key, preset]) => {
      const score = preset.keywords.reduce(
        (total, keyword) => total + (context.includes(normalize(keyword)) ? 1 : 0),
        0
      );
      return { key, score };
    })
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score > 0 ? ranked[0].key : "casual_moderno";
}

function buildTheme(config, preset) {
  return {
    primary: config.preferredPalette?.primary || preset.colors.primary,
    secondary: config.preferredPalette?.secondary || preset.colors.secondary,
    accent: config.preferredPalette?.accent || preset.colors.accent,
    headingFont: preset.fonts.heading,
    bodyFont: preset.fonts.body,
    heroAlign: preset.tokens.heroAlign,
    heroLayout: preset.tokens.heroLayout,
    maxWidth: preset.tokens.maxWidth,
    banner: config.bannerImage || preset.banner || "assets/placeholders/banner-generic.svg"
  };
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--secondary", theme.secondary);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--font-heading", theme.headingFont);
  root.style.setProperty("--font-body", theme.bodyFont);
  root.style.setProperty("--hero-align", theme.heroAlign);
  root.style.setProperty("--hero-layout", theme.heroLayout);
  root.style.setProperty("--max-width", theme.maxWidth);
}

function buildAutoDescription(config) {
  const types = (config.restaurantType || []).join(", ");
  return `${config.restaurantName} combina ${types} em um salao pensado para almoco, encontros em familia e chope gelado com atmosfera marcante.`;
}

function buildCommercialHook(config) {
  const reference = normalize(config.visualReference);
  if (reference.includes("jogo") || reference.includes("chopp")) {
    return "Um salao para almoco pos-trabalho, pizza em familia e chope gelado nos dias de jogo.";
  }
  return "Sabores de salao com leitura direta, clima marcante e navegacao simples no cardapio.";
}

function buildLink(label, href, className) {
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

function formatOperationMode(mode) {
  const map = {
    salao: "Salao",
    delivery: "Delivery",
    retirada: "Retirada"
  };
  return map[normalize(mode)] || sanitize(mode);
}

function renderHero() {
  const { config, preset, theme } = state;
  const whatsappDigits = inferWhatsAppDigits(config);
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(`Ola! Quero saber mais sobre o cardapio do ${config.restaurantName}.`)}`
    : "#";

  if (config.logoImage) {
    refs.brandMark.innerHTML = `<img src="${config.logoImage}" alt="Logo ${config.restaurantName}" loading="eager">`;
    attachImageFallbacks(refs.brandMark);
  } else {
    refs.brandMark.textContent = config.restaurantName.slice(0, 2).toUpperCase();
  }

  refs.heroKicker.textContent = "Rosarinho • Recife";
  refs.restaurantName.textContent = config.restaurantName;
  refs.restaurantTagline.textContent = config.tagline || `${config.restaurantName} • Grill e Pizza`;
  refs.restaurantDescription.textContent = config.description || buildAutoDescription(config);
  refs.restaurantAddress.textContent = config.address || "Endereco nao informado";
  refs.restaurantContact.textContent = config.phone || "Contato nao informado";
  refs.presetLabel.textContent = "Galetus";
  refs.heroCardTitle.textContent = `${config.restaurantName} para almoco, pizza e chope.`;
  refs.heroCardCopy.textContent = buildCommercialHook(config);
  refs.heroBanner.src = theme.banner;
  refs.heroBanner.alt = `${config.restaurantName} Rosarinho`;
  refs.heroBanner.onerror = onImageError;

  refs.heroActions.innerHTML = "";
  if (whatsappDigits) {
    refs.heroActions.appendChild(buildLink("Falar no WhatsApp", whatsappUrl, "primary-button"));
  }
  refs.heroActions.appendChild(buildLink("Ver cardapio", "#menu-stage", "secondary-button"));

  refs.operationBadges.innerHTML = "";
  const badges = [
    ...(config.operationMode || []).map(formatOperationMode),
    config.instagram ? "Instagram ativo" : "",
    config.modules?.dailySpecial ? "Rotacao diaria" : ""
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
  refs.footerWhatsapp.href = whatsappUrl;
  refs.footerWhatsapp.hidden = !whatsappDigits;

  const instagramUrl = buildInstagramUrl(config.instagram);
  refs.footerInstagram.href = instagramUrl || "#";
  refs.footerInstagram.hidden = !instagramUrl;
  refs.footerCopy.textContent = `${config.restaurantName} • ${config.tagline || "Grill e Pizza"} • Rosarinho, Recife.`;
  refs.qrstackSignature.hidden = !config.modules?.qrStackSignature;
}

function chooseCategories() {
  const { config, templateData } = state;
  const context = normalize([
    config.tagline,
    config.visualReference,
    config.restaurantName,
    ...(config.restaurantType || []),
    ...(config.operationMode || [])
  ].join(" "));

  const selected = templateData.categoryBlueprints
    .map((blueprint) => {
      const triggerScore = blueprint.triggers.reduce(
        (score, trigger) => score + (context.includes(normalize(trigger)) ? 1 : 0),
        0
      );
      return { ...blueprint, triggerScore };
    })
    .filter((blueprint) => blueprint.triggerScore > 0 || ["petiscos", "bebidas", "sobremesas"].includes(blueprint.id))
    .sort((a, b) => {
      if (a.triggerScore === b.triggerScore) return a.order - b.order;
      return b.triggerScore - a.triggerScore;
    });

  const unique = [];
  const seen = new Set();
  selected.forEach((category) => {
    if (!seen.has(category.id)) {
      unique.push(category);
      seen.add(category.id);
    }
  });

  state.generatedCategories = unique
    .sort((a, b) => a.order - b.order)
    .slice(0, 8);
}

function generateItems() {
  const { config, templateData, generatedCategories } = state;
  let imageIndex = 0;
  const items = [];

  generatedCategories.forEach((category, categoryIndex) => {
    const blueprints = templateData.itemBlueprints[category.id] || [];
    blueprints.forEach((blueprint, itemIndex) => {
      const image = PLACEHOLDER_IMAGES[imageIndex % PLACEHOLDER_IMAGES.length];
      imageIndex += 1;
      const basePrice = blueprint[2];
      const promo = itemIndex === 0 && categoryIndex % 2 === 0 ? Math.max(basePrice - 4, 8) : null;
      const badge = blueprint[3] || "";
      const isUnavailable = category.id === "burgers" && itemIndex === 2;
      const dailySpecial = config.modules?.dailySpecial && category.id === "executivos" && itemIndex === 0;
      items.push({
        id: `${category.id}-${itemIndex + 1}`,
        name: blueprint[0],
        description: blueprint[1],
        price: basePrice,
        promotionalPrice: promo,
        badge,
        image,
        availability: isUnavailable ? "unavailable" : "available",
        featured: itemIndex === 0 || ["Mais pedido", "Especial", "Prato do dia", "Destaque", "Regional"].includes(blueprint[3]),
        dailySpecial,
        notes: "Selecao inicial da casa.",
        categoryId: category.id
      });
    });
  });

  state.generatedItems = items;
}

function buildCategoryNavigation() {
  refs.categoryChips.innerHTML = "";
  refs.categorySelect.innerHTML = '<option value="all">Todas as categorias</option>';

  state.generatedCategories.forEach((category) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "category-chip";
    chip.dataset.categoryId = category.id;
    chip.textContent = category.title;
    chip.addEventListener("click", () => {
      const section = document.querySelector(`[data-category-section="${category.id}"]`);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    refs.categoryChips.appendChild(chip);

    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.title;
    refs.categorySelect.appendChild(option);
  });
}

function getCategoryTitle(categoryId) {
  return state.generatedCategories.find((category) => category.id === categoryId)?.title || "";
}

function buildLinkMarkup(itemName) {
  const digits = inferWhatsAppDigits(state.config);
  if (!digits) return "";
  const url = `https://wa.me/${digits}?text=${encodeURIComponent(`Ola! Quero saber mais sobre o item "${itemName}" do ${state.config.restaurantName}.`)}`;
  return `<a class="primary-button" href="${url}" target="_blank" rel="noreferrer">Consultar item</a>`;
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
  refs.dailySpecialTitle.textContent = normalize((state.config.restaurantType || []).join(" ")).includes("executivo")
    ? "Almoco de Hoje"
    : "Especial do Dia";
  refs.dailySpecialCopy.textContent = "Selecao do dia com destaque para almoco, assinatura da casa e maior giro da operacao.";

  refs.dailySpecialCard.innerHTML = `
    <div class="daily-grid">
      <div class="special-visual">
        <img src="${candidate.image}" alt="${candidate.name}" loading="lazy">
      </div>
      <div class="special-content">
        <span class="section-kicker">${candidate.badge || "Casa recomenda"}</span>
        <h3 class="special-name">${candidate.name}</h3>
        <p class="special-copy">${candidate.description}</p>
        <div class="special-meta">
          <span class="meta-pill">${getCategoryTitle(candidate.categoryId)}</span>
          <span class="meta-pill">Rotacao diaria</span>
        </div>
        <p class="special-note">Escolha do dia para puxar o almoco, destacar a casa e orientar a decisao logo na primeira dobra.</p>
        <div class="special-footer">
          <div class="special-price">
            <span>Hoje</span>
            <strong>${currency(candidate.promotionalPrice ?? candidate.price)}</strong>
          </div>
          ${buildLinkMarkup(candidate.name)}
        </div>
      </div>
    </div>
  `;

  attachImageFallbacks(refs.dailySpecialCard);
}

function renderHighlights() {
  if (!state.config.modules?.featuredItems && !state.config.modules?.combos) {
    refs.featuredModule.hidden = true;
    return;
  }

  const featuredItems = state.generatedItems.filter((item) => item.featured).slice(0, 4);
  const promoItems = state.generatedItems.filter((item) => item.promotionalPrice).slice(0, 4);
  const blocks = [];

  if (state.config.modules?.featuredItems && featuredItems.length) {
    blocks.push({
      kicker: "Mais pedidos",
      title: "Escolhas para comecar bem",
      description: "Itens com alta saida, boa leitura de mesa e forca para abrir o pedido.",
      items: featuredItems
    });
  }

  if (state.config.modules?.combos && promoItems.length) {
    blocks.push({
      kicker: "Combos e promocoes",
      title: "Precos para compartilhar",
      description: "Selecao com precos estrategicos para grupos, dias de jogo e pedidos de maior volume.",
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

function buildMiniCard(item) {
  return `
    <article class="menu-card">
      <div class="menu-image-wrap">
        <img class="menu-image" src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="menu-badges">${buildBadges(item).join("")}</div>
      </div>
      <div class="menu-body">
        <div class="menu-copy">
          <h4 class="menu-title">${item.name}</h4>
          <p class="menu-description">${item.description}</p>
        </div>
        <div class="menu-footer">
          <div class="menu-prices">
            <span class="menu-price">${currency(item.promotionalPrice ?? item.price)}</span>
            <span class="menu-price-old" ${item.promotionalPrice ? "" : "hidden"}>${currency(item.price)}</span>
          </div>
          ${buildLinkMarkup(item.name)}
        </div>
      </div>
    </article>
  `;
}

function buildBadges(item) {
  const badges = [];
  if (item.badge) badges.push(`<span class="badge">${item.badge}</span>`);
  if (item.featured) badges.push('<span class="badge badge-dark">Destaque</span>');
  if (item.availability === "unavailable") badges.push('<span class="badge badge-danger">Indisponivel</span>');
  return badges;
}

function getFilteredItems() {
  return state.generatedItems.filter((item) => {
    const matchesSearch =
      !state.filters.search ||
      normalize(`${item.name} ${item.description} ${item.badge}`).includes(normalize(state.filters.search));
    const matchesCategory = state.filters.category === "all" || item.categoryId === state.filters.category;
    const matchesSpecial = !state.filters.specialOnly || isSpecialItem(item);
    return matchesSearch && matchesCategory && matchesSpecial;
  });
}

function renderMenu() {
  const items = getFilteredItems();
  refs.menuStage.innerHTML = "";

  const blocks = state.generatedCategories
    .map((category) => ({
      ...category,
      items: items.filter((item) => item.categoryId === category.id)
    }))
    .filter((category) => category.items.length > 0);

  refs.emptyState.hidden = blocks.length > 0;

  blocks.forEach((category) => {
    const section = document.createElement("section");
    section.className = "menu-section reveal";
    section.dataset.categorySection = category.id;
    section.id = `section-${category.id}`;
    section.innerHTML = `
      <div class="menu-head">
        <span class="section-kicker">${category.subtitle}</span>
        <h2>${category.title}</h2>
        <p>${category.description}</p>
      </div>
      <div class="menu-grid"></div>
    `;
    const grid = section.querySelector(".menu-grid");
    category.items.forEach((item) => grid.appendChild(buildCard(item)));
    refs.menuStage.appendChild(section);
  });

  attachImageFallbacks(refs.menuStage);
  setupRevealObserver();
  setupCategorySpy();
}

function buildCard(item) {
  const card = refs.cardTemplate.content.firstElementChild.cloneNode(true);
  card.classList.toggle("is-unavailable", item.availability === "unavailable");

  const image = card.querySelector(".menu-image");
  image.src = item.image;
  image.alt = item.name;
  image.onerror = onImageError;

  card.querySelector(".menu-badges").innerHTML = buildBadges(item).join("");
  card.querySelector(".menu-title").textContent = item.name;
  card.querySelector(".menu-description").textContent = item.description;
  card.querySelector(".menu-meta").innerHTML = `
    <span class="menu-note">${getCategoryTitle(item.categoryId)}</span>
    <span class="menu-note">${item.notes}</span>
  `;

  card.querySelector(".menu-price").textContent = currency(item.promotionalPrice ?? item.price);
  const old = card.querySelector(".menu-price-old");
  old.hidden = !item.promotionalPrice;
  if (item.promotionalPrice) old.textContent = currency(item.price);

  const action = card.querySelector(".menu-action");
  if (item.availability === "unavailable") {
    action.textContent = "Indisponivel";
    action.href = "#";
  } else {
    action.textContent = state.config.operationMode?.includes("salao") ? "Consultar" : "Pedir";
    action.href = buildWhatsAppItemUrl(item.name);
  }

  return card;
}

function buildWhatsAppItemUrl(itemName) {
  const digits = inferWhatsAppDigits(state.config);
  if (!digits) return "#";
  return `https://wa.me/${digits}?text=${encodeURIComponent(`Ola! Quero saber mais sobre "${itemName}" do ${state.config.restaurantName}.`)}`;
}

function setupControls() {
  refs.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value;
    renderMenu();
  });

  refs.categorySelect.addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    renderMenu();
  });

  refs.specialFilter.addEventListener("change", (event) => {
    state.filters.specialOnly = event.target.checked;
    renderMenu();
  });

  refs.resetFilters.addEventListener("click", () => {
    state.filters = { search: "", category: "all", specialOnly: false };
    refs.searchInput.value = "";
    refs.categorySelect.value = "all";
    refs.specialFilter.checked = false;
    renderMenu();
  });
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

function setupCategorySpy() {
  const sections = [...document.querySelectorAll("[data-category-section]")];
  const chips = [...document.querySelectorAll(".category-chip")];
  if (!sections.length || !chips.length) return;

  const setActive = (id) => {
    chips.forEach((chip) => chip.classList.toggle("is-active", chip.dataset.categoryId === id));
    const active = chips.find((chip) => chip.dataset.categoryId === id);
    if (active) active.scrollIntoView({ inline: "center", block: "nearest" });
  };

  const observer = new IntersectionObserver((entries) => {
    const best = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (best) setActive(best.target.dataset.categorySection);
  }, {
    rootMargin: "-18% 0px -62% 0px",
    threshold: [0.2, 0.45, 0.7]
  });

  sections.forEach((section) => observer.observe(section));
  setActive(sections[0].dataset.categorySection);
}

function attachImageFallbacks(scope = document) {
  scope.querySelectorAll("img").forEach((image) => {
    image.onerror = onImageError;
  });
}

function onImageError(event) {
  event.currentTarget.src = "assets/placeholders/fallback-dish.svg";
  event.currentTarget.onerror = null;
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
          <h2>Nao foi possivel carregar o cardapio</h2>
          <p>Verifique se o site esta sendo servido por HTTP e se os arquivos JSON estao acessiveis.</p>
        </div>
      </section>
    `;
  }
}

init();
