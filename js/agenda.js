document.addEventListener('DOMContentLoaded', function() {
    // Carregar a NavBar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;

        });


    // Dados de exemplo para a agenda
    const mockVisits = [
        { id: 1, nome: 'Empresa Exemplo LTDA', fantasia: 'Nome Fantasia Exemplo', endereco: 'Rua das Flores, 123' },
        { id: 2, nome: 'Supermercado ABC', fantasia: 'Mercado do Bairro', endereco: 'Av. Principal, 789' },
        { id: 3, nome: 'João da Silva', endereco: 'Av. Brasil, 456' }
    ];

    const visitList = document.getElementById('visit-list');

    // Renderiza a lista de visitas
    mockVisits.forEach(visit => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.dataset.id = visit.id;
        listItem.innerHTML = `
            <div class="fw-bold">${visit.nome}</div>
            ${visit.fantasia ? `<div class="text-muted small">${visit.fantasia}</div>` : ''}
            <div>${visit.endereco}</div>
        `;
        visitList.appendChild(listItem);
    });

    // Habilita a funcionalidade de arrastar e soltar (drag and drop) [cite: 24]
    new Sortable(visitList, {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: function (evt) {
            console.log('Nova ordem:', this.toArray());
            // Aqui você adicionaria a lógica para salvar a nova ordem no banco de dados.
        }
    });
});