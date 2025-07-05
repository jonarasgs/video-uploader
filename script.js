const status = document.getElementById("status"),
      btn = document.getElementById("uploadBtn"),
      player = document.getElementById("player"),
      searchInput = document.getElementById("search");

async function upload() {
  const file = document.getElementById("fileInput").files[0];
  const category = document.getElementById("category").value.trim();
  const anime = document.getElementById("anime").value.trim();
  const season = document.getElementById("season").value.trim();
  const episode = document.getElementById("episode").value.trim();
  const desc = document.getElementById("videoDesc").value.trim();

  if (!file || !category || !anime || !season || !episode) {
    alert("Preencha todos os campos e escolha um vídeo.");
    return;
  }

  const name = `${anime} - Temporada ${season} - Episódio ${episode}`;
  const formData = new FormData();
  formData.append("file", file, file.name);

  status.textContent = "Enviando...";
  btn.disabled = true;

  try {
    const res = await fetch(`https://transfer.sh/${file.name}`, {
      method: "PUT",
      body: formData
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const link = await res.text();

    const item = {
      category, name, desc: desc||"Sem descrição.",
      link: link.trim(), date: new Date().toLocaleString()
    };
    saveToHistory(item);
    showHistory();

    status.innerHTML = `Enviado! <a href="${item.link}" target="_blank">Ver em nova aba</a>`;
    player.src = item.link;
    player.style.display = "block";
    player.load();
    player.play();

  } catch (e) {
    console.error(e);
    status.textContent = `Erro no envio: ${e.message}`;
  }
  btn.disabled = false;
}

function saveToHistory(it) {
  const h = JSON.parse(localStorage.getItem("videoHistory")||"[]");
  h.unshift(it);
  localStorage.setItem("videoHistory", JSON.stringify(h));
}

function showHistory(filter="") {
  const cont = document.getElementById("history");
  const h = JSON.parse(localStorage.getItem("videoHistory")||"[]");
  cont.innerHTML = "";
  const f = filter.toLowerCase();

  h.forEach((item,i)=>{
    if (!filter || item.name.toLowerCase().includes(f)
        ||item.category.toLowerCase().includes(f)
        ||item.desc.toLowerCase().includes(f)
        ||item.date.toLowerCase().includes(f)) {
      const div = document.createElement("div");
      div.className = "history-item";
      div.innerHTML = `
        <strong>[${item.category}] ${item.name}</strong> <small>${item.date}</small><br>
        <em>${item.desc}</em><br>
        <a href="${item.link}" target="_blank">▶️ Ver (nova aba)</a> |
        <a href="#" class="play-link" data-i="${i}">▶️ Tocar aqui</a>
      `;
      cont.appendChild(div);
    }
  });

  cont.querySelectorAll(".play-link").forEach(a=>{
    a.onclick = e => {
      e.preventDefault();
      const idx = e.target.getAttribute("data-i");
      const video = JSON.parse(localStorage.getItem("videoHistory")||"[]")[idx];
      if (video) {
        player.src = video.link;
        player.style.display = "block";
        player.load();
        player.play();
      }
    };
  });
}

searchInput.addEventListener("input", e=>showHistory(e.target.value));
showHistory();
