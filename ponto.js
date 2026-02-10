// Simulação de funcionário logado
let funcionario = {
    nome: "João Silva",
    jornada: 8, // 6, 8 ou 12 horas
    registros: []
};

// Relógio digital
function atualizarRelogio() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    document.getElementById("relogio").textContent = `${h}:${m}:${s}`;
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// Filtros de ano/mês
const anoSel = document.getElementById("filtro-ano");
const mesSel = document.getElementById("filtro-mes");
const hoje = new Date();

for(let y = hoje.getFullYear()-1; y <= hoje.getFullYear(); y++){
    let opt = document.createElement("option");
    opt.value = y; opt.text = y; 
    if(y===hoje.getFullYear()) opt.selected=true;
    anoSel.appendChild(opt);
}

for(let m=1; m<=12; m++){
    let opt = document.createElement("option");
    opt.value = m; opt.text = m.toString().padStart(2,'0');
    if(m===hoje.getMonth()+1) opt.selected=true;
    mesSel.appendChild(opt);
}

// Registro de ponto
document.getElementById("entrada").addEventListener("click", ()=>{ if(podeRegistrar()) registrarHora("entrada"); });
document.getElementById("saida").addEventListener("click", ()=>{ if(podeRegistrar()) registrarHora("saida"); });

function podeRegistrar(){
    const now = new Date();
    const dia = now.getDay(); // 0=dom,6=sab
    if(funcionario.jornada<12 && (dia===0||dia===6)){
        alert("Final de semana não permitido para sua jornada.");
        return false;
    }

    const hojeStr = now.toISOString().split('T')[0];
    let reg = funcionario.registros.find(r=>r.data===hojeStr);
    if(reg && (reg.entradas.length+reg.saidas.length >=4)){
        alert("Limite de 4 registros por dia atingido!");
        return false;
    }
    if(reg && reg.folga){
        alert("Hoje é folga!");
        return false;
    }
    return true;
}

function registrarHora(tipo){
    const now = new Date();
    const hojeStr = now.toISOString().split('T')[0];
    let reg = funcionario.registros.find(r=>r.data===hojeStr);
    if(!reg){
        reg = {data: hojeStr, entradas: [], saidas: [], folga:false};
        funcionario.registros.push(reg);
    }
    if(tipo==="entrada") reg.entradas.push(now.toLocaleTimeString());
    else reg.saidas.push(now.toLocaleTimeString());
    atualizarHistorico();
    atualizarResumo();
}

// Atualiza histórico
function atualizarHistorico(){
    const tbody = document.getElementById("historico");
    tbody.innerHTML="";
    funcionario.registros.forEach(r=>{
        const tr = document.createElement("tr");
        const entradas = r.entradas.join(" | ");
        const saidas = r.saidas.join(" | ");
        const saldo = calcularSaldo(r);
        tr.innerHTML = `<td>${r.data}</td>
                        <td>${entradas}</td>
                        <td>${saidas}</td>
                        <td>${saldo}</td>
                        <td><span title="Justificativa">✉️</span></td>`;
        tbody.appendChild(tr);
    });
}

// Calcula saldo do dia
function calcularSaldo(reg){
    let totalMs = 0;
    for(let i=0;i<Math.min(reg.entradas.length, reg.saidas.length); i++){
        const ent = new Date(`1970-01-01T${reg.entradas[i]}`);
        const sai = new Date(`1970-01-01T${reg.saidas[i]}`);
        totalMs += sai - ent;
    }
    const hPrev = funcionario.jornada;
    const saldoH = totalMs/1000/60/60 - hPrev;
    return saldoH.toFixed(2)+"h";
}

// Atualiza resumo do dia e saldos
function atualizarResumo(){
    const hojeStr = hoje.toISOString().split('T')[0];
    const reg = funcionario.registros.find(r=>r.data===hojeStr);
    const jornada = funcionario.jornada.toString().padStart(2,'0')+":00";
    document.getElementById("jornada-prevista").textContent = jornada;
    if(reg){
        let totalMs = 0;
        for(let i=0;i<Math.min(reg.entradas.length, reg.saidas.length); i++){
            const ent = new Date(`1970-01-01T${reg.entradas[i]}`);
            const sai = new Date(`1970-01-01T${reg.saidas[i]}`);
            totalMs += sai - ent;
        }
        const horas = Math.floor(totalMs/1000/60/60);
        const mins = Math.floor((totalMs/1000/60)%60);
        document.getElementById("tempo-trabalhado").textContent = `${horas.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}`;
        const saldoH = totalMs/1000/60/60 - funcionario.jornada;
        document.getElementById("saldo-dia").textContent = saldoH.toFixed(2)+"h";
    } else {
        document.getElementById("tempo-trabalhado").textContent = "00:00";
        document.getElementById("saldo-dia").textContent = "0h";
    }

    // Saldos geral
    let totalMes = 0;
    funcionario.registros.forEach(r=>{
        for(let i=0;i<Math.min(r.entradas.length, r.saidas.length); i++){
            const ent = new Date(`1970-01-01T${r.entradas[i]}`);
            const sai = new Date(`1970-01-01T${r.saidas[i]}`);
            totalMes += sai - ent;
        }
    });
    const saldoMes = totalMes/1000/60/60 - funcionario.jornada*funcionario.registros.length;
    document.getElementById("saldo-mes").textContent = saldoMes.toFixed(2)+"h";
    document.getElementById("saldo-total").textContent = saldoMes.toFixed(2)+"h";
}
