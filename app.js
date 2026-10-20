// ===== Configuración =====
const TELEFONO = "5493404595211";
const EMAIL_DESTINO = "yullierthomas@gmail.com";

// 1) El formulario envía por mail con Web3Forms (funciona también al abrir como archivo).
document.getElementById("formulario").addEventListener("submit", async function (e) {
  e.preventDefault();
  const boton = e.target.querySelector(".btn-enviar");
  boton.disabled = true;
  boton.textContent = "Enviando...";
  try {
    const resp = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
    });
    const data = await resp.json();
    if (data.success) {
      e.target.reset();
      mostrarAviso("¡Gracias! Recibimos tu consulta y te contactamos pronto.", "ok");
    } else {
      throw new Error(data.message);
    }
  } catch {
    const n = document.getElementById("nombre").value.trim();
    const t = document.getElementById("mensaje").value.trim();
    const m = `Hola, soy ${n}. ${t || "Quiero pedir un presupuesto."}`;
    window.open(`https://wa.me/${TELEFONO}?text=${encodeURIComponent(m)}`, "_blank");
    mostrarAviso("No pudimos enviar el mail, te llevamos a WhatsApp.", "error");
  } finally {
    boton.disabled = false;
    boton.textContent = "Enviar";
  }
});

function mostrarAviso(texto, tipo) {
  let aviso = document.getElementById("aviso");
  if (!aviso) {
    aviso = document.createElement("p");
    aviso.id = "aviso";
    aviso.style.cssText = "margin-top:14px;font-weight:700;";
    document.getElementById("formulario").appendChild(aviso);
  }
  aviso.textContent = texto;
  aviso.style.color = tipo === "ok" ? "#1e7e34" : "#c0392b";
}

// 2) Botón flotante a WhatsApp
const wa = document.getElementById("wa");
wa.href = `https://wa.me/${TELEFONO}`;
document.getElementById("wa-link").href = `https://wa.me/${TELEFONO}`;

// Link de la dirección → abre Google Maps (el usuario usa su app de mapas preferida)
const DIRECCION = "https://maps.app.goo.gl/st9xdqKedAJgHuKH8";
document.getElementById("mapa-link").href = DIRECCION;

// 3) Aparición suave al hacer scroll
const observador = new IntersectionObserver(function (items) {
  items.forEach(function (i) { if (i.isIntersecting) i.target.classList.add("visible"); });
}, { threshold: 0.15 });
document.querySelectorAll(".aparece").forEach(function (el) { observador.observe(el); });
document.querySelectorAll(".tarjetas > *, .pasos > *").forEach(function (el, i) {
  el.classList.add("aparece");
  el.style.transitionDelay = (i % 3) * 150 + "ms";
  observador.observe(el);
});

// 4) Barra de progreso + header que se achica
const cabecera = document.getElementById("cabecera");
const progreso = document.getElementById("progreso");
window.addEventListener("scroll", function () {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progreso.style.width = (window.scrollY / total * 100) + "%";
  cabecera.classList.toggle("compacto", window.scrollY > 40);
});

// 5) Menú hamburguesa en móviles
const hamburguesa = document.getElementById("hamburguesa");
const menu = document.querySelector(".menu");
hamburguesa.addEventListener("click", function () {
  const abierto = menu.classList.toggle("abierto");
  hamburguesa.setAttribute("aria-expanded", abierto);
});
menu.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () { menu.classList.remove("abierto"); });
});

// 6) Tilt del logo siguiendo el mouse
const tilt = document.getElementById("tilt");
document.querySelector(".hero").addEventListener("mousemove", function (e) {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;
  tilt.style.setProperty("--ry", (x * 14) + "deg");
  tilt.style.setProperty("--rx", (-y * 14) + "deg");
});

// 7) Año automático en el footer
document.getElementById("anio").textContent = new Date().getFullYear();
