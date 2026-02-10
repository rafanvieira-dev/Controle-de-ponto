// Inicialização de funcionários
if(!localStorage.getItem('funcionarios')) {
  const funcionarios = [
    {nome: "João", senha:"123", horasDia: 12},
    {nome: "Maria", senha:"123", horasDia: 8},
    {nome:"admin", senha:"1234", horasDia:0, admin:true}
  ];
  localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
}

// Login
if(document.getElementById('loginForm')) {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios'));
    const user = funcionarios.find(f => f.nome.toLowerCase() === nome.toLowerCase() && f.senha === senha);
    if(user){
      localStorage.setItem('usuarioAtual', JSON.stringify(user));
      if(user.admin) window.location.href = "admin.html";
      else window.location.href = "ponto.html";
    } else alert("Usuário ou senha inválidos!");
  });
}

// Cadastro admin
if(document.getElementById('cadastroForm')) {
  const form = document.getElementById('cadastroForm');
  const lista = document.getElementById('listaFuncionarios');

  function atualizarLista(){
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios')).filter(f=>!f.admin);
    lista.innerHTML = "";
    funcionarios.forEach(f => {
      const li = document.createElement('li');
      li.innerText = `${f.nome} - ${f.horasDia}h/dia`;
      lista.appendChild(li);
    });
  }

  atualizarLista();

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;
    const horasDia = Number(document.getElementById('horasDia').value);

    const funcionarios = JSON.parse(localStorage.getItem('funcionarios'));
    funcionarios.push({nome, senha, horasDia});
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    atualizarLista();
    form.reset();
  });
}
