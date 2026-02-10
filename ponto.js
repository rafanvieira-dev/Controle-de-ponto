const usuario = JSON.parse(localStorage.getItem('usuarioAtual'));
if(!usuario || usuario.admin) window.location.href = "index.html";

document.getElementById('usuario').innerText = `Funcionário: ${usuario.nome}`;

// Botão sair
document.getElementById('btnSair').addEventListener('click', ()=>{
  localStorage.removeItem('usuarioAtual');
  window.location.href = "index.html";
});

// Relógio
function atualizarRelogio() {
  const agora = new Date();
  document.getElementById('relogio').innerText = agora.toLocaleTimeString();
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// Criar semana
const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const tabela = document.getElementById('calendario');

// Recupera dados salvos
let pontoSalvo = JSON.parse(localStorage.getItem('ponto_' + usuario.nome)) || {};

// Criar linhas
dias.forEach(dia => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${dia}</td>
    <td class="entrada">${pontoSalvo[dia]?.entrada||''}</td>
    <td class="inicioAlmoco">${pontoSalvo[dia]?.inicioAlmoco||''}</td>
    <td class="fimAlmoco">${pontoSalvo[dia]?.fimAlmoco||''}</td>
    <td class="saida">${pontoSalvo[dia]?.saida||''}</td>
    <td class="total">0h</td>
  `;
  tabela.appendChild(tr);
});

// Função hora atual hh:mm
function horaAtual(){
  const agora = new Date();
  return agora.toTimeString().slice(0,5);
}

// Função calcular horas desconsiderando 1h almoço
function calcularHoras(){
  const linhas = tabela.querySelectorAll('tr');
  let pontoAtual = {};

  linhas.forEach((linha, i)=>{
    if(i===0) return;
    const dia = dias[i-1];
    const entrada = linha.querySelector('.entrada').innerText;
    const inicioAlmoco = linha.querySelector('.inicioAlmoco').innerText;
    const fimAlmoco = linha.querySelector('.fimAlmoco').innerText;
    const saida = linha.querySelector('.saida').innerText;

    pontoAtual[dia] = {entrada, inicioAlmoco, fimAlmoco, saida};

    const td = linha.querySelector('.total');

    if(entrada && inicioAlmoco && fimAlmoco && saida){
      const e = new Date(`1970-01-01T${entrada}:00`);
      const s = new Date(`1970-01-01T${saida}:00`);

      let total = (s - e)/3600000 - 1; // desconta 1h almoço
      total = total.toFixed(2);

      const diff = total - usuario.horasDia;
      td.innerText = `${diff >=0 ? '+' : ''}${diff}h`;

      td.classList.remove('positivo','negativo','neutro');
      if(diff>0) td.classList.add('positivo');
      else if(diff<0) td.classList.add('negativo');
      else td.classList.add('neutro');
    } else {
      td.innerText = '0h';
      td.classList.remove('positivo','negativo','neutro');
      td.classList.add('neutro');
    }
  });

  localStorage.setItem('ponto_' + usuario.nome, JSON.stringify(pontoAtual));
}

// Botão único sequencial
document.getElementById('btnPonto').addEventListener('click', ()=>{
  const hoje = new Date().getDay();
  const linha = tabela.querySelectorAll('tr')[hoje+1];
  if(!linha) return;

  const entrada = linha.querySelector('.entrada').innerText;
  const inicioAlmoco = linha.querySelector('.inicioAlmoco').innerText;
  const fimAlmoco = linha.querySelector('.fimAlmoco').innerText;
  const saida = linha.querySelector('.saida').innerText;

  if(!entrada){
    linha.querySelector('.entrada').innerText = horaAtual();
  } else if(!inicioAlmoco){
    linha.querySelector('.inicioAlmoco').innerText = horaAtual();
  } else if(!fimAlmoco){
    linha.querySelector('.fimAlmoco').innerText = horaAtual();
  } else if(!saida){
    linha.querySelector('.saida').innerText = horaAtual();
  } else {
    alert("Todos os pontos de hoje já foram registrados!");
  }

  calcularHoras();
});

// Calcula ao carregar
calcularHoras();
