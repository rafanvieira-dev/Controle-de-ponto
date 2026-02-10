// Banco de dados simulado
let users = JSON.parse(localStorage.getItem('users')) || [
    {username: 'admin', password: 'admin', role:'admin'}
];

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Login
document.getElementById('login-form')?.addEventListener('submit', e=>{
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const u = users.find(u => u.username === user && u.password === pass);
    if(u){
        localStorage.setItem('loggedUser', JSON.stringify(u));
        if(u.role === 'admin') window.location = 'admin.html';
        else window.location = 'ponto.html';
    } else {
        alert('Usuário ou senha incorretos');
    }
});

// Logout
document.getElementById('logout-btn')?.addEventListener('click', ()=>{
    localStorage.removeItem('loggedUser');
    window.location = 'index.html';
});

// Admin - cadastrar funcionário
document.getElementById('register-form')?.addEventListener('submit', e=>{
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    if(users.find(u=>u.username===username)){
        alert('Usuário já existe');
        return;
    }
    users.push({username,password,role:'user'});
    saveUsers();
    renderEmployees();
});

// Renderiza funcionários cadastrados
function renderEmployees(){
    const tbody = document.getElementById('employees-table');
    if(!tbody) return;
    tbody.innerHTML = '';
    users.filter(u=>u.role==='user').forEach(u=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${u.username}</td>`;
        tbody.appendChild(tr);
    });
}

renderEmployees();
