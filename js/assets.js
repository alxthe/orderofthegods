// =============================================================================
// ORDER OF THE GODS - ASSET LOADING SYSTEM
// =============================================================================

// Asset container object
const ASSETS = {
  ingredients: {},
  customers: {},
  ui: {},
  kitchen: {},
  cutIngredients: {},
  cookedIngredients: {},
  player: {},
  loaded: false,
  totalAssets: 0,
  loadedAssets: 0
};

// Load image helper
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ASSETS.loadedAssets++;
      console.log(`✅ Loaded: ${src} (${ASSETS.loadedAssets}/${ASSETS.totalAssets})`);
      resolve(img);
    };
    img.onerror = () => {
      ASSETS.loadedAssets++;
      console.log(`❌ Failed: ${src}`);
      reject(new Error(`Failed to load ${src}`));
    };
    img.src = src;
  });
}

// Load all assets
async function loadAssets() {
  console.log('🎨 Loading assets...');
  
  const loadPromises = [];
  
  // Count total assets
  Object.values(ASSET_FILES.ingredients).forEach(src => src && ASSETS.totalAssets++);
  Object.values(ASSET_FILES.customers).forEach(src => src && ASSETS.totalAssets++);
  Object.values(ASSET_FILES.ui).forEach(src => src && ASSETS.totalAssets++);
  Object.values(ASSET_FILES.kitchen).forEach(src => src && ASSETS.totalAssets++);
  Object.values(ASSET_FILES.cutIngredients).forEach(src => src && ASSETS.totalAssets++);
  Object.values(ASSET_FILES.cookedIngredients).forEach(src => src && ASSETS.totalAssets++);
  Object.values(ASSET_FILES.player).forEach(src => src && ASSETS.totalAssets++);
  
  // Load ingredient assets
  for (let [ingredient, src] of Object.entries(ASSET_FILES.ingredients)) {
    if (src) {
      loadPromises.push(
        loadImage(src).then(img => {
          ASSETS.ingredients[ingredient] = img;
        }).catch(() => {
          console.log(`⚠️ Using fallback for ${ingredient}`);
          ASSETS.ingredients[ingredient] = null;
        })
      );
    } else {
      ASSETS.ingredients[ingredient] = null; // Will use fallback rendering
    }
  }
  
  // Load customer assets
  for (let [customer, src] of Object.entries(ASSET_FILES.customers)) {
    if (src) {
      loadPromises.push(
        loadImage(src).then(img => {
          ASSETS.customers[customer] = img;
        }).catch(() => {
          ASSETS.customers[customer] = null;
        })
      );
    }
  }
  
  // Load UI assets
  for (let [ui, src] of Object.entries(ASSET_FILES.ui)) {
    if (src) {
      loadPromises.push(
        loadImage(src).then(img => {
          ASSETS.ui[ui] = img;
        }).catch(() => {
          ASSETS.ui[ui] = null;
        })
      );
    }
  }
  
  // Load kitchen assets (oven, etc.)
  for (let [kitchen, src] of Object.entries(ASSET_FILES.kitchen)) {
    if (src) {
      loadPromises.push(
        loadImage(src).then(img => {
          ASSETS.kitchen[kitchen] = img;
          console.log(`✅ Kitchen asset loaded: ${kitchen}`);
        }).catch(() => {
          ASSETS.kitchen[kitchen] = null;
          console.log(`❌ Kitchen asset failed: ${kitchen}`);
        })
      );
    }
  }
  
  // Load cut ingredient assets
  for (let [cutItem, src] of Object.entries(ASSET_FILES.cutIngredients)) {
    if (src) {
      loadPromises.push(
        loadImage(src).then(img => {
          ASSETS.cutIngredients[cutItem] = img;
          console.log(`✅ Cut ingredient asset loaded: ${cutItem}`);
        }).catch(() => {
          ASSETS.cutIngredients[cutItem] = null;
          console.log(`❌ Cut ingredient asset failed: ${cutItem}`);
        })
      );
    }
  }
  
  // Load cooked ingredient assets
  for (let [cookedItem, src] of Object.entries(ASSET_FILES.cookedIngredients)) {
    if (src) {
      loadPromises.push(
        loadImage(src).then(img => {
          ASSETS.cookedIngredients[cookedItem] = img;
          console.log(`✅ Cooked ingredient asset loaded: ${cookedItem}`);
        }).catch(() => {
          ASSETS.cookedIngredients[cookedItem] = null;
          console.log(`❌ Cooked ingredient asset failed: ${cookedItem}`);
        })
      );
    }
  }
  
  // Load player assets
  for (let [player, src] of Object.entries(ASSET_FILES.player)) {
    if (src) {
      loadPromises.push(
        loadImage(src).then(img => {
          ASSETS.player[player] = img;
          console.log(`✅ Player asset loaded: ${player}`);
        }).catch(() => {
          ASSETS.player[player] = null;
          console.log(`❌ Player asset failed: ${player}`);
        })
      );
    }
  }
  
  // Wait for all assets to load
  await Promise.allSettled(loadPromises);
  
  ASSETS.loaded = true;
  console.log(`🎨 Assets loaded: ${ASSETS.loadedAssets}/${ASSETS.totalAssets}`);
  
  // Debug player character loading
  if (ASSETS.player?.character) {
    console.log('✅ Player character sprite loaded successfully!');
  } else {
    console.log('❌ Player character sprite failed to load - will use fallback square');
  }
  
  return ASSETS.loaded;
}

// Global render quality optimization
function ensureRenderQuality() {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  // Ensure crisp pixel-perfect rendering
  ctx.textRenderingOptimization = 'optimizeQuality';
}

console.log("✅ Asset system initialized");
