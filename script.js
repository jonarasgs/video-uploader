async function upload() {
  const file = document.getElementById("fileInput").files[0];
  const name = document.getElementById("videoName").value;
  const desc = document.getElementById("videoDesc").value;

  if (!file) return alert("Escolha um arquivo de vídeo.");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.gofile.io/uploadFile", {
    method: "POST",
    body: formData
  });

  const json = await res.json();

  if (json.status !== "ok") {
    alert("Erro no envio!");
    return;
  }

  const link = json.data.downloadPage;

  const item = {
    name: name || file.name,
    desc: desc || "Sem descrição.",
    url: link,
    date: new Date().toLocaleString()
  };

  saveToHistory(item);
  showHistory();
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
