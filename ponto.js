const usuario = JSON.parse(localStorage.getItem('usuarioAtual'));
if(!usuario || usuario.admin) window.location.href = "index.html"; // Redireciona se não for funcionário

document.getElementById('usuario').innerText = `Funcionário: ${usuario.nome}`;

// Relógio em tempo real
function atualizarRelogio() {
  const agora = new Date();
  document.getElementById('relogio').innerText = agora.toLocaleTimeString();
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// Criar semana
const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const tabela = document.getElementById('calendario');

dias.forEach(dia => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${dia}</td>
    <td><input type="time" class="entrada"></td>
    <td><input type="time" class="inicioAlmoco"></td>
    <td><input type="time" class="fimAlmoco"></td>
    <td><input type="time" class="saida"></td>
    <td class="total">0h</td>
  `;
  tabela.appendChild(tr);
});

// Calcular horas totais
function calcularHoras() {
  const linhas = tabela.querySelectorAll('tr');
  linhas.forEach((linha, i) => {
    if(i===0) return; // pular cabeçalho
    const entrada = linha.querySelector('.entrada').value;
    const inicioAlmoco = linha.querySelector('.inicioAlmoco').value;
    const fimAlmoco = linha.querySelector('.fimAlmoco').value;
    const saida = linha.querySelector('.saida').value;
    if(entrada && inicioAlmoco && fimAlmoco && saida){
      const e = new Date(`1970-01-01T${entrada}:00`);
      const ia = new Date(`1970-01-01T${inicioAlmoco}:00`);
      const fa = new Date(`1970-01-01T${fimAlmoco}:00`);
      const s = new Date(`1970-01-01T${saida}:00`);

      let total = ((ia - e) + (s - fa))/3600000; // horas
      total = total.toFixed(2);

      const diff = total - usuario.horasDia;
      const td = linha.querySelector('.total');
      td.innerText = `${diff >= 0 ? '+' : ''}${diff}h`;
      td.style.color = diff >=0 ? 'green' : 'red';
      td.style.fontWeight = 'bold';
    }
  });
}

tabela.addEventListener('input', calcularHoras);
