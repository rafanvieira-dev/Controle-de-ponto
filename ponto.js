const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
if(!loggedUser) window.location = 'index.html';

document.getElementById('user-name').textContent = loggedUser.username;

const currentTimeEl = document.getElementById('current-time');
const currentDateEl = document.getElementById('current-date');
const historyTable = document.getElementById('history-table');
const clockInBtn = document.getElementById('clock-in-btn');
const clockOutBtn = document.getElementById('clock-out-btn');
const workedHoursEl = document.getElementById('worked-hours');
const balanceHoursEl = document.getElementById('balance-hours');
const weekDaysEl = document.getElementById('week-days');

let users = JSON.parse(localStorage.getItem('users'));
let user = users.find(u=>u.username===loggedUser.username);
let history = user.history || [];

// Atualiza relógio
function updateClock(){
    const now = new Date();
    currentTimeEl.textContent = now.toLocaleTimeString('pt-BR');
    currentDateEl.textContent = now.toLocaleDateString('pt-BR');
}
setInterval(updateClock,1000);
updateClock();

// Calcula horas trabalhadas
function calculateHours(){
    let total = 0;
    for(let i=0;i<history.length;i+=2){
        const entrada = history[i];
        const saida = history[i+1];
        if(entrada && saida){
            const diff = (new Date(saida.time) - new Date(entrada.time))/1000/3600;
            total += diff;
        }
    }
    const balance = total - user.workHours;
    workedHoursEl.textContent = total.toFixed(2);
    balanceHoursEl.textContent = balance.toFixed(2);
}

// Renderiza histórico
function renderHistory(){
    historyTable.innerHTML = '';
    history.forEach(h=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${new Date(h.time).toLocaleTimeString('pt-BR')}</td><td>${h.type}</td>`;
        historyTable.appendChild(tr);
    });
    calculateHours();
    updateWeekDays();
}

// Atualiza botão dos dias da semana
function updateWeekDays(){
    const today = new Date();
    const dayButtons = weekDaysEl.querySelectorAll('button');

    dayButtons.forEach(btn=>{
        const day = parseInt(btn.dataset.day);

        if(user.workHours < 12 && (day===0 || day===6)){
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
    });

    // Se 12h já registradas, próximo dia vira folga
    if(user.workHours >= 12){
        const lastEntry = history.length ? new Date(history[history.length-1].time) : null;
        if(lastEntry){
            const nextDay = (lastEntry.getDay() + 1) % 7;
            dayButtons.forEach(btn=>{
                if(parseInt(btn.dataset.day) === nextDay) btn.disabled = true;
            });
        }
    }
}

// Registrar ponto
function register(type){
    const now = new Date();
    history.push({type,time: now.toISOString()});
    user.history = history;
    users = users.map(u=> u.username===user.username ? user : u);
    localStorage.setItem('users', JSON.stringify(users));
    renderHistory();
}

clockInBtn.addEventListener('click',()=>register('Entrada'));
clockOutBtn.addEventListener('click',()=>register('Saída'));

document.getElementById('logout-btn').addEventListener('click', ()=>{
    localStorage.removeItem('loggedUser');
    window.location = 'index.html';
});

renderHistory();
