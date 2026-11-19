const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:\\Users\\suman\\.gemini\\antigravity\\brain\\c41239b1-d7d5-4ddb-8131-a54852c90ce5';
const baseOut = path.resolve(__dirname, '..', 'public', 'assets', 'generated', 'nano-banana');

const assetDefinitions = [
  {
    id: 'ai-hero-bridal-001',
    srcName: 'svarahi_hero_banner_1795059532180.jpg',
    category: 'hero',
    destRelPath: 'hero/hero-bridal-campaign',
    aspect: '16:9',
    purpose: 'Homepage hero campaign editorial banner',
    title: 'Cinematic Bridal Silk & Gold Campaign Hero',
    alt: 'Fictional Indian model in deep maroon silk saree and ornate antique gold temple necklace arrangement with warm golden studio lighting and negative copy space on left'
  },
  {
    id: 'ai-lookbook-bridal-001',
    srcName: 'svarahi_bridal_editorial_1795059576763.jpg',
    category: 'lookbook/bridal',
    destRelPath: 'lookbook/bridal/lookbook-bridal-01',
    aspect: '3:4',
    purpose: 'Bridal styling lookbook editorial portrait',
    title: 'South Indian Temple Gold Bridal Styling',
    alt: 'Full bridal lookbook editorial featuring traditional temple gold choker, layered haram, jhumkas, and maang tikka on rich burgundy velvet'
  },
  {
    id: 'ai-lookbook-festive-001',
    srcName: 'svarahi_editorial_jewellery_lookbook_1795059580583.jpg',
    category: 'lookbook/festive',
    destRelPath: 'lookbook/festive/lookbook-festive-01',
    aspect: '3:4',
    purpose: 'Festive collection lookbook showcase',
    title: 'Contemporary Festive Gold Styling',
    alt: 'Festive Indian jewellery styling with emerald green silk saree, handcrafted gold choker, matching jhumkas, and bangles'
  },
  {
    id: 'ai-lookbook-everyday-001',
    srcName: 'svarahi_lookbook_everyday_luxury_1795059582126.jpg',
    category: 'lookbook/everyday',
    destRelPath: 'lookbook/everyday/lookbook-everyday-01',
    aspect: '3:4',
    purpose: 'Everyday fine jewellery editorial lookbook',
    title: 'Minimalist Everyday Gold Chain & Huggies',
    alt: 'Everyday quiet luxury styling with delicate layered gold chains and petite gold huggie earrings against warm ivory tones'
  },
  {
    id: 'ai-lookbook-heritage-001',
    srcName: 'svarahi_heritage_temple_jewellery_lookbook_1795059590658.jpg',
    category: 'lookbook/heritage',
    destRelPath: 'lookbook/heritage/lookbook-heritage-01',
    aspect: '3:4',
    purpose: 'Heritage & Antique collection lookbook',
    title: 'Antique Nagas Temple Gold & Cabochon Rubies',
    alt: 'Heritage antique gold choker and pendant necklace set with rubies and emeralds against carved Indian architectural backdrop'
  },
  {
    id: 'ai-lookbook-mens-001',
    srcName: 'svarahi_mens_luxury_jewellery_editorial_1795059592385.jpg',
    category: 'lookbook/mens',
    destRelPath: 'lookbook/mens/lookbook-mens-01',
    aspect: '3:4',
    purpose: 'Men’s fine jewellery styling lookbook',
    title: 'Men’s Handcrafted Gold Kada & Chain',
    alt: 'Men fine jewellery styling portrait with solid gold kada bracelet, signet ring, and tailored silk bandhgala'
  },
  {
    id: 'ai-craftsmanship-macro-001',
    srcName: 'svarahi_craftsmanship_macro_1795059596666.jpg',
    category: 'craftsmanship',
    destRelPath: 'craftsmanship/macro-craftsmanship-01',
    aspect: '3:4',
    purpose: 'Macro craftsmanship detail editorial',
    title: 'Macro Nakshi Chasing, Granulation & Gem Setting',
    alt: 'Extreme macro close-up of 22k antique gold jewellery showing delicate nakshi engraving, granulation beads, and bezel-set cabochon stones'
  },
  {
    id: 'ai-counter-stage-001',
    srcName: 'luxury_jewellery_display_stage_1795059601879.jpg',
    category: 'counter-backgrounds',
    destRelPath: 'counter-backgrounds/velvet-counter-stage-01',
    aspect: '16:9',
    purpose: 'Virtual velvet showroom counter stage for product overlay',
    title: 'Empty Velvet Counter Stage with Brass Rails',
    alt: 'Empty luxury black velvet jewellery presentation busts and brushed brass pedestals on burgundy velvet counter under warm studio spotlights'
  },
  {
    id: 'ai-showroom-concept-001',
    srcName: 'contemporary_indian_jewellery_showroom_concept_1795059607827.jpg',
    category: 'showroom-concepts',
    destRelPath: 'showroom-concepts/interior-concept-01',
    aspect: '16:9',
    purpose: 'Showroom interior design visualization concept',
    title: 'Contemporary Luxury Indian Jewellery Showroom Concept',
    alt: 'Architectural concept render of a flagship fine jewellery showroom with ivory marble, velvet vitrines, and brushed brass jaali screens'
  },
  {
    id: 'ai-campaign-cover-001',
    srcName: 'svarahi_jewellery_campaign_cover_1795059610387.jpg',
    category: 'campaign-covers',
    destRelPath: 'campaign-covers/campaign-cover-01',
    aspect: '9:16',
    purpose: 'Vertical campaign and social reel cover',
    title: 'Editorial Campaign Reel Cover',
    alt: 'Vertical luxury campaign portrait of an Indian model adorned in temple gold necklace and jhumkas on burgundy velvet background'
  },
  {
    id: 'ai-texture-oxblood-001',
    srcName: 'oxblood_velvet_texture_1795059615191.jpg',
    category: 'textures',
    destRelPath: 'textures/texture-oxblood-velvet-01',
    aspect: '1:1',
    purpose: 'Deep oxblood velvet macro texture background',
    title: 'Deep Oxblood Velvet Fabric Texture',
    alt: 'Rich deep oxblood velvet macro fabric texture with soft undulating shadows and plush pile'
  },
  {
    id: 'ai-texture-gold-001',
    srcName: 'antique_brushed_gold_texture_1795059631531.jpg',
    category: 'textures',
    destRelPath: 'textures/texture-brushed-gold-01',
    aspect: '1:1',
    purpose: 'Antique brushed gold material texture',
    title: 'Antique Brushed Gold Metallic Surface Texture',
    alt: 'Brushed antique gold metallic surface texture with fine directional grain and warm luster'
  },
  {
    id: 'ai-texture-silk-001',
    srcName: 'ivory_silk_fabric_texture_1795059649301.jpg',
    category: 'textures',
    destRelPath: 'textures/texture-ivory-silk-01',
    aspect: '1:1',
    purpose: 'Warm ivory silk fabric texture background',
    title: 'Warm Ivory Silk Fabric Drape Texture',
    alt: 'Warm ivory silk satin fabric texture with soft graceful folds and luminous sheen'
  }
];

async function run() {
  const processedManifest = [];

  for (const item of assetDefinitions) {
    const srcPath = path.join(brainDir, item.srcName);
    const destBase = path.join(baseOut, item.destRelPath);
    const destDir = path.dirname(destBase);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const meta = await sharp(srcPath).metadata();

    const escapeXml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

    // 1. Save original format (jpg) if not existing
    const jpgDest = `${destBase}.jpg`;
    if (!fs.existsSync(jpgDest)) fs.copyFileSync(srcPath, jpgDest);

    // 2. Generate optimized WebP if not existing
    const webpDest = `${destBase}.webp`;
    if (!fs.existsSync(webpDest)) {
      await sharp(srcPath).webp({ quality: 88, effort: 4 }).toFile(webpDest);
    }

    // 3. Generate optimized AVIF if not existing
    const avifDest = `${destBase}.avif`;
    if (!fs.existsSync(avifDest)) {
      await sharp(srcPath).avif({ quality: 80, effort: 4 }).toFile(avifDest);
    }

    // 4. Generate responsive 640w WebP if not existing
    const webp640Dest = `${destBase}-640.webp`;
    if (!fs.existsSync(webp640Dest)) {
      await sharp(srcPath).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 85 }).toFile(webp640Dest);
    }

    const jpgStats = fs.statSync(jpgDest);
    const webpStats = fs.statSync(webpDest);
    const avifStats = fs.statSync(avifDest);

    processedManifest.push({
      assetId: item.id,
      group: 'GROUP F — AI-GENERATED EDITORIAL CONCEPT',
      creator: 'Nano Banana (Gemini Image Generation)',
      purpose: item.purpose,
      title: item.title,
      altText: item.alt,
      dimensions: {
        width: meta.width,
        height: meta.height,
        aspectRatio: item.aspect
      },
      files: {
        original: `/assets/generated/nano-banana/${item.destRelPath}.jpg`,
        originalBytes: jpgStats.size,
        webp: `/assets/generated/nano-banana/${item.destRelPath}.webp`,
        webpBytes: webpStats.size,
        avif: `/assets/generated/nano-banana/${item.destRelPath}.avif`,
        avifBytes: avifStats.size,
        responsive640Webp: `/assets/generated/nano-banana/${item.destRelPath}-640.webp`
      },
      status: 'Needs visual approval',
      productAuthenticity: 'AI concept, not inventory (Group F)',
      locationAuthenticity: 'Not actual showroom / studio concept',
      sourcePromptFile: 'docs/ai-assets/generation-prompts.md',
      usageRestrictions: 'Website editorial backgrounds and concept storytelling only. Must not be used on product catalogue cards or represented as actual Svarahi inventory.'
    });

    console.log(`Processed: ${item.id} -> ${item.destRelPath} (JPG: ${jpgStats.size}B, WebP: ${webpStats.size}B, AVIF: ${avifStats.size}B)`);
  }

  // Save the manifest JSON data
  const manifestPath = path.resolve(__dirname, '..', 'docs', 'ai-assets', 'asset-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(processedManifest, null, 2), 'utf-8');
  console.log(`Saved manifest to ${manifestPath}`);

  // Build Visual Contact Sheet Image
  console.log('Generating visual contact sheet...');
  await generateContactSheet(processedManifest);
  console.log('Done!');
}

async function generateContactSheet(manifest) {
  // Grid: 4 columns x 4 rows
  const colCount = 4;
  const thumbWidth = 400;
  const thumbHeight = 350;
  const padding = 24;
  const rowCount = Math.ceil(manifest.length / colCount);

  const canvasWidth = padding + colCount * (thumbWidth + padding);
  const canvasHeight = padding + 120 + rowCount * (thumbHeight + padding); // 120px header

  // Generate composite cards
  const compositeList = [];

  const escapeXml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

  // Header SVG
  const headerSvg = Buffer.from(`
    <svg width="${canvasWidth}" height="100">
      <rect width="100%" height="100%" fill="#140608"/>
      <text x="${padding}" y="45" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#D4A94F">
        SVARAHI FLAGSHIP V2 — AI ASSET CONTACT SHEET
      </text>
      <text x="${padding}" y="80" font-family="Helvetica, sans-serif" font-size="14" fill="#EAD2A0">
        GROUP F: AI-GENERATED EDITORIAL CONCEPTS | NANO BANANA (STATUS: PENDING VISUAL APPROVAL)
      </text>
    </svg>
  `);

  compositeList.push({
    input: headerSvg,
    top: padding,
    left: 0
  });

  for (let i = 0; i < manifest.length; i++) {
    const item = manifest[i];
    const row = Math.floor(i / colCount);
    const col = i % colCount;

    const x = padding + col * (thumbWidth + padding);
    const y = padding + 100 + row * (thumbHeight + padding);

    const fullSrcPath = path.resolve(__dirname, '..', 'public', item.files.original.replace(/^\//, ''));

    // Resize image thumbnail inside container
    const imgThumbBuffer = await sharp(fullSrcPath)
      .resize({ width: thumbWidth, height: 260, fit: 'cover', position: 'centre' })
      .toBuffer();

    const titleText = escapeXml(item.title.length > 45 ? item.title.substring(0, 42) + '...' : item.title);
    const purposeText = escapeXml(item.purpose.length > 50 ? item.purpose.substring(0, 47) + '...' : item.purpose);
    const idText = escapeXml(`${item.assetId} [${item.dimensions.aspectRatio}]`);

    // Text card SVG
    const cardSvg = Buffer.from(`
      <svg width="${thumbWidth}" height="${thumbHeight}">
        <rect width="100%" height="100%" fill="#1E1214" stroke="#3A0C16" stroke-width="2" rx="4"/>
        <text x="12" y="280" font-family="Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#D4A94F">
          ${idText}
        </text>
        <text x="12" y="300" font-family="Helvetica, sans-serif" font-size="11" fill="#FBF6EE">
          ${titleText}
        </text>
        <text x="12" y="320" font-family="Helvetica, sans-serif" font-size="10" fill="#EAD2A0">
          ${purposeText}
        </text>
        <text x="12" y="338" font-family="Helvetica, sans-serif" font-size="9" fill="#888888">
          Group F | Nano Banana | ${Math.round(item.files.originalBytes / 1024)} KB JPG / ${Math.round(item.files.webpBytes / 1024)} KB WebP
        </text>
      </svg>
    `);

    // Place card background and image
    compositeList.push({
      input: cardSvg,
      left: x,
      top: y
    });

    compositeList.push({
      input: imgThumbBuffer,
      left: x,
      top: y
    });
  }

  // Create base background canvas
  const contactSheetPath = path.resolve(__dirname, '..', 'docs', 'ai-assets', 'visual-contact-sheet.jpg');
  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 3,
      background: { r: 20, g: 6, b: 8 } // #140608 Velvet
    }
  })
  .composite(compositeList)
  .jpeg({ quality: 90 })
  .toFile(contactSheetPath);

  // Also generate HTML contact sheet
  const htmlContactSheet = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Svarahi Flagship V2 — Visual Contact Sheet</title>
  <style>
    :root {
      --velvet: #140608;
      --oxblood: #3A0C16;
      --maroon: #5C1426;
      --gold: #D4A94F;
      --soft-gold: #EAD2A0;
      --ivory: #FBF6EE;
      --ink: #1E1214;
    }
    body {
      background-color: var(--velvet);
      color: var(--ivory);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 32px 48px;
    }
    h1 {
      color: var(--gold);
      font-family: "Cinzel", Georgia, serif;
      font-size: 2.2rem;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .subtitle {
      color: var(--soft-gold);
      font-size: 1rem;
      margin-bottom: 24px;
    }
    .badge-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    .badge {
      background: var(--oxblood);
      border: 1px solid var(--maroon);
      padding: 6px 14px;
      border-radius: 4px;
      font-size: 0.85rem;
      color: var(--soft-gold);
    }
    .badge.active {
      background: var(--maroon);
      border-color: var(--gold);
      color: var(--gold);
      font-weight: bold;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 28px;
    }
    .card {
      background: var(--ink);
      border: 1px solid #2d1419;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: var(--gold);
    }
    .card-img-wrap {
      width: 100%;
      height: 280px;
      background: #0d0405;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    .card-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .aspect-tag {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(20, 6, 8, 0.85);
      border: 1px solid var(--gold);
      color: var(--gold);
      font-size: 0.75rem;
      padding: 3px 8px;
      border-radius: 3px;
      font-weight: 600;
    }
    .card-body {
      padding: 18px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .asset-id {
      font-size: 0.75rem;
      color: var(--gold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
    }
    .asset-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--ivory);
      margin: 0;
    }
    .asset-purpose {
      font-size: 0.85rem;
      color: var(--soft-gold);
      line-height: 1.4;
      margin: 0;
    }
    .asset-meta {
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid #2d1419;
      font-size: 0.75rem;
      color: #998a8c;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .classification-tag {
      display: inline-block;
      margin-top: 4px;
      background: #3a1018;
      color: #e5b0b8;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 0.7rem;
    }
  </style>
</head>
<body>
  <h1>SVARAHI FLAGSHIP V2 — VISUAL ASSET CONTACT SHEET</h1>
  <div class="subtitle">Art Direction: Velvet &amp; Gold | AI Generation: Nano Banana 2 | Classification: Group F (Editorial Concepts)</div>

  <div class="badge-bar">
    <div class="badge active">Group F: AI Editorial Concepts (13)</div>
    <div class="badge">Approved WebP/AVIF Ready (13)</div>
    <div class="badge">Real Svarahi Assets (Pending Supply)</div>
    <div class="badge">Status: Needs Visual Approval Before Front-End Integration</div>
  </div>

  <div class="grid">
    ${manifest.map(item => `
      <div class="card">
        <div class="card-img-wrap">
          <img src="../../public${item.files.webp}" alt="${escapeXml(item.altText)}" loading="lazy">
          <span class="aspect-tag">${escapeXml(item.dimensions.aspectRatio)}</span>
        </div>
        <div class="card-body">
          <div class="asset-id">${escapeXml(item.assetId)} &bull; ${escapeXml(item.dimensions.width)}&times;${escapeXml(item.dimensions.height)}</div>
          <h2 class="asset-title">${escapeXml(item.title)}</h2>
          <p class="asset-purpose">${escapeXml(item.purpose)}</p>
          <div class="asset-meta">
            <div><strong>JPG:</strong> ${(item.files.originalBytes / 1024).toFixed(1)} KB | <strong>WebP:</strong> ${(item.files.webpBytes / 1024).toFixed(1)} KB | <strong>AVIF:</strong> ${(item.files.avifBytes / 1024).toFixed(1)} KB</div>
            <div><strong>Restrictions:</strong> Concept storytelling only &bull; Not verified inventory</div>
            <div><span class="classification-tag">GROUP F — AI CONCEPT</span></div>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  const htmlPath = path.resolve(__dirname, '..', 'docs', 'ai-assets', 'visual-contact-sheet.html');
  fs.writeFileSync(htmlPath, htmlContactSheet, 'utf-8');
  console.log(`HTML Contact sheet generated at: ${htmlPath}`);
}

run().catch(console.error);
