// BANCO DE DADOS INICIAL
let dadosInternacoes = [
    { id: 1605739, data: "03/09/2025", nome: "ANA CLARA OLIVEIRA COMBY", hospital: "HOSPITAL SANTA LUCIA NORTE - PRONTONORTE", confirmado: true },
    { id: 462, data: "14/11/2024", nome: "ELISANGELA DE CARVALHO", hospital: "00905 - CLINICA RECANTO", confirmado: true },
    { id: 501, data: "10/01/2025", nome: "CELESTE GUILHERMON MIURA", hospital: "00613 - HOSPITAL SANTA MARTA", confirmado: false }
];

const prontuarioCarefy = {
    "1605739": {
        idade: "27a 1m 13d",
        nascimento: "04/01/1999",
        empresa: "Quallity (750 beneficiários)",
        custo: "R$ 3.800,00",
        plano: "UNIMED",
        acomodacao: "APARTAMENTO",
        internacao: "ELETIVA",
        cid: "O82.0",
        diagnostico: "PARTO CESARIANA. Puérpera com IG de 38+3d, submetida a procedimento sem intercorrências.",
        timeline: [
            { data: "05/09/2025 20:59", obs: "Paciente e RN já de alta.", prof: "Thialla Souza" },
            { data: "04/09/2025 15:25", obs: "Puérpera e RN estáveis. RN nasceu pesando 3.110g. Aguardando 48h para alta.", prof: "Thialla Souza" },
            { data: "03/09/2025 19:45", obs: "Admissão: CID 1 - Parto espontâneo cefálico.", prof: "Thialla Souza" }
        ]
    }
};

// FUNÇÃO PARA SALVAR EVOLUÇÃO (GLOBAL)
window.salvarEvolucao = (id) => {
    const textarea = document.getElementById('nova-evolucao');
    const texto = textarea.value.trim();
    if (!texto) return alert("Por favor, digite a evolução.");
    
    if (!prontuarioCarefy[id]) prontuarioCarefy[id] = { timeline: [] };
    
    prontuarioCarefy[id].timeline.unshift({
        data: new Date().toLocaleString('pt-BR'),
        obs: texto,
        prof: "DR. PLANTÃO"
    });

    const container = document.getElementById('container-timeline');
    if (container) {
        container.innerHTML = prontuarioCarefy[id].timeline.map(t => `
            <div class="border-l-2 border-blue-100 pl-4 pb-4 relative ml-2">
                <div class="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                <p class="text-[10px] font-bold text-blue-600">${t.data}</p>
                <p class="text-xs text-gray-700 font-medium">${t.obs}</p>
                <p class="text-[9px] text-gray-400 uppercase">Responsável: ${t.prof}</p>
            </div>
        `).join('');
    }
    textarea.value = '';
};

const modal = document.getElementById('modal-overlay');
const btnModalAcao = document.getElementById('btn-modal-acao');
const searchInput = document.getElementById('search-input');

function renderizarCenso() {
    const listConf = document.getElementById('lista-confirmados');
    const listNaoConf = document.getElementById('lista-nao-confirmados');
    if(!listConf || !listNaoConf) return;
    listConf.innerHTML = ''; listNaoConf.innerHTML = '';

    [true, false].forEach(status => {
        const container = status ? listConf : listNaoConf;
        const filtrados = dadosInternacoes.filter(d => d.confirmado === status);
        const hospitaisUnicos = [...new Set(filtrados.map(d => d.hospital))];
        hospitaisUnicos.forEach(hospNome => {
            const pacientesHosp = filtrados.filter(p => p.hospital === hospNome);
            const card = document.createElement('div');
            card.className = 'border rounded mb-4 overflow-hidden bg-white hospital-card shadow-sm';
            card.innerHTML = `<div class="bg-blue-50 p-2 text-[11px] font-bold text-blue-800 flex justify-between border-b"><span>${hospNome} <span class="bg-blue-200 px-1.5 rounded ml-1">${pacientesHosp.length}</span></span></div><div class="divide-y divide-gray-100"></div>`;
            const pDiv = card.querySelector('.divide-y');
            pacientesHosp.forEach(p => {
                const row = document.createElement('div');
                row.className = 'p-3 flex justify-between items-center hover:bg-gray-50 transition-colors';
                row.innerHTML = `<div class="flex items-center space-x-3 text-[11px]"><span class="font-bold text-gray-400 w-10">${p.id}</span><span class="patient-name font-semibold uppercase text-gray-700">${p.nome}</span><i class="fa-solid fa-eye text-blue-400 cursor-pointer hover:text-blue-600 btn-ver" data-id="${p.id}" title="Ver Prontuário"></i></div><div class="flex space-x-3 text-sm"><i class="fa-solid fa-circle-exclamation text-red-500 cursor-pointer" title="Alerta de Pendência"></i>${p.confirmado ? `<i class="fa-solid fa-xmark text-red-400 cursor-pointer hover:text-red-600 btn-remover" data-id="${p.id}" title="Excluir"></i>` : `<i class="fa-solid fa-check text-green-500 cursor-pointer hover:text-green-700 btn-confirmar" data-id="${p.id}" title="Confirmar"></i>`}</div>`;
                pDiv.appendChild(row);
            });
            container.appendChild(card);
        });
        const countBadge = document.getElementById(`count-${status ? 'confirmados' : 'nao-confirmados'}`);
        if(countBadge) countBadge.innerText = filtrados.length;
    });
}

function openModal(title, html, showBtn = false, action = null) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = html;
    btnModalAcao.classList.toggle('hidden', !showBtn);
    btnModalAcao.onclick = action; 
    modal.classList.remove('hidden');
}

const closeModal = () => modal.classList.add('hidden');
document.getElementById('close-modal').onclick = closeModal;
document.getElementById('btn-modal-cancelar').onclick = closeModal;

document.getElementById('btn-novo-paciente').onclick = () => {
    const formHtml = `
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nome do Paciente</label><input type="text" id="in-nome" class="w-full border p-2 rounded uppercase text-sm outline-none"></div>
            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Prestador (Hospital)</label><select id="in-hosp" class="w-full border p-2 rounded text-sm bg-white"><option>HOSPITAL SANTA LUCIA NORTE - PRONTONORTE</option><option>00613 - HOSPITAL SANTA MARTA</option><option>00149 - HOSPITAL DAHER</option><option>00905 - CLINICA RECANTO</option></select></div>
            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Plano</label><input type="text" id="in-plano" class="w-full border p-2 rounded text-sm"></div>
            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Acomodação</label><input type="text" id="in-acomodacao" class="w-full border p-2 rounded text-sm"></div>
            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tipo Internação</label><input type="text" id="in-internacao" class="w-full border p-2 rounded text-sm"></div>
            <div><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">CID</label><input type="text" id="in-cid" class="w-full border p-2 rounded text-sm"></div>
            <div class="col-span-2"><label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Caráter</label><select id="in-carater" class="w-full border p-2 rounded text-sm bg-white"><option>Eletivo</option><option>Urgência/Emergência</option></select></div>
        </div>`;
    
    openModal("Cadastro Detalhado de Internação", formHtml, true, () => {
        const nome = document.getElementById('in-nome').value;
        if (!nome) return alert("Por favor, preencha o nome.");
        const novoId = Math.floor(Math.random() * 900000) + 100000;
        dadosInternacoes.push({
            id: novoId, data: new Date().toLocaleDateString('pt-BR'), nome: nome.toUpperCase(), hospital: document.getElementById('in-hosp').value, confirmado: false
        });
        prontuarioCarefy[novoId] = { 
            idade: "N/D", nascimento: "N/D", empresa: "Quallity", custo: "R$ 0,00", 
            plano: document.getElementById('in-plano').value, acomodacao: document.getElementById('in-acomodacao').value, 
            internacao: document.getElementById('in-internacao').value, cid: document.getElementById('in-cid').value, 
            diagnostico: "Cadastro: " + document.getElementById('in-carater').value, 
            timeline: [{ data: new Date().toLocaleString(), obs: "Internação cadastrada.", prof: "SISTEMA" }] 
        };
        renderizarCenso(); closeModal();
    });
};

document.addEventListener('click', (e) => {
    const target = e.target;
    const id = parseInt(target.getAttribute('data-id'));
    if (target.classList.contains('btn-confirmar')) { const p = dadosInternacoes.find(p => p.id === id); if(p) { p.confirmado = true; renderizarCenso(); } }
    if (target.classList.contains('btn-remover')) { if (confirm("Tem certeza que deseja remover?")) { dadosInternacoes = dadosInternacoes.filter(p => p.id !== id); renderizarCenso(); } }
    if (target.classList.contains('btn-ver')) {
        const p = dadosInternacoes.find(x => x.id === id);
        const info = prontuarioCarefy[id];
        if (info) {
            const timelineHtml = info.timeline.map(t => `<div class="border-l-2 border-blue-100 pl-4 pb-4 relative ml-2"><div class="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div><p class="text-[10px] font-bold text-blue-600">${t.data}</p><p class="text-xs text-gray-700 font-medium">${t.obs}</p><p class="text-[9px] text-gray-400 uppercase">Responsável: ${t.prof}</p></div>`).join('');
            openModal(`Prontuário: ${p.nome}`, `
                <div class="space-y-5">
                    <div class="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div><p class="text-[10px] text-blue-400 font-bold uppercase">Idade / Nasc.</p><p class="text-xs font-bold">${info.idade} (${info.nascimento})</p></div>
                        <div><p class="text-[10px] text-blue-400 font-bold uppercase">Projeção Custo</p><p class="text-xs font-bold text-green-600">${info.custo}</p></div>
                        <div><p class="text-[10px] text-blue-400 font-bold uppercase">Plano</p><p class="text-xs font-bold">${info.plano || 'N/D'}</p></div>
                        <div><p class="text-[10px] text-blue-400 font-bold uppercase">Acomodação</p><p class="text-xs font-bold">${info.acomodacao || 'N/D'}</p></div>
                        <div><p class="text-[10px] text-blue-400 font-bold uppercase">Internação</p><p class="text-xs font-bold">${info.internacao || 'N/D'}</p></div>
                        <div><p class="text-[10px] text-blue-400 font-bold uppercase">CID</p><p class="text-xs font-bold">${info.cid || 'N/D'}</p></div>
                    </div>
                    <div><h4 class="text-xs font-bold text-gray-700 mb-2 uppercase border-b pb-1">Diagnóstico</h4><p class="text-xs p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-600 italic">"${info.diagnostico}"</p></div>
                    <div><h4 class="text-xs font-bold text-gray-700 mb-4 uppercase border-b pb-1">Linha do Tempo</h4><div id="container-timeline" class="mt-2">${timelineHtml}</div></div>
                </div>
                <div class="bg-gray-50 p-3 mt-4 rounded border border-gray-200">
                    <textarea id="nova-evolucao" rows="2" class="w-full text-xs p-2 border rounded" placeholder="Digite a nova evolução..."></textarea>
                    <button onclick="salvarEvolucao(${p.id})" class="mt-2 w-full bg-blue-600 text-white text-[10px] py-1 rounded">SALVAR EVOLUÇÃO</button>
                </div>
            `);
        }
    }
});

if(searchInput) {
    searchInput.oninput = (e) => {
        const termo = e.target.value.toLowerCase();
        document.querySelectorAll('.hospital-card').forEach(card => {
            let matches = false;
            card.querySelectorAll('.p-3').forEach(row => { const text = row.innerText.toLowerCase(); const isMatch = text.includes(termo); row.style.display = isMatch ? 'flex' : 'none'; if(isMatch) matches = true; });
            card.style.display = matches ? 'block' : 'none';
        });
    };
}

const btnExportar = document.getElementById('btn-exportar');
if(btnExportar) {
    btnExportar.onclick = () => {
        let csv = "\uFEFFID;DATA;NOME;HOSPITAL;STATUS\n" + dadosInternacoes.map(p => `${p.id};${p.data};${p.nome};${p.hospital};${p.confirmado ? 'Confirmado' : 'Pendente'}`).join("\n");
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `censo_quallity_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`; link.click();
    };
}

const btnSair = document.querySelector('a[href="login.html"]');
if (btnSair) { btnSair.onclick = (e) => { e.preventDefault(); if(confirm("Encerrar sessão?")) window.location.href = 'login.html'; }; }

renderizarCenso();