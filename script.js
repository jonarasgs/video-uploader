async function upload() {
  const file = document.getElementById("fileInput").files[0];
  const category = document.getElementById("category").value.trim();
  const anime = document.getElementById("anime").value.trim();
  const season = document.getElementById("season").value.trim();
  const episode = document.getElementById("episode").value.trim();
  const desc = document.getElementById("videoDesc").value.trim();
  const status = document.getElementById("status");
  const btn = document.getElementById("uploadBtn");

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
    const res = await fetch("https://upload.gofile.io/uploadfile", {
      method: "POST",
      body: formData
    });

    const json = await res.json();

    if (json.status !== "ok") {
      status.textContent = "Erro no envio! Tente novamente.";
      btn.disabled = false;
      return;
    }

    // link da página e link direto do vídeo
    const downloadPage = json.data.downloadPage;
    const directLink = json.data.directLink;

    const item = {
      category,
      name,
      desc: desc || "Sem descrição.",
      downloadPage,
      directLink,
      date: new Date().toLocaleString()
    };

    saveToHistory(item);
    showHistory();

    status.innerHTML = `Enviado! <a href="${downloadPage}" target="_blank">Ver página</a>`;
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

function showHistory() {
  const container = document.getElementById("history");
  const history = JSON.parse(localStorage.getItem("videoHistory") || "[]");
  container.innerHTML = "";

  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";

    // Link para o vídeo direto, se existir; senão link para a página
    const videoUrl = item.directLink || item.downloadPage || "#";

    div.innerHTML = `
      <strong>[${item.category}] ${item.name}</strong> <small>${item.date}</small><br>
      <em>${item.desc}</em><br>
      <a href="${videoUrl}" target="_blank">▶️ Ver vídeo</a>
    `;

    container.appendChild(div);
  });
}

showHistory();
