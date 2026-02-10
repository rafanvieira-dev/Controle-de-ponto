// Login
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginError = document.getElementById('login-error');
const registerMsg = document.getElementById('register-msg');
const backBtn = document.getElementById('back-btn');

loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const users = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        if(user.isAdmin) window.location.href = 'admin.html';
        else window.location.href = 'ponto.html';
    } else {
        loginError.textContent = 'E-mail ou senha incorretos.';
    }
});

// Cadastro (somente admin)
registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    let users = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    if (users.find(u => u.email === email)) {
        registerMsg.textContent = 'Usuário já cadastrado.';
        registerMsg.className = 'text-red-600 text-center mt-2';
        return;
    }

    const newUser = { id: Date.now(), name, email, password, pontos: [], isAdmin: false };
    users.push(newUser);
    localStorage.setItem('funcionarios', JSON.stringify(users));
    registerMsg.textContent = 'Cadastro realizado!';
    registerMsg.className = 'text-green-600 text-center mt-2';
});

// Voltar para login
backBtn?.addEventListener('click', ()=>{
    window.location.href = 'index.html';
});
