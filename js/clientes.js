document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // FIREBASE (compat)
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
  // AUTH PROTECTION
  // ===============================
  let currentUser = null;

  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      carregarClientes(user.uid);
    } else {
      window.location.href = "index.html";
    }
  });

  // ===============================
  // LISTAGEM DE CLIENTES
  // ===============================
  const clientList = document.getElementById("visit-list");

  function carregarClientes(uid) {
    clientList.innerHTML = `<div class="col-12">Carregando clientes...</div>`;

    db.collection("clientes")
      .where("vendedorUid", "==", uid)
      .get()
      .then(snapshot => {
        clientList.innerHTML = "";

        if (snapshot.empty) {
          clientList.innerHTML = `<div class="col-12">Nenhum cliente cadastrado.</div>`;
          return;
        }

        snapshot.forEach(doc => {
          renderizarCliente(doc.data(), doc.id);
        });
      });
  }

  function renderizarCliente(cliente, id) {
  const nome = cliente.nome || cliente.razaoSocial;

  clientList.innerHTML += `
    <div class="col-md-4 mb-4">
      <a href="cliente-detalhes.html?id=${id}" 
         class="text-decoration-none text-dark">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="fw-bold">${nome}</h5>
            <p>${cliente.endereco || ""}</p>
          </div>
        </div>
      </a>
    </div>
  `;
}

  // ===============================
  // ABRIR PF / PJ
  // ===============================
  const btnPf = document.getElementById("btn-pf");
  const btnPj = document.getElementById("btn-pj");
  const formPf = document.getElementById("form-pf");
  const formPj = document.getElementById("form-pj");

  btnPf.addEventListener("click", () => {
    formPf.classList.remove("d-none");
    formPj.classList.add("d-none");
  });

  btnPj.addEventListener("click", () => {
    formPj.classList.remove("d-none");
    formPf.classList.add("d-none");
  });

  // ===============================
  // FUNÇÃO GENÉRICA – VISITA
  // ===============================
  function configurarVisita(prefixo) {
    const check = document.getElementById(`${prefixo}-check-visita`);
    const section = document.getElementById(`${prefixo}-visita-section`);
    const frequencia = document.getElementById(`${prefixo}-visita-frequencia`);
    const grupoDia = document.getElementById(`${prefixo}-grupo-dia-semana`);

    if (!check) return;

    check.addEventListener("change", () => {
      section.classList.toggle("d-none", !check.checked);
    });

    frequencia.addEventListener("change", () => {
      if (["semanal", "quinzenal"].includes(frequencia.value)) {
        grupoDia.classList.remove("d-none");
      } else {
        grupoDia.classList.add("d-none");
      }
    });
  }

  // ATIVA VISITA PF E PJ
  configurarVisita("pf");
  configurarVisita("pj");

  // ===============================
  // SALVAR CLIENTE PF
  // ===============================
  formPf.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!currentUser) return alert('Erro: Usuário não identificado.');

  const clienteData = {
    tipo: 'pf',
    nome: document.getElementById('pf-nome').value,
    apelido: document.getElementById('pf-apelido').value,
    endereco: document.getElementById('pf-endereco').value,
    telefone: document.getElementById('pf-telefone').value,
    email: document.getElementById('pf-email').value,
    dataNascimento: document.getElementById('pf-data-nascimento').value,
    vendedorUid: currentUser.uid,
    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
  };

  // ===== VISITA (OPCIONAL) =====
  const checkVisita = document.getElementById('pf-check-visita');

  if (checkVisita.checked) {
    clienteData.visita = {
      ativa: true,
      dataPrimeiraVisita: document.getElementById('pf-visita-data').value || null,
      frequencia: document.getElementById('pf-visita-frequencia').value || null,
      diaSemana: document.getElementById('pf-visita-dia-semana').value || null
    };
  }

  salvarCliente(clienteData);
});


  // ===============================
  // SALVAR CLIENTE PJ
  // ===============================
  formPj.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!currentUser) return alert('Erro: Usuário não identificado.');

  const clienteData = {
    tipo: 'pj',
    razaoSocial: document.getElementById('pj-razao-social').value,
    fantasia: document.getElementById('pj-nome-fantasia').value,
    endereco: document.getElementById('pj-endereco').value,
    responsavel: document.getElementById('pj-responsavel').value,
    telefone: document.getElementById('pj-telefone').value,
    email: document.getElementById('pj-email').value,
    dataNascimentoResponsavel: document.getElementById('pj-data-nascimento-responsavel').value,
    vendedorUid: currentUser.uid,
    criadoEm: firebase.firestore.FieldValue.serverTimestamp()
  };

  // ===== VISITA (OPCIONAL) =====
  const checkVisita = document.getElementById('pj-check-visita');

  if (checkVisita.checked) {
    clienteData.visita = {
      ativa: true,
      dataPrimeiraVisita: document.getElementById('pj-visita-data').value || null,
      frequencia: document.getElementById('pj-visita-frequencia').value || null,
      diaSemana: document.getElementById('pj-visita-dia-semana').value || null
    };
  }

  salvarCliente(clienteData);
});

  // ===============================
  // SALVAR NO FIREBASE
  // ===============================
  function salvarCliente(data) {
    db.collection("clientes").add(data).then(() => {
      alert("Cliente salvo com sucesso!");

      formPf.reset();
      formPj.reset();
      formPf.classList.add("d-none");
      formPj.classList.add("d-none");

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("addClientModal")
      );
      if (modal) modal.hide();

      carregarClientes(currentUser.uid);
    });
  }

});
