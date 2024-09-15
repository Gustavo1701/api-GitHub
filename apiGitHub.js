const getUserInput = document.getElementById('addUsers');
const addUserBt = document.getElementById('addUserBtn');
const getToken = document.getElementById('tokenInput');
const tabela = document.getElementById('tbody');

const usuarios = [];


// FEITO POR CHAT GPT
const exibirLayout = (layoutId) => {
    // Ocultar todos os containers de layout
    document.querySelectorAll('#containerModal, #containerApi').forEach(elemento => elemento.classList.add('hidden'));
    // Mostrar o container especificado
    document.getElementById(layoutId).classList.remove('hidden');
}

document.getElementById('saveKey').addEventListener('click', () => {
    // Espera o modal ser fechado
    const modalElement = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide(); // Esconde o modal
    // Exibe o containerApi após o modal ser fechado
    setTimeout(() => exibirLayout('containerApi'), 300); // Adiciona um pequeno delay para garantir que o modal está realmente fechado
});

document.getElementById('closeModal').addEventListener('click', () => {
    exibirLayout('containerModal');
});

// Garante que o layout inicial seja exibido ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    exibirLayout('containerModal'); // Exibe o containerModal por padrão
});
// FIM CHAT GPT


const addUser = () => {

    const userInput = getUserInput.value.trim().toLowerCase(); //tratamento para remover campo vazio e transforma tudo em letra minuscula

    if (userInput) {
        if (!usuarios.includes(userInput)) { //tratamento para saber se o item ja foi adicionado
            usuarios.push(userInput);
            getUserInput.value = '';
            console.log(usuarios);

            getUsers(usuarios);
        } else {
            alert('Usuário ' + userInput + ' já cadastrado');
            getUserInput.value = '';
        }


    } else {
        alert('Por favor, digite um nome de usuário.');
    }
}

const removeUser = (event) => {
    const login = event.target.id.toLowerCase(); // foi adicionado o toLowerCase para que o botao consiga encontrar no array o usuario sem ter alteraçao no tamanho da letra
    const index = usuarios.findIndex((u) => u === login);

    if (index !== -1) {
        usuarios.splice(index, 1);
        getUsers(usuarios);
        console.log(usuarios);
    } else {
        console.error(`Usuário ${login} não encontrado.`);
    }

}

// const usuarios = [
//     'tiagolimar',
//     'edmaralbneto',
//     'angelolustosa',
//     'Gustavo1701',
//     'miguelalves10',
//     'breno-oliveira98',
//     'rafaeoTW4',
//     'JoaoRoberto1',
//     'Breno-arauj',
//     'antoniowgaldino'
// ];



const getUsers = async (usuarios) => {
    const tokenValue = getToken.value;

    try {
        const token = tokenValue;
        const config = {
            headers: { 'Authorization': `token ${token}` }
        };

        //Faz requisições para todos os usuários
        const requests = usuarios.map(usuario =>
            axios.get(`https://api.github.com/users/${usuario}`, config)
        );

        // Espera todas as requisições completarem
        const responses = await Promise.all(requests);

        // Extrai os dados relevantes de todas as respostas
        const data = responses.map(response => response.data);

        // Função para ordenar os dados pela quantidade de repositórios em ordem decrescente
        const ordenarUsuariosPorRepos = (usuarios) => {
            return usuarios.sort((a, b) => b.public_repos - a.public_repos);
        };

        // Ordena os dados
        const usuariosOrdenados = ordenarUsuariosPorRepos(data);

        // Cria o conteúdo da tabela
        let conteudoTabela = usuariosOrdenados.map((data, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${data.avatar_url}" style="border-radius: 3em;" width="35px"></td>
                <td>${data.name}</td>
                <td>${data.login}</td>
                <td>${data.public_repos}</td>
                <td><a href="${data.html_url}" target="_blank">${data.html_url}</a></td>
                <td><button id="${data.login.toLowerCase()}" class="btn btn-outline-danger" type="button" onclick="removeUser(event)">Remover Usuário</button></td>
            </tr>
        `).join('');

        // Atualiza o conteúdo da tabela
        tabela.innerHTML = conteudoTabela;

    } catch (error) {
        console.error('Erro na requisição Get:', error);
    }
};

getUsers(usuarios);
