// ========== ÉTAT ==========
let state = {
    education: [],
    distinctions: [],
    languages: []
};

// ========== DOM REFS ==========
const DOM = {
    fullName: document.getElementById('fullName'),
    nationality: document.getElementById('nationality'),
    birthDate: document.getElementById('birthDate'),
    address: document.getElementById('address'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    links: document.getElementById('links'),
    objectiveText: document.getElementById('objectiveText'),
    contests: document.getElementById('contests'),
    specializations: document.getElementById('specializations'),
    techSkills: document.getElementById('techSkills'),
    interestsList: document.getElementById('interestsList'),
    qualitiesList: document.getElementById('qualitiesList'),
    educationContainer: document.getElementById('educationContainer'),
    distinctionsContainer: document.getElementById('distinctionsContainer'),
    languagesContainer: document.getElementById('languagesContainer'),
    preview: document.getElementById('cvPreview'),
    btnGenerate: document.getElementById('btnGeneratePreview'),
    btnExport: document.getElementById('btnExportPDF'),
    btnPrint: document.getElementById('btnPrint')
};

// ========== ACCORDÉONS ==========
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
        const target = document.getElementById(this.dataset.target);
        if (!target) return;
        
        const isOpen = target.classList.contains('open');
        this.classList.toggle('active');
        target.classList.toggle('open');
        
        // Fermer les autres du même niveau (optionnel)
        // Pour une expérience plus propre, on peut tout fermer sauf celui-ci
    });
});

// ========== FORMATION ==========
document.getElementById('addEducation').addEventListener('click', () => {
    const id = Date.now();
    state.education.push({ id, title: '', institution: '', year: '' });
    renderEducation();
});

function renderEducation() {
    DOM.educationContainer.innerHTML = state.education.map(edu => `
        <div class="education-item" data-id="${edu.id}">
            <button class="remove-item" onclick="removeEducation(${edu.id})">✕</button>
            <input type="text" placeholder="Diplôme / Formation (ex: CPGE MP)" value="${edu.title}" onchange="updateEducation(${edu.id}, 'title', this.value)" />
            <input type="text" placeholder="Établissement" value="${edu.institution}" onchange="updateEducation(${edu.id}, 'institution', this.value)" />
            <input type="text" placeholder="Année (ex: 2025-2026)" value="${edu.year}" onchange="updateEducation(${edu.id}, 'year', this.value)" />
        </div>
    `).join('');
}

window.removeEducation = function(id) {
    state.education = state.education.filter(e => e.id !== id);
    renderEducation();
};

window.updateEducation = function(id, field, value) {
    const item = state.education.find(e => e.id === id);
    if (item) item[field] = value;
};

// ========== DISTINCTIONS ==========
document.getElementById('addDistinction').addEventListener('click', () => {
    const id = Date.now();
    state.distinctions.push({ id, title: '', year: '' });
    renderDistinctions();
});

function renderDistinctions() {
    DOM.distinctionsContainer.innerHTML = state.distinctions.map(d => `
        <div class="distinction-item" data-id="${d.id}">
            <button class="remove-item" onclick="removeDistinction(${d.id})">✕</button>
            <input type="text" placeholder="Distinction / Certificat" value="${d.title}" onchange="updateDistinction(${d.id}, 'title', this.value)" />
            <input type="text" placeholder="Année" value="${d.year}" onchange="updateDistinction(${d.id}, 'year', this.value)" />
        </div>
    `).join('');
}

window.removeDistinction = function(id) {
    state.distinctions = state.distinctions.filter(d => d.id !== id);
    renderDistinctions();
};

window.updateDistinction = function(id, field, value) {
    const item = state.distinctions.find(d => d.id === id);
    if (item) item[field] = value;
};

// ========== LANGUES ==========
document.getElementById('addLanguage').addEventListener('click', () => {
    const id = Date.now();
    state.languages.push({ id, name: '', level: '' });
    renderLanguages();
});

function renderLanguages() {
    DOM.languagesContainer.innerHTML = state.languages.map(l => `
        <div class="language-item" data-id="${l.id}">
            <button class="remove-item" onclick="removeLanguage(${l.id})">✕</button>
            <input type="text" placeholder="Langue (ex: Arabe)" value="${l.name}" onchange="updateLanguage(${l.id}, 'name', this.value)" />
            <input type="text" placeholder="Niveau (ex: langue maternelle)" value="${l.level}" onchange="updateLanguage(${l.id}, 'level', this.value)" />
        </div>
    `).join('');
}

window.removeLanguage = function(id) {
    state.languages = state.languages.filter(l => l.id !== id);
    renderLanguages();
};

window.updateLanguage = function(id, field, value) {
    const item = state.languages.find(l => l.id === id);
    if (item) item[field] = value;
};

// ========== GÉNÉRER L'APERÇU ==========
DOM.btnGenerate.addEventListener('click', generatePreview);

function generatePreview() {
    const data = getFormData();
    
    let html = `
        <style>
            .cv-academic {
                font-family: 'Inter', -apple-system, sans-serif;
                max-width: 100%;
                color: #1a1a2e;
            }
            .cv-academic .header {
                text-align: center;
                padding-bottom: 16px;
                border-bottom: 2px solid #1a56db;
                margin-bottom: 16px;
            }
            .cv-academic .header h1 {
                font-size: 24px;
                font-weight: 700;
                color: #1a1a2e;
                margin-bottom: 2px;
            }
            .cv-academic .header .subtitle {
                font-size: 14px;
                color: #1a56db;
                font-weight: 500;
            }
            .cv-academic .header .contact {
                font-size: 12px;
                color: #4b5563;
                margin-top: 6px;
                display: flex;
                justify-content: center;
                gap: 16px;
                flex-wrap: wrap;
            }
            .cv-academic .section {
                margin-bottom: 14px;
            }
            .cv-academic .section-title {
                font-weight: 700;
                font-size: 14px;
                color: #1a56db;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 3px;
                margin-bottom: 8px;
            }
            .cv-academic .section-content {
                font-size: 13px;
                color: #1e293b;
                line-height: 1.5;
            }
            .cv-academic .section-content p {
                margin-bottom: 4px;
            }
            .cv-academic .grid-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px 24px;
            }
            .cv-academic .tag {
                display: inline-block;
                background: #dbeafe;
                color: #1e40af;
                padding: 1px 10px;
                border-radius: 12px;
                font-size: 12px;
                margin: 2px 4px 2px 0;
            }
            .cv-academic .badge {
                display: inline-block;
                background: #fef3c7;
                color: #92400e;
                padding: 1px 10px;
                border-radius: 12px;
                font-size: 11px;
                margin-left: 6px;
            }
            .cv-academic .item {
                margin-bottom: 8px;
            }
            .cv-academic .item .title {
                font-weight: 600;
                font-size: 13px;
            }
            .cv-academic .item .sub {
                font-size: 12px;
                color: #4b5563;
            }
            .cv-academic .item .desc {
                font-size: 12px;
                color: #4b5563;
                margin-top: 2px;
            }
            .cv-academic .watermark {
                text-align: center;
                font-size: 10px;
                color: #94a3b8;
                margin-top: 16px;
                padding-top: 10px;
                border-top: 1px solid #e2e8f0;
            }
            @media print {
                .cv-academic .header h1 { font-size: 20px; }
                .cv-academic { font-size: 11px; }
            }
        </style>
        <div class="cv-academic">
            <div class="header">
                <h1>${data.fullName || 'Nom Prénom'}</h1>
                <div class="subtitle">${data.specializations || 'Étudiant en CPGE'}</div>
                <div class="contact">
                    ${data.email ? `<span>📧 ${data.email}</span>` : ''}
                    ${data.phone ? `<span>📞 ${data.phone}</span>` : ''}
                    ${data.address ? `<span>📍 ${data.address}</span>` : ''}
                    ${data.links ? `<span>🔗 ${data.links}</span>` : ''}
                </div>
            </div>
    `;

    // ===== FORMATION =====
    if (data.education.length) {
        html += `<div class="section"><div class="section-title">🎓 Formation</div><div class="section-content">`;
        data.education.forEach(edu => {
            html += `
                <div class="item">
                    <div class="title">${edu.title || 'Formation'}</div>
                    <div class="sub">${edu.institution || ''} ${edu.year ? '· ' + edu.year : ''}</div>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    // ===== OBJECTIF =====
    if (data.objective) {
        html += `<div class="section"><div class="section-title">🎯 Objectif académique</div><div class="section-content">`;
        html += `<p>${data.objective}</p>`;
        if (data.contests) {
            html += `<p style="margin-top:4px;font-weight:500;font-size:12px;">Concours visés : ${data.contests}</p>`;
        }
        html += `</div></div>`;
    }

    // ===== DISTINCTIONS =====
    if (data.distinctions.length) {
        html += `<div class="section"><div class="section-title">🏆 Distinctions et certificats</div><div class="section-content">`;
        data.distinctions.forEach(d => {
            html += `<div class="item"><span class="title">${d.title || 'Distinction'}</span> <span class="badge">${d.year || ''}</span></div>`;
        });
        html += `</div></div>`;
    }

    // ===== COMPÉTENCES =====
    if (data.specializations || data.techSkills) {
        html += `<div class="section"><div class="section-title">💻 Compétences informatiques</div><div class="section-content">`;
        if (data.specializations) {
            html += `<p><strong>Domaines :</strong> ${data.specializations}</p>`;
        }
        if (data.techSkills) {
            const skills = data.techSkills.split(',').map(s => s.trim()).filter(s => s);
            html += `<div>${skills.map(s => `<span class="tag">${s}</span>`).join('')}</div>`;
        }
        html += `</div></div>`;
    }

    // ===== LANGUES =====
    if (data.languages.length) {
        html += `<div class="section"><div class="section-title">🌍 Langues</div><div class="section-content">`;
        data.languages.forEach(l => {
            html += `<div class="item"><span class="title">${l.name || 'Langue'}</span> : ${l.level || ''}</div>`;
        });
        html += `</div></div>`;
    }

    // ===== CENTRES D'INTÉRÊT =====
    if (data.interests) {
        const interests = data.interests.split(',').map(s => s.trim()).filter(s => s);
        html += `<div class="section"><div class="section-title">❤️ Centres d'intérêt</div><div class="section-content">`;
        html += `<p>${interests.join(' · ')}</p>`;
        html += `</div></div>`;
    }

    // ===== QUALITÉS =====
    if (data.qualities) {
        const qualities = data.qualities.split(',').map(s => s.trim()).filter(s => s);
        html += `<div class="section"><div class="section-title">⭐ Qualités personnelles</div><div class="section-content">`;
        html += `<p>${qualities.join(' · ')}</p>`;
        html += `</div></div>`;
    }

    // ===== WATERMARK =====
    html += `<div class="watermark">Créé avec CV Builder Pro</div>`;

    html += `</div>`;
    DOM.preview.innerHTML = html;
}

function getFormData() {
    return {
        fullName: DOM.fullName.value,
        nationality: DOM.nationality.value,
        birthDate: DOM.birthDate.value,
        address: DOM.address.value,
        email: DOM.email.value,
        phone: DOM.phone.value,
        links: DOM.links.value,
        objective: DOM.objectiveText.value,
        contests: DOM.contests.value,
        specializations: DOM.specializations.value,
        techSkills: DOM.techSkills.value,
        interests: DOM.interestsList.value,
        qualities: DOM.qualitiesList.value,
        education: state.education,
        distinctions: state.distinctions,
        languages: state.languages
    };
}

// ========== EXPORT PDF ==========
DOM.btnExport.addEventListener('click', () => {
    const element = document.getElementById('cvPreview');
    if (!element || element.innerHTML.includes('Remplissez le formulaire')) {
        alert('Veuillez d\'abord générer votre CV !');
        return;
    }
    
    const opt = {
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: 'CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
});

// ========== IMPRIMER ==========
DOM.btnPrint.addEventListener('click', () => {
    window.print();
});

// ========== INIT ==========
setTimeout(() => {
    // Ajouter des exemples par défaut (comme dans ton CV)
    document.getElementById('addEducation').click();
    document.getElementById('addEducation').click();
    document.getElementById('addDistinction').click();
    document.getElementById('addDistinction').click();
    document.getElementById('addDistinction').click();
    document.getElementById('addLanguage').click();
    document.getElementById('addLanguage').click();
    
    // Remplir les champs avec tes infos
    DOM.fullName.value = 'Hamza Margal';
    DOM.nationality.value = 'Marocaine';
    DOM.birthDate.value = '29/05/2006';
    DOM.address.value = 'Dyar al alya GH5 IMM1 Étage 4 APP18 Beni Yakhlaf, Mohammedia';
    DOM.email.value = 'hamzamargal2005@gmail.com';
    DOM.phone.value = '+212 781254076';
    DOM.links.value = 'GitHub: HamzaBey · LinkedIn: Hamza Margal';
    DOM.objectiveText.value = 'Étudiant en classes préparatoires scientifiques (CPGE), je souhaite poursuivre une formation d\'ingénieur en France afin d\'approfondir mes compétences scientifiques (mathématiques, physique, informatique) et de me préparer à des carrières à forte valeur technologique et scientifique.';
    DOM.contests.value = 'CCINP, Concours commun Mines-Pont';
    DOM.specializations.value = 'Mathématiques · Physique · Chimie · Informatique · SI';
    DOM.techSkills.value = 'Python, JavaScript, HTML/CSS, Git, MATLAB';
    DOM.interestsList.value = 'Sciences et technologies, Vulgarisation scientifique, Programmation et résolution de problèmes, Informatique, IA';
    DOM.qualitiesList.value = 'Rigueur scientifique, Esprit analytique, Autonomie et persévérance, Capacité de travail intensive, Capacité de gérer les travaux en groupes';
    
    // Mettre à jour les items avec les vraies données
    setTimeout(() => {
        // Formation
        const eduItems = document.querySelectorAll('.education-item');
        if (eduItems.length >= 2) {
            const inputs1 = eduItems[0].querySelectorAll('input');
            inputs1[0].value = 'CPGE MP et président BDE';
            inputs1[1].value = 'Lycée technique Mohammedia (LTM) · Mohammedia';
            inputs1[2].value = '2025-2026';
            
            const inputs2 = eduItems[1].querySelectorAll('input');
            inputs2[0].value = 'CPGE MPSI';
            inputs2[1].value = 'Lycée technique Mohammedia (LTM) · Mohammedia';
            inputs2[2].value = '2024-2025';
        }
        
        // Distinctions
        const distItems = document.querySelectorAll('.distinction-item');
        if (distItems.length >= 3) {
            const d1 = distItems[0].querySelectorAll('input');
            d1[0].value = 'Bac SM A Mention Très Bien';
            d1[1].value = '2024';
            
            const d2 = distItems[1].querySelectorAll('input');
            d2[0].value = 'Certificat d\'éloquence et d\'argumentation en arabe - 1ER PRIX';
            d2[1].value = '2023';
            
            const d3 = distItems[2].querySelectorAll('input');
            d3[0].value = 'Certificat Tajwid - 1ER PRIX';
            d3[1].value = '2022';
        }
        
        // Langues
        const langItems = document.querySelectorAll('.language-item');
        if (langItems.length >= 2) {
            const l1 = langItems[0].querySelectorAll('input');
            l1[0].value = 'Arabe';
            l1[1].value = 'langue maternelle';
            
            const l2 = langItems[1].querySelectorAll('input');
            l2[0].value = 'Français';
            l2[1].value = 'langue d\'enseignement scientifique';
        }
        
        generatePreview();
    }, 200);
}, 100);
