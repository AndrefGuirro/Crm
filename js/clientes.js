document.addEventListener('DOMContentLoaded', function() {

  // Carregar a NavBar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;

        });
    
    // --- NOVO: Variável para guardar o usuário logado ---
    let currentUser = null; 

    // --- NOVO: Bloco de Proteção de Página (Auth) ---
    // Todo o código principal vai ficar dentro deste "auth.onAuthStateChanged"
    // Isso garante que só vamos carregar a página se o usuário estiver logado.
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // O usuário está logADO.
            currentUser = user; // Guarda o objeto do usuário (que contém o UID)
            console.log('Usuário logado:', currentUser.uid);

           

            // Carrega os clientes do usuário logado (modificamos sua função)
            carregarClientes(currentUser.uid);

        } else {
            // Ninguém logado. Redireciona de volta para a tela de login.
            console.log('Nenhum usuário logado. Redirecionando...');
            window.location.href = 'index.html';
        }
    });



    // --- REMOVIDO: Seus dados de exemplo ---
    // const mockClients = [ ... ]; // Não precisamos mais disso

    const clientList = document.getElementById('client-list');

    // --- MODIFICADO: Sua função renderClients() ---
    // Mudei o nome para "carregarClientes" e agora ela busca do Firebase
    function carregarClientes(uid) {
        clientList.innerHTML = '<div class="col-12"><p>Carregando clientes...</p></div>';

        // É aqui que buscamos no Firestore
        db.collection('clientes')
          .where('vendedorUid', '==', uid) // Busca SÓ os clientes deste vendedor
          .get()
          .then((querySnapshot) => {
              
              clientList.innerHTML = ''; // Limpa o "Carregando..."
              
              if (querySnapshot.empty) {
                  clientList.innerHTML = '<div class="col-12"><p>Nenhum cliente cadastrado ainda. Clique no botão + para começar.</p></div>';
                  return;
              }

              // Itera sobre cada documento (cliente) encontrado
              querySnapshot.forEach((doc) => {
                  const client = doc.data(); // Pega os dados
                  // Reutilizamos sua lógica de renderização
                  renderizarBlocoCliente(client, doc.id);
              });
          })
          .catch((error) => {
              console.error("Erro ao carregar clientes: ", error);
          });
    }

    // --- NOVO: Função de Renderização ---
    function renderizarBlocoCliente(client, docId) {
        // Lógica para mostrar nome (PF) ou Razão Social (PJ)
        const nomePrincipal = client.nome || client.razaoSocial;

        const clientBlock = `
            <div class="col-md-4 mb-4">
                <div class="card" data-id="${docId}"> <div class="card-body">
                        <h5 class="card-title fw-bold">${nomePrincipal}</h5>
                        ${client.fantasia ? `<h6 class="card-subtitle mb-2 text-muted">${client.fantasia}</h6>` : ''}
                        <p class="card-text">${client.endereco}</p>
                        <a href="#" class="stretched-link"></a>
                    </div>
                </div>
            </div>
        `;
        clientList.innerHTML += clientBlock;
    }

    // --- REMOVIDO: A chamada renderClients() antiga ---
    // renderClients(); 

    // ---  lógica de alternar formulários  ---
    const btnPf = document.getElementById('btn-pf');
    const btnPj = document.getElementById('btn-pj');
    const formPf = document.getElementById('form-pf');
    const formPj = document.getElementById('form-pj');

    btnPf.addEventListener('click', () => {
        formPf.classList.remove('d-none');
        formPj.classList.add('d-none');
    });

    btnPj.addEventListener('click', () => {
        formPj.classList.remove('d-none');
        formPf.classList.add('d-none');
    });


    // --- NOVO: Lógica para SALVAR os dados no Firebase ---
    
    // Adiciona o listener para o SUBMIT do formulário de Pessoa Física
    formPf.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento da página
        if (!currentUser) return alert('Erro: Usuário não identificado.');

        const clienteData = {
            tipo: 'pf',
            nome: document.getElementById('pf-nome').value,
            endereco: document.getElementById('pf-endereco').value,
            // (Adicione aqui os getElementById para os outros campos: cpf, rg, etc.) [cite: 19]
            
            // A "ETIQUETA" MÁGICA (ESSENCIAL PARA A REGRA DE SEGURANÇA)
            vendedorUid: currentUser.uid 
        };
        
        salvarCliente(clienteData);
    });

    // Adiciona o listener para o SUBMIT do formulário de Pessoa Jurídica
    formPj.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!currentUser) return alert('Erro: Usuário não identificado.');

        const clienteData = {
            tipo: 'pj',
            razaoSocial: document.getElementById('pj-razao-social').value,
            fantasia: document.getElementById('pj-nome-fantasia').value,
            endereco: document.getElementById('pj-endereco').value, // (Assumindo que você tenha um campo 'pj-endereco')
            // (Adicione aqui os getElementById para os outros campos: cnpj, responsavel, etc.) [cite: 20]

            // A "ETIQUETA" MÁGICA
            vendedorUid: currentUser.uid
        };

        salvarCliente(clienteData);
    });

    // Função genérica para salvar dados na coleção 'clientes'
    function salvarCliente(data) {
        db.collection('clientes').add(data)
            .then((docRef) => {
                console.log("Cliente salvo com ID: ", docRef.id);
                alert('Cliente salvo com sucesso!');
                
                // Limpa os formulários
                formPf.reset();
                formPj.reset();
                
                // Esconde os formulários
                formPf.classList.add('d-none');
                formPj.classList.add('d-none');
                
                // Fecha o modal (Assumindo que o ID do seu modal é 'addClientModal')
                const modalElement = document.getElementById('addClientModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                     modal.hide();
                }

                // Remove a mensagem "Nenhum cliente" se ela existir
                if (clientList.innerText.includes("Nenhum cliente")) {
                    clientList.innerHTML = '';
                }

                // Adiciona o novo cliente à lista na tela
                renderizarBlocoCliente(data, docRef.id);

            })
            .catch((error) => {
                console.error("Erro ao salvar cliente: ", error);
                alert("Erro ao salvar cliente. Verifique o console.");
            });
    }
});