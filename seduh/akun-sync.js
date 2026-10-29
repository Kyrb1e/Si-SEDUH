/* Si SEDUH · akun & sinkronisasi (Supabase Auth + Postgres + Realtime).
   SDK dimuat malas (lazy): pengunjung tanpa akun tidak mengunduhnya sama sekali. */
const SB_SDK = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";

/* Config dibaca dari supabase-config.js (satu folder dengan index.html).
   Kalau file itu belum ada, aplikasi tetap jalan tanpa akun & sinkronisasi. */
let cfg = { url: "ISI_URL", anonKey: "ISI_ANON_KEY" };
try { const m = await import("./supabase-config.js"); if (m && m.supabaseConfig) cfg = m.supabaseConfig; } catch (e) { /* belum dikonfigurasi */ }

const SKIP = [];
const QUIET = ["seduh.on", "seduh.vol", "seduh.track", "seduh.mute", "seduh.music"];
const MARK = "sdh.session";
const PUSH_DELAY = 1500;
const TABLE = "user_data";
const IN_APP = /FBAN|FBAV|Instagram|Line\/|MicroMessenger|TikTok|; wv\)/i.test(navigator.userAgent);

const S = window.SeduhSync;
const $ = id => document.getElementById(id);
const btn = $("acctBtn"), bar = $("syncBar");
const configured = !!cfg.url && !!cfg.anonKey && !String(cfg.url).startsWith("ISI_") && !String(cfg.anonKey).startsWith("ISI_");
const hasSession = () => { try { return localStorage.getItem(MARK) === "1"; } catch (e) { return false; } };
const setSession = on => { try { on ? localStorage.setItem(MARK, "1") : localStorage.removeItem(MARK); } catch (e) {} };

let sb = null, booting = null, channel = null;
let uid = null, user = null, timer = null, lastJson = "", first = true, status = "";

const sorted = o => Object.keys(o).sort().reduce((a, k) => (a[k] = o[k], a), {});
const toJson = o => JSON.stringify(sorted(o));
const mineOnly = o => Object.keys(o).filter(k => !SKIP.includes(k)).reduce((a, k) => (a[k] = o[k], a), {});
const local = () => mineOnly(S.snapshot());
const nameOf = u => (u && u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || "";

function paint(state, text) {
  status = text || status;
  btn.className = state || (uid ? "on" : "");
  btn.querySelector(".t").textContent = uid ? (nameOf(user) || user.email || "Akun") : "Masuk";
  btn.title = uid ? status : "Masuk untuk menyimpan data ke akun";
  renderPage();
}

/* ---------- muat SDK hanya saat dibutuhkan ---------- */
function boot() {
  if (!configured) return Promise.resolve(false);
  if (booting) return booting;
  booting = (async () => {
    try {
      const { createClient } = await import(SB_SDK);
      /* PKCE: login Google kembali lewat ?code=..., sehingga tidak bentrok dengan router #/ milik aplikasi */
      sb = createClient(cfg.url, cfg.anonKey, { auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true, autoRefreshToken: true } });
      sb.auth.onAuthStateChange((event, session) => {
        /* jangan await panggilan Supabase di dalam callback ini (bisa deadlock) */
        setTimeout(() => {
          if (event === "PASSWORD_RECOVERY") { newPassword(); return; }
          const u = session ? session.user : null;
          if (u && uid === u.id && event !== "USER_UPDATED") return;      // token refresh: abaikan
          stopListen();
          user = u; uid = u ? u.id : null; lastJson = "";
          setSession(!!u);
          paint(uid ? "busy" : "", uid ? "Menyinkronkan…" : "");
          if (uid) listen();
        }, 0);
      });
      return true;
    } catch (e) {
      console.error("Supabase gagal dimuat", e); booting = null; paint("err", "Layanan akun gagal dimuat");
      return false;
    }
  })();
  return booting;
}
async function newPassword() {
  const p = prompt("Masukkan kata sandi baru (minimal 6 karakter):");
  if (!p) return;
  const { error } = await sb.auth.updateUser({ password: p });
  alert(error ? msg(error) : "Kata sandi berhasil diganti.");
}

/* ---------- kirim ke Postgres (debounce) ---------- */
async function push() {
  if (!uid || !sb) return;
  const data = local(), j = toJson(data);
  if (j === lastJson) { paint("on", "Tersinkron ✓"); return; }
  const payload = JSON.stringify(data);
  if (payload.length > 900000) { paint("err", "Data terlalu besar untuk disimpan"); return; }
  const { error } = await sb.from(TABLE).upsert({ user_id: uid, json: payload, updated_at: new Date().toISOString() });
  if (error) { console.error(error); paint("err", "Gagal menyimpan — akan dicoba lagi"); return; }
  lastJson = j; paint("on", "Tersimpan ✓");
}
S.onLocalChange = () => {
  if (!uid) return;
  paint("busy", "Menyimpan…");
  clearTimeout(timer); timer = setTimeout(() => { timer = null; push(); }, PUSH_DELAY);
};
const flush = () => { if (uid && timer) { clearTimeout(timer); timer = null; push(); } };
addEventListener("online", () => { if (uid) push(); });
addEventListener("pagehide", flush);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });

/* ---------- terima dari Postgres (real-time) ---------- */
function mergeFirst(loc, rem) {
  const m = Object.assign({}, loc, rem);                       // akun menang…
  try {                                                        // …kecuali favorit: gabungkan keduanya
    const a = JSON.parse(loc["seduh.favs"] || "[]"), b = JSON.parse(rem["seduh.favs"] || "[]");
    if (a.length || b.length) m["seduh.favs"] = JSON.stringify([...new Set([...b, ...a].map(String))]);
  } catch (e) {}
  try {                                                        // …skor terbaik Barista Lab: ambil yang tertinggi per beans
    const a = JSON.parse(loc["seduh.lab"] || "{}").best || {}, b = JSON.parse(rem["seduh.lab"] || "{}").best || {}, best = Object.assign({}, b);
    Object.keys(a).forEach(k => { best[k] = Math.max(+a[k] || 0, +best[k] || 0); });
    if (Object.keys(best).length) m["seduh.lab"] = JSON.stringify({ best });
  } catch (e) {}
  try {                                                        // …kafe hasil impor: gabungkan berdasarkan nama
    const a = JSON.parse(loc["seduh.imp"] || "[]"), b = JSON.parse(rem["seduh.imp"] || "[]"), seen = new Set(b.map(r => String(r.name).trim().toLowerCase()));
    const extra = a.filter(r => !seen.has(String(r.name).trim().toLowerCase()));
    if (extra.length) m["seduh.imp"] = JSON.stringify(b.concat(extra).slice(-3000));
  } catch (e) {}
  return m;
}
function applyToLocal(data) {
  Object.keys(data).forEach(k => { if (!SKIP.includes(k)) S.set(k, data[k]); });
  Object.keys(local()).forEach(k => { if (!(k in data)) S.remove(k); });
}
const parseRow = row => { try { return mineOnly(JSON.parse((row && row.json) || "{}")); } catch (e) { return {}; } };
function stopListen() { if (channel && sb) { sb.removeChannel(channel); } channel = null; }

async function initialSync(myUid) {
  const { data: row, error } = await sb.from(TABLE).select("json").eq("user_id", myUid).maybeSingle();
  if (myUid !== uid) return;                                   // sudah ganti akun / keluar
  if (error) { console.error(error); paint("err", "Tidak bisa terhubung ke database"); return; }
  const loc = local(), rem = parseRow(row);
  const merged = row ? mergeFirst(loc, rem) : loc;
  const changedHere = toJson(merged) !== toJson(loc);
  applyToLocal(merged); lastJson = toJson(rem);
  if (toJson(merged) !== toJson(rem)) await push(); else paint("on", "Tersinkron ✓");
  if (changedHere) {
    const k = "seduh.reloadedAt", t = +sessionStorage.getItem(k) || 0;
    if (Date.now() - t > 8000) { sessionStorage.setItem(k, Date.now()); location.reload(); }
  }
}
function onRemote(row) {
  const loc = local(), rem = parseRow(row);
  if (toJson(rem) === toJson(loc)) { lastJson = toJson(rem); paint("on", "Tersinkron ✓"); return; }
  const changed = new Set([...Object.keys(rem), ...Object.keys(loc)].filter(k => rem[k] !== loc[k]));
  applyToLocal(rem); lastJson = toJson(rem); paint("on", "Diperbarui dari perangkat lain");
  if ([...changed].some(k => !QUIET.includes(k))) bar.classList.add("show");
}
function listen() {
  first = true;
  const me = uid;
  initialSync(me).then(() => {
    if (me !== uid) return;
    channel = sb.channel("ud-" + me)
      .on("postgres_changes", { event: "*", schema: "public", table: TABLE, filter: "user_id=eq." + me },
          p => { if (p.new && p.new.json !== undefined) onRemote(p.new); })
      .subscribe(st => { if (st === "CHANNEL_ERROR") paint("err", "Realtime terputus"); });
  });
}
$("syncReload").onclick = () => location.reload();
$("syncLater").onclick = () => bar.classList.remove("show");

/* ---------- halaman login (#/login) ---------- */
function msg(e) {
  const t = String((e && e.message) || e || "");
  if (/invalid login credentials/i.test(t)) return "Email atau kata sandi salah.";
  if (/already registered|already been registered/i.test(t)) return "Email sudah terdaftar — coba Masuk.";
  if (/at least \d+ char/i.test(t)) return "Kata sandi minimal 6 karakter.";
  if (/valid email|invalid email|unable to validate email/i.test(t)) return "Format email tidak valid.";
  if (/email not confirmed/i.test(t)) return "Email belum dikonfirmasi — cek kotak masuk.";
  if (/rate limit|too many/i.test(t)) return "Terlalu banyak percobaan, coba lagi nanti.";
  if (/provider is not enabled|unsupported provider/i.test(t)) return "Login Google belum diaktifkan di Supabase (Authentication → Providers).";
  if (/failed to fetch|network/i.test(t)) return "Koneksi bermasalah.";
  return t || "Terjadi kesalahan, coba lagi.";
}
const say = (t, ok) => { const m = $("acctMsg"); if (m) { m.textContent = t; m.className = "lg-msg" + (ok ? " ok" : ""); } };
const fOut = $("lgOut"), fIn = $("lgIn"), form = $("lgForm");
const goHome = () => { location.hash = "#/hub"; };
let mode = "in";

function setMode(m) {
  mode = m;
  $("tabIn").setAttribute("aria-selected", m === "in"); $("tabUp").setAttribute("aria-selected", m === "up");
  $("goBtn").textContent = m === "in" ? "Masuk" : "Buat akun";
  $("pw").autocomplete = m === "in" ? "current-password" : "new-password";
  $("rsBtn").hidden = m !== "in"; say("");
}
function renderPage() {
  $("lgCfg").hidden = configured;
  fOut.hidden = !!uid; fIn.hidden = !uid;
  if (uid) { $("lgName").textContent = nameOf(user) || "Tanpa nama"; $("lgMail").textContent = user.email || ""; $("lgStat").textContent = status || "Tersinkron ✓"; }
}
/* fn mengembalikan teks jika perlu ditampilkan (mis. "cek email") dan tidak langsung pindah halaman */
async function run(fn) {
  if (!configured) return say("Supabase belum dikonfigurasi.");
  if (!sb) { boot(); return say("Memuat layanan login… coba lagi sebentar.", true); }
  const bs = [$("gBtn"), $("goBtn")]; bs.forEach(b => b.disabled = true); say("Memproses…", true);
  try { const note = await fn(); if (note) say(note, true); else { say(""); goHome(); } }
  catch (e) { say(msg(e)); }
  bs.forEach(b => b.disabled = false);
}
$("tabIn").onclick = () => setMode("in");
$("tabUp").onclick = () => setMode("up");
$("gBtn").onclick = () => {
  if (IN_APP) return say("Login Google tidak jalan di browser dalam aplikasi. Buka halaman ini di Chrome/Safari, atau pakai email.");
  run(async () => {
    const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname } });
    if (error) throw error;
    return "Mengalihkan ke Google…";
  });
};
form.onsubmit = e => {
  e.preventDefault();
  const em = $("em").value.trim(), pw = $("pw").value;
  run(async () => {
    if (mode === "in") {
      const { error } = await sb.auth.signInWithPassword({ email: em, password: pw });
      if (error) throw error;
      return "";
    }
    const { data, error } = await sb.auth.signUp({ email: em, password: pw, options: { emailRedirectTo: location.origin + location.pathname } });
    if (error) throw error;
    return data.session ? "" : "Akun dibuat. Cek email kamu untuk konfirmasi, lalu Masuk.";
  });
};
$("rsBtn").onclick = async () => {
  if (!configured) return say("Supabase belum dikonfigurasi.");
  if (!sb) { boot(); return say("Memuat layanan login… coba lagi sebentar.", true); }
  const e = $("em").value.trim(); if (!e) return say("Isi email dulu.");
  const { error } = await sb.auth.resetPasswordForEmail(e, { redirectTo: location.origin + location.pathname });
  error ? say(msg(error)) : say("Tautan reset dikirim ke email.", true);
};
$("syncNow").onclick = async () => { await push(); renderPage(); };
$("outBtn").onclick = async () => {
  await Promise.race([push(), new Promise(r => setTimeout(r, 2500))]);   // jangan menggantung saat offline
  stopListen(); S.onLocalChange = null; S.clearAll(); setSession(false);
  try { await sb.auth.signOut(); } catch (e) { console.error(e); }
  location.reload();
};
btn.onclick = () => { location.hash = "#/login"; };
setMode("in"); renderPage();

/* ---------- mulai ---------- */
paint("", "");
if (!configured) {
  console.warn("Si SEDUH: isi supabase-config.js untuk mengaktifkan akun & sinkronisasi.");
} else {
  /* Tamu tidak mengunduh SDK. Dimuat saat: sudah pernah login di perangkat ini, membuka halaman login, kembali dari login Google (?code=), atau kursor/jari ke tombol akun. */
  if (hasSession() || location.hash === "#/login" || /[?&]code=/.test(location.search)) boot();
  addEventListener("hashchange", () => { if (location.hash === "#/login") boot(); });
  document.addEventListener("pointerover", e => { if (e.target.closest && e.target.closest('#acctBtn, a[href="#/login"]')) boot(); }, { passive: true });
}
