document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // FIREBASE
  // ===============================
  const firebaseConfig = {
    apiKey: "AIzaSyCQDmhKoqNahIjlD87opyXFvs8XvGoAFcQ",
    authDomain: "crm-clientes-ca630.firebaseapp.com",
    projectId: "crm-clientes-ca630",
    storageBucket: "crm-clientes-ca630.firebasestorage.app",
    messagingSenderId: "769427391689",
    appId: "1:769427391689:web:ca38fba828d006e7cbb918"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  // ===============================
  // NAVBAR
  // ===============================
  fetch("navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar-placeholder").innerHTML = html;
    });

  // ===============================
  // PEGAR ID DO CLIENTE
  // ===============================
  const params = new URLSearchParams(window.location.search);
  const clienteId = params.get("id");

  if (!clienteId) {
    alert("Cliente não identificado.");
    window.location.href = "clientes.html";
    return;
  }

  // ===============================
  // ELEMENTOS
  // ===============================
  const nomeEl = document.getElementById("cliente-nome");
  const listaNotas = document.getElementById("lista-notas");
  const formNota = document.getElementById("form-nota");
  const notaTexto = document.getElementById("nota-texto");

  // ===============================
  // AUTH
  // ===============================
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    carregarCliente();
    carregarNotas();
  });

  // ===============================
  // CARREGAR CLIENTE
  // ===============================
  function carregarCliente() {
    db.collection("clientes").doc(clienteId).get().then(doc => {
      if (!doc.exists) {
        alert("Cliente não encontrado.");
        window.location.href = "clientes.html";
        return;
      }

      const cliente = doc.data();
      nomeEl.innerText = cliente.nome || cliente.razaoSocial;
    });
  }

  // ===============================
  // CARREGAR NOTAS
  // ===============================
  function carregarNotas() {
    listaNotas.innerHTML = "<p>Carregando notas...</p>";

    db.collection("clientes")
      .doc(clienteId)
      .collection("notas")
      .orderBy("criadaEm", "desc")
      .onSnapshot(snapshot => {

        if (snapshot.empty) {
          listaNotas.innerHTML = `<p class="text-muted">Nenhuma nota registrada.</p>`;
          return;
        }

        listaNotas.innerHTML = "";

        snapshot.forEach(doc => {
          const nota = doc.data();
          const data = nota.criadaEm
            ? nota.criadaEm.toDate().toLocaleString("pt-BR")
            : "";

          listaNotas.innerHTML += `
            <div class="border rounded p-2 mb-2">
              <div class="small text-muted mb-1">${data}</div>
              <div>${nota.texto}</div>
            </div>
          `;
        });
      });
  }

  // ===============================
  // SALVAR NOTA
  // ===============================
  formNota.addEventListener("submit", function (e) {
    e.preventDefault();

    const texto = notaTexto.value.trim();
    if (!texto) return;

    db.collection("clientes")
      .doc(clienteId)
      .collection("notas")
      .add({
        texto,
        criadaEm: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        notaTexto.value = "";
      });
  });

});
