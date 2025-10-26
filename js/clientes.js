document.addEventListener('DOMContentLoaded', function() {
    // Carregar a NavBar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        });

    // Dados de exemplo
    const mockClients = [
        { tipo: 'pj', nome: 'Empresa Exemplo LTDA', fantasia: 'Nome Fantasia Exemplo', endereco: 'Rua das Flores, 123' },
        { tipo: 'pf', nome: 'João da Silva', endereco: 'Av. Brasil, 456' }
    ];

    const clientList = document.getElementById('client-list');

    // Função para renderizar os clientes
    function renderClients() {
        clientList.innerHTML = '';
        mockClients.forEach(client => {
            const clientBlock = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${client.nome}</h5>
                            ${client.fantasia ? `<h6 class="card-subtitle mb-2 text-muted">${client.fantasia}</h6>` : ''}
                            <p class="card-text">${client.endereco}</p>
                            <a href="#" class="stretched-link"></a>
                        </div>
                    </div>
                </div>
            `;
            clientList.innerHTML += clientBlock;
        });
    }

    renderClients();

    // Lógica para alternar entre formulários no modal [cite: 18]
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
});