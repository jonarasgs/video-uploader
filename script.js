const status = document.getElementById("status");
const btn = document.getElementById("uploadBtn");
const player = document.getElementById("player");
const searchInput = document.getElementById("search");

async function upload() {
  const file = document.getElementById("fileInput").files[0];
  const category = document.getElementById("category").value.trim();
  const anime = document.getElementById("anime").value.trim();
  const season = document.getElementById("season").value.trim();
  const episode = document.getElementById("episode").value.trim();
  const desc = document.getElementById("videoDesc").value.trim();

  if (!file || !category || !anime || !season || !episode) {
    alert("Preencha todos os campos e selecione um arquivo.");
    return;
  }

  const name = `${anime} - Temporada ${season} - Episódio ${episode}`;

  const formData = new FormData();
  formData.append("file", file);

  status.textContent = "Enviando...";
  btn.disabled = true;

  try {
    const res = await fetch("https://pixeldrain.com/api/file", {
      method: "POST",
      body: formData
    });

    const json = await res.json();

    if (!json.shortened) {
      status.textContent = "Erro no envio! Tente novamente.";
      btn.disabled = false;
      return;
    }

    const directLink = `https://pixeldrain.com/api/file/${json.shortened}`;

    const item = {
      category,
      name,
      desc: desc || "Sem descrição.",
      directLink,
      date: new Date().toLocaleString()
    };

    saveToHistory(item);
    showHistory();

    status.innerHTML = `Enviado! <a href="${directLink}" target="_blank">Ver vídeo</a>`;

    // Atualiza player para tocar vídeo enviado
    player.src = directLink;
    player.style.display = "block";
    player.load();
    player.play();

  } catch (err) {
    status.textContent = "Erro no envio!";
    console.error(err);
  }

  btn.disabled = false;
}

function saveToHistory(item) {
  const history = JSON.parse(localStorage.getItem("videoHistory") || "[]");
  history.unshift(item);
  localStorage.setItem("videoHistory", JSON.stringify(history));
}

function showHistory(filter = "") {
  const container = document.getElementById("history");
  const history = JSON.parse(localStorage.getItem("videoHistory") || "[]");
  container.innerHTML = "";

  const lowerFilter = filter.toLowerCase();

  history.forEach((item, index) => {
    if (
      !filter ||
      item.name.toLowerCase().includes(lowerFilter) ||
      item.category.toLowerCase().includes(lowerFilter) ||
      item.desc.toLowerCase().includes(lowerFilter) ||
      item.date.toLowerCase().includes(lowerFilter)
    ) {
      const div = document.createElement("div");
      div.className = "history-item";

      div.innerHTML = `
        <strong>[${item.category}] ${item.name}</strong> <small>${item.date}</small><br>
        <em>${item.desc}</em><br>
        <a href="${item.directLink}" target="_blank">▶️ Ver vídeo (nova aba)</a> |
        <a href="#" class="play-link" data-index="${index}">▶️ Tocar aqui</a>
      `;

      container.appendChild(div);
    }
  });

  // Configura eventos para tocar vídeo no player
  document.querySelectorAll(".play-link").forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      const idx = e.target.getAttribute("data-index");
      const video = history[idx];
      if (video) {
        player.src = video.directLink;
        player.style.display = "block";
        player.load();
        player.play();
      }
    };
  });
}

searchInput.addEventListener("input", e => {
  showHistory(e.target.value);
});

showHistory();
