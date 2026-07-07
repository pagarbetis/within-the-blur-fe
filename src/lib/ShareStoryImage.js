// Pure Canvas 2D generator — produces a 1080×1920 PNG "story card" for kuis result.
// Style: clean, minimalist, readable. Uses only fonts already loaded by the site
// (Jost + IBM Plex Mono). No new font imports.

const BG_DEEP = "#0A0908";
const IVORY = "#EDE6D8";
const IVORY_SOFT = "#B8AF9B";

function hexWithAlpha(hex, a) {
  const c = hex.replace("#", "");
  const bi = parseInt(c, 16);
  const r = (bi >> 16) & 255;
  const g = (bi >> 8) & 255;
  const b = bi & 255;
  return `rgba(${r},${g},${b},${a})`;
}

function drawBlob(ctx, x, y, r, color, alpha = 0.35) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, hexWithAlpha(color, alpha));
  g.addColorStop(1, hexWithAlpha(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Generate a 1080×1920 IG Story card — minimal, clean, easy to read.
 * Uses Jost (Regular 400, Medium 500, SemiBold 600) + IBM Plex Mono only.
 * Palette follows the dominant brain accent color.
 *
 * @param {{ dominantAccent: string, archetypeAccent: string }} data
 */
export async function generateKuisStoryImage(data) {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Wait for site fonts (Manrope, IBM Plex Mono) to be fully loaded so canvas
  // doesn't fall back to a system font.
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  } catch (e) {
    console.warn("[ShareStoryImage] document.fonts.ready failed:", e);
  }

  const accent = data.dominantAccent || "#E36C49";
  const soft = data.archetypeAccent || "#E1B049";

  // 1. Base
  ctx.fillStyle = BG_DEEP;
  ctx.fillRect(0, 0, W, H);

  // 2. Two soft ambient blobs — much lighter than before for a calmer canvas
  drawBlob(ctx, W * 0.22, H * 0.14, 620, accent, 0.32);
  drawBlob(ctx, W * 0.85, H * 0.82, 640, soft, 0.24);

  // 3. Very subtle grain
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = `rgba(237,230,216,${Math.random() * 0.025})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }

  // ---- Header ----
  // Small monospace category, centered top
  ctx.fillStyle = accent;
  ctx.font = "500 26px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("K U I S   ·   H A S I L", W / 2, 170);

  // Thin divider
  ctx.strokeStyle = hexWithAlpha(IVORY, 0.14);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 60, 220);
  ctx.lineTo(W / 2 + 60, 220);
  ctx.stroke();

  // ---- HERO block ----
  // Centered stack, generous whitespace, one weight for the hero (SemiBold 600)
  // Softly tracked (via added spacing between lines) for a calm read.
  const heroTop = 780;
  const heroLineGap = 180;

  ctx.textAlign = "center";
  ctx.fillStyle = IVORY;
  // Weight: 600 (SemiBold — same weight the site uses for headings on ivory)
  ctx.font = "600 168px 'Jost', system-ui, sans-serif";

  ctx.fillText("saya", W / 2, heroTop);
  ctx.fillText("udah", W / 2, heroTop + heroLineGap);

  // "mengisi." — the period gets the dominant accent color
  const mengisi = "mengisi";
  const period = ".";
  const mengisiW = ctx.measureText(mengisi).width;
  const periodW = ctx.measureText(period).width;
  const totalW = mengisiW + periodW + 4;
  const startX = (W - totalW) / 2;

  ctx.textAlign = "left";
  ctx.fillStyle = IVORY;
  ctx.fillText(mengisi, startX, heroTop + heroLineGap * 2);
  ctx.fillStyle = accent;
  ctx.fillText(period, startX + mengisiW + 4, heroTop + heroLineGap * 2);

  // ---- Sub-hero ----
  // A single quiet line of body copy. Regular weight for readability.
  ctx.textAlign = "center";
  ctx.fillStyle = hexWithAlpha(IVORY, 0.72);
  ctx.font = "400 34px 'Manrope', system-ui, sans-serif";
  ctx.fillText("kenali sisi dominanmu hari ini.", W / 2, heroTop + heroLineGap * 2 + 130);

  // ---- Footer block ----
  ctx.fillStyle = IVORY_SOFT;
  ctx.font = "500 22px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("W I T H I N   T H E   B L U R", W / 2, 1865);

  return canvas.toDataURL("image/png");
}

/**
 * Trigger a download of a data URL.
 */
export function downloadDataUrl(dataUrl, filename = "within-the-blur-story.png") {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
