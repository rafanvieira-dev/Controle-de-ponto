// Inicializa usuários
let users = JSON.parse(localStorage.getItem('users')) || [
    {username:'admin', password:'admin', role:'admin', workHours:8, history:[]}
];
localStorage.setItem('users', JSON.stringify(users));

// Login
document.getElementById('login-form')?.addEventListener('submit', e=>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u=>u.username===username && u.password===password);
    if(!user){ alert('Usuário ou senha inválidos'); return; }

    localStorage.setItem('loggedUser', JSON.stringify(user));
    if(user.role==='admin') window.location = 'admin.html';
    else window.location = 'ponto.html';
});

// Admin - Cadastro
document.getElementById('register-form')?.addEventListener('submit', e=>{
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const workHours = parseFloat(document.getElementById('work-hours').value);

    if(users.find(u=>u.username===username)){ alert('Usuário já existe'); return; }

    users.push({username,password,role:'user',workHours,history:[]});
    localStorage.setItem('users', JSON.stringify(users));
    renderEmployees();
});

function renderEmployees(){
    const list = document.getElementById('employee-list');
    if(!list) return;
    list.innerHTML = '';
    users.filter(u=>u.role==='user').forEach(u=>{
        const li = document.createElement('li');
        li.textContent = `${u.username} - ${u.workHours}h/dia`;
        list.appendChild(li);
    });
}

renderEmployees();

// Logout
document.getElementById('logout-btn')?.addEventListener('click', ()=>{
    localStorage.removeItem('loggedUser');
    window.location = 'index.html';
});
