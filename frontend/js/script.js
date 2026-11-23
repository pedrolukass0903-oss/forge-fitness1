// URL pública da aplicação backend publicada na Vercel.
// Durante desenvolvimento local, use http://localhost:3000.
const API_BASE_URL = "https://forge-fitness1-backend.vercel.app";

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

async function getData(resource) {
  const response = await fetch(`${API_BASE_URL}/api/${resource}`);
  if (!response.ok) throw new Error(`Falha ao carregar ${resource} (${response.status})`);
  return response.json();
}

function showError(container, message) {
  if (container) container.innerHTML = `<p class="empty-state status-error">${escapeHTML(message)}</p>`;
}

async function loadTrainings() {
  const container = document.querySelector("#trainings-container");
  try {
    const rows = await getData("trainings");
    container.innerHTML = rows.length ? rows.map(row => `
      <article class="training-card"><h3>${escapeHTML(row.name)}</h3><p>${escapeHTML(row.description || "")}</p></article>
    `).join("") : '<p class="empty-state">Nenhuma modalidade cadastrada.</p>';
  } catch (error) { console.error(error); showError(container, "Não foi possível carregar as modalidades. Verifique a API."); }
}

async function loadCoaches() {
  const container = document.querySelector("#coaches-container");
  try {
    const rows = await getData("coaches");
    container.innerHTML = rows.length ? rows.map(row => `
      <article class="coach-card">
        ${row.photo_url ? `<img src="${escapeHTML(row.photo_url)}" alt="Foto de ${escapeHTML(row.name)}" loading="lazy">` : `<div class="coach-initials">${escapeHTML(row.initials || "FF")}</div>`}
        <h3>${escapeHTML(row.name)}</h3><h4>${escapeHTML(row.specialty || "")}</h4><p>${escapeHTML(row.bio || "")}</p>
      </article>`).join("") : '<p class="empty-state">Nenhum professor cadastrado.</p>';
  } catch (error) { console.error(error); showError(container, "Não foi possível carregar a equipe. Verifique a API."); }
}

async function loadSchedules() {
  const container = document.querySelector("#schedules-container");
  const days = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
  try {
    const rows = await getData("schedules");
    const today = new Intl.DateTimeFormat("en-US", { timeZone: "America/Fortaleza", weekday: "long" }).format(new Date());
    const todayIndex = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].indexOf(today);
    container.innerHTML = rows.sort((a,b) => a.day_of_week-b.day_of_week).map(row => `
      <div class="schedule-row ${row.day_of_week === todayIndex ? "today" : ""}">
        <strong>${days[row.day_of_week] || "Dia não informado"}</strong>
        <span>${row.is_closed ? "Fechado" : `${String(row.open_time).slice(0,5)} às ${String(row.close_time).slice(0,5)}`}</span>
      </div>`).join("") || '<p class="empty-state">Nenhum horário cadastrado.</p>';
  } catch (error) { console.error(error); showError(container, "Não foi possível carregar os horários. Verifique a API."); }
}

async function loadLocations() {
  const container = document.querySelector("#locations-container");
  try {
    const rows = await getData("locations");
    container.innerHTML = rows.length ? rows.map(row => `
      <article class="location-card">
        <h3>${escapeHTML(row.name)}</h3><p>${escapeHTML(row.address || "")}</p>
        ${row.phone ? `<p>Telefone: ${escapeHTML(row.phone)}</p>` : ""}
        ${row.email ? `<p>E-mail: ${escapeHTML(row.email)}</p>` : ""}
        ${row.maps_url ? `<a href="${escapeHTML(row.maps_url)}" target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>` : ""}
        ${row.map_embed_url ? `<iframe src="${escapeHTML(row.map_embed_url)}" title="Mapa: ${escapeHTML(row.name)}" height="220" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : ""}
      </article>`).join("") : '<p class="empty-state">Nenhuma unidade cadastrada.</p>';
  } catch (error) { console.error(error); showError(container, "Não foi possível carregar as unidades. Verifique a API."); }
}

function setupMenu() {
  const button = document.querySelector(".menu-toggle");
  const links = document.querySelector("#nav-links");
  if (!button || !links) return;
  button.addEventListener("click", () => {
    const opened = links.classList.toggle("open");
    button.setAttribute("aria-expanded", String(opened));
    button.setAttribute("aria-label", opened ? "Fechar menu" : "Abrir menu");
    button.textContent = opened ? "×" : "☰";
  });
  links.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    links.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menu");
    button.textContent = "☰";
  }));
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  document.querySelector("#year").textContent = new Date().getFullYear();
  Promise.allSettled([loadTrainings(), loadCoaches(), loadSchedules(), loadLocations()]);
});
