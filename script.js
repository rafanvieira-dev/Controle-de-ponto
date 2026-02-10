// Elementos DOM
const tabela = document.getElementById("tabela-encomendas");
const saldoDia = document.getElementById("saldo-dia");
const saldoMes = document.getElementById("saldo-mes");
const saldoTotal = document.getElementById("saldo-total");

// Dados iniciais (substitua com seus dados reais/fetch)
let encomendas = [
  {data: "09/02/2026", nome: "João", hora: "08:30", obs: "Entrega normal", saldo: 10},
  {data: "09/02/2026", nome: "Maria", hora: "09:15", obs: "Entrega atrasada", saldo: -5},
];

// Função para atualizar tabela e saldos
function atualizarTabela() {
  tabela.innerHTML = "";
  let totalDia = 0, totalMes = 0, total = 0;

  encomendas.forEach(e => {
    totalDia += e.saldo; // ajuste conforme sua lógica
    totalMes += e.saldo;
    total += e.saldo;

    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-50 transition";
    tr.innerHTML = `
      <td class="px-6 py-3 text-gray-700">${e.data}</td>
      <td class="px-6 py-3 text-gray-700">${e.nome}</td>
      <td class="px-6 py-3 text-gray-700">${e.hora}</td>
      <td class="px-6 py-3 text-gray-700">${e.obs}</td>
    `;
    tabela.appendChild(tr);
  });

  // Atualiza saldos com cores dinâmicas
  saldoDia.textContent = totalDia;
  saldoDia.className = `text-3xl font-bold ${totalDia>0?'text-green-600':totalDia<0?'text-red-600':'text-gray-800'}`;

  saldoMes.textContent = totalMes;
  saldoMes.className = `text-3xl font-bold ${totalMes>0?'text-green-600':totalMes<0?'text-red-600':'text-gray-800'}`;

  saldoTotal.textContent = total;
  saldoTotal.className = `text-3xl font-bold ${total>0?'text-green-600':total<0?'text-red-600':'text-gray-800'}`;
}

// Chamada inicial
atualizarTabela();

// Função para adicionar encomenda (exemplo)
function adicionarEncomenda(encomenda) {
  encomendas.push(encomenda);
  atualizarTabela();
}

// Exemplo: adicionar nova encomenda ao clicar no botão
document.querySelector("button").addEventListener("click", () => {
  const nova = {
    data: "09/02/2026",
    nome: "Novo Cliente",
    hora: "10:00",
    obs: "Observação teste",
    saldo: 15
  };
  adicionarEncomenda(nova);
});
