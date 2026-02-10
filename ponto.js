// Simulação de funcionário logado
let funcionario = {
    nome: "João",
    jornada: 8, // horas (6, 8 ou 12)
    registros: [] // cada registro: {data: "2026-02-09", entradas: [], saidas: []}
};

// Relógio digital
const relogio = document.getElementById("relogio");
setInterval(() => {
    let now = new Date();
    relogio.textContent = now.toLocaleTimeString('pt-BR');
}, 1000);

// Botões de ponto
document.getElementById("entrada").addEventListener("click", () => registrarHora("entrada"));
document.getElementById("saida").addEventListener("click", () => registrarHora("saida"));

function registrarHora(tipo){
    let hoje = new Date().toISOString().split('T')[0];
    let registro = funcionario.registros.find(r => r.data === hoje);
    if(!registro){
        registro = {data: hoje, entradas: [], saidas: [], folga: false};
        funcionario.registros.push(registro);
    }

    // Limite 4 registros
    if(registro.entradas.length + registro.saidas.length >= 4){
        alert("Limite de 4 registros por dia atingido!");
        return;
    }

    let horaAtual = new Date().toLocaleTimeString('pt-BR');
    if(tipo === "entrada"){
        registro.entradas.push(horaAtual);
    } else {
        registro.saidas.push(horaAtual);
    }

    // Se jornada 12h, marca próximo dia como folga automaticamente
    if(funcionario.jornada === 12 && registro.entradas.length + registro.saidas.length >= 2){
        let amanha = new Date();
        amanha.setDate(amanha.getDate()+1);
        let dataAmanha = amanha.toISOString().split('T')[0];
        if(!funcionario.registros.find(r => r.data === dataAmanha)){
            funcionario.registros.push({data: dataAmanha, entradas: [], saidas: [], folga: true});
        }
    }

    atualizarResumo();
    atualizarHistorico();
}

function atualizarResumo(){
    let hoje = new Date().toISOString().split('T')[0];
    let registro = funcionario.registros.find(r => r.data === hoje);
    let tempoTrabalhado = 0;

    if(registro){
        for(let i=0; i<registro.entradas.length; i++){
            let entrada = toMinutes(registro.entradas[i]);
            let saida = registro.saidas[i] ? toMinutes(registro.saidas[i]) : entrada;
            tempoTrabalhado += (saida - entrada);
        }
    }

    let saldoDia = tempoTrabalhado - (funcionario.jornada*60);
    document.getElementById("jornadaDia").textContent = formatMinutes(funcionario.jornada*60);
    document.getElementById("tempoTrabalhado").textContent = formatMinutes(tempoTrabalhado);
    document.getElementById("saldoDia").textContent = (saldoDia>=0? "":"-") + formatMinutes(Math.abs(saldoDia));

    // Atualizar saldo mensal e total
    let saldoMes = funcionario.registros.reduce((acc, r) => {
        let dia = 0;
        for(let i=0; i<r.entradas.length; i++){
            let entrada = toMinutes(r.entradas[i]);
            let saida = r.saidas[i]? toMinutes(r.saidas[i]) : entrada;
            dia += (saida-entrada);
        }
        return acc+dia;
    }, 0);

    document.getElementById("saldoMes").querySelector("h2").textContent = formatMinutes(saldoMes);
    document.getElementById("saldoTotal").querySelector("h2").textContent = (saldoMes<0?"-":"") + formatMinutes(Math.abs(saldoMes));
}

function atualizarHistorico(){
    let tbody = document.getElementById("historico");
    tbody.innerHTML = "";
    funcionario.registros.forEach(r=>{
        let tr = document.createElement("tr");
        let data = new Date(r.data);
        let diaSemana = data.getDay(); // 0 = Domingo, 6 = Sábado
        let desabilitado = (funcionario.jornada<12 && (diaSemana===0 || diaSemana===6)) || r.folga;

        tr.innerHTML = `
            <td>${r.folga ? "Folga" : r.data}</td>
            <td class="${desabilitado?'disabled':''}">${r.entradas[0]||""}</td>
            <td class="${desabilitado?'disabled':''}">${r.saidas[0]||""}</td>
            <td class="${desabilitado?'disabled':''}">${r.entradas[1]||""}</td>
            <td class="${desabilitado?'disabled':''}">${r.saidas[1]||""}</td>
            <td>${formatMinutes(r.entradas.reduce((sum,e,i)=>sum + ((r.saidas[i]?toMinutes(r.saidas[i]):toMinutes(e)) - toMinutes(e)),0) - funcionario.jornada*60)}</td>
            <td><button class="${desabilitado?'disabled':''}">✉️</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// helpers
function toMinutes(hhmmss){
    let parts = hhmmss.split(':');
    return parseInt(parts[0])*60 + parseInt(parts[1]);
}

function formatMinutes(mins){
    let h = Math.floor(mins/60);
    let m = mins%60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
}

// Inicializa
atualizarResumo();
atualizarHistorico();
