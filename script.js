async function upload() {
  const file = document.getElementById("fileInput").files[0];
  const anime = document.getElementById("anime").value.trim();
  const season = document.getElementById("season").value.trim();
  const episode = document.getElementById("episode").value.trim();
  const desc = document.getElementById("videoDesc").value.trim();
  const status = document.getElementById("status");
  const btn = document.getElementById("uploadBtn");

  if (!file || !anime || !season || !episode) {
    alert("Preencha todos os campos e selecione um arquivo.");
    return;
  }

  const name = `${anime} - Temporada ${season} - Episódio ${episode}`;
  const formData = new FormData();
  formData.append("file", file);

  status.textContent = "Enviando...";
  btn.disabled = true;

  try {
    const res = await fetch("https://upload.gofile.io/uploadfile", {
      method: "POST",
      body: formData
    });

    const json = await res.json(); // JSON válido esperado
    if (json.status !== "ok") {
      console.error("Resposta inesperada:", json);
      status.textContent = "Erro no envio! Resposta inválida.";
      btn.disabled = false;
      return;
    }

    const link = json.data.downloadPage;
    const direct = json.data.directLink;

    const item = { name, desc: desc || "Sem descrição.", url: link, direct, date: new Date().toLocaleString() };
    saveToHistory(item);
    showHistory();
    status.innerHTML = `Enviado! <a href="${link}" target="_blank">Página</a>`;
  } catch (err) {
    console.error(err);
    status.textContent = "Erro no envio!";
  }

  btn.disabled = false;
}

function saveToHistory(item) {
  const h = JSON.parse(localStorage.getItem("videoHistory") || "[]");
  h.unshift(item);
  localStorage.setItem("videoHistory", JSON.stringify(h));
}

function showHistory() {
  const cont = document.getElementById("history");
  const h = JSON.parse(localStorage.getItem("videoHistory") || "[]");
  cont.innerHTML = "";
  h.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `<strong>${item.name}</strong> <small>${item.date}</small><br>
      <em>${item.desc}</em><br>
      <a href="${item.direct}" target="_blank">▶️ Ver vídeo</a>`;
    cont.appendChild(div);
  });
}

showHistory();
