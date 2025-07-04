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

  // Mostra carregando
  status.textContent = "Enviando...";
  btn.disabled = true;

  try {
    const res = await fetch("https://api.gofile.io/uploadFile", {
      method: "POST",
      body: formData
    });

    const json = await res.json();

    if (json.status !== "ok") {
      status.textContent = "Erro ao enviar. Tente novamente.";
      btn.disabled = false;
      return;
    }

    const link = json.data.downloadPage;

    const item = {
      name,
      desc: desc || "Sem descrição.",
      url: link,
      date: new Date().toLocaleString()
    };

    saveToHistory(item);
    showHistory();

    status.textContent = "Enviado com sucesso!";
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
    div.innerHTML = `
      <strong>${item.name}</strong> <small>${item.date}</small><br>
      <em>${item.desc}</em><br>
      <a href="${item.url}" target="_blank">🔗 Ver página</a>
    `;
    container.appendChild(div);
  });
}

showHistory();
