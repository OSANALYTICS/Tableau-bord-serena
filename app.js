/* ─────────────────────────────────────────────────────────────
   STORAGE.JS  ─  data, localStorage, Excel import
───────────────────────────────────────────────────────────── */
window.currentChartData  = null;
window.currentDefectsData = null;

const moisFR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function formatFrenchDate(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]} ${moisFR[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
}

let dailyRecords = [
    { p: 'WC SERENA NEW', d: [
        {dt:"2026-05-07",b:21,r:2,t:28},{dt:"2026-05-08",b:15,r:3,t:26},{dt:"2026-05-09",b:12,r:5,t:22},
        {dt:"2026-05-10",b:8,r:1,t:11},{dt:"2026-05-11",b:14,r:5,t:19},{dt:"2026-05-12",b:0,r:0,t:0},
        {dt:"2026-05-13",b:13,r:7,t:24},{dt:"2026-05-14",b:13,r:3,t:20},{dt:"2026-05-15",b:17,r:6,t:33},
        {dt:"2026-05-16",b:27,r:2,t:37},{dt:"2026-05-17",b:17,r:4,t:30},{dt:"2026-05-18",b:17,r:2,t:23},
        {dt:"2026-05-19",b:11,r:3,t:16},{dt:"2026-05-20",b:16,r:6,t:25},{dt:"2026-05-21",b:11,r:4,t:18},
        {dt:"2026-05-22",b:17,r:7,t:29},{dt:"2026-05-23",b:11,r:4,t:18}
    ]},
    { p: 'WC SERENA NOIR', d: [
        {dt:"2026-05-01",b:17,r:4,t:25},{dt:"2026-05-02",b:24,r:20,t:57},{dt:"2026-05-03",b:30,r:17,t:65},
        {dt:"2026-05-04",b:12,r:5,t:27},{dt:"2026-05-05",b:13,r:6,t:29},{dt:"2026-05-06",b:35,r:8,t:65},
        {dt:"2026-05-07",b:30,r:10,t:63},{dt:"2026-05-08",b:29,r:14,t:64},{dt:"2026-05-09",b:15,r:6,t:29},
        {dt:"2026-05-10",b:23,r:15,t:60},{dt:"2026-05-11",b:4,r:6,t:13},{dt:"2026-05-12",b:14,r:16,t:38},
        {dt:"2026-05-13",b:15,r:4,t:24},{dt:"2026-05-14",b:9,r:6,t:27},{dt:"2026-05-17",b:17,r:11,t:45},
        {dt:"2026-05-18",b:25,r:22,t:58},{dt:"2026-05-19",b:17,r:28,t:72},{dt:"2026-05-21",b:13,r:10,t:33},
        {dt:"2026-05-23",b:13,r:10,t:33}
    ]},
    { p: 'WC SERENA', d: [
        {dt:"2026-05-01",b:36,r:35,t:81},{dt:"2026-05-02",b:11,r:13,t:30},{dt:"2026-05-04",b:41,r:23,t:79},
        {dt:"2026-05-05",b:5,r:6,t:13},{dt:"2026-05-06",b:26,r:10,t:56},{dt:"2026-05-07",b:56,r:20,t:110},
        {dt:"2026-05-08",b:18,r:9,t:40},{dt:"2026-05-09",b:15,r:15,t:34},{dt:"2026-05-10",b:6,r:12,t:27},
        {dt:"2026-05-11",b:35,r:14,t:65},{dt:"2026-05-12",b:7,r:9,t:22},{dt:"2026-05-13",b:26,r:22,t:57},
        {dt:"2026-05-14",b:17,r:20,t:47},{dt:"2026-05-15",b:27,r:18,t:57},{dt:"2026-05-16",b:16,r:20,t:43},
        {dt:"2026-05-17",b:18,r:15,t:43},{dt:"2026-05-18",b:35,r:18,t:66},{dt:"2026-05-19",b:6,r:11,t:22},
        {dt:"2026-05-20",b:31,r:38,t:86},{dt:"2026-05-21",b:18,r:29,t:65},{dt:"2026-05-22",b:46,r:52,t:115},
        {dt:"2026-05-23",b:18,r:29,t:65}
    ]}
];

let defectsData = {
    'WC SERENA NEW':  { labels:['Déformation','Corps Étrangers',"Trou d'Air",'Finition','Retrait Émail AR','Tache Émail','Gerces Coul REBUT','Grains Émail','Point Noir','Préchauffe Cuis'], counts:[24,19,19,16,9,7,6,6,5,5] },
    'WC SERENA NOIR': { labels:["Trou d'Air",'Déformation','Finition','Retrait Émail AR','Corps Étrangers','Coup Cuis','Préchauffe Cuis','Gerces Coul REBUT','Grains Émail','Grain Four'], counts:[93,84,68,36,29,28,27,25,25,11] },
    'WC SERENA':      { labels:['Finition','Déformation','Gerces Coul REBUT',"Trou d'Air",'Filage','Corps Étrangers','Coup Cuis','Grains Émail','Préchauffe Cuis','Retrait Émail AR'], counts:[139,123,57,54,40,35,25,24,20,16] }
};

let defectRows = [];

Chart.register(ChartDataLabels);
Chart.defaults.color = '#9ca3af';

function recomputeAllDates() {
    allUniqueDates = new Set();
    dailyRecords.forEach(record => record.d.forEach(r => allUniqueDates.add(r.dt)));
    defectRows.forEach(row => { if (row.date) allUniqueDates.add(row.date); });
    allDates = Array.from(allUniqueDates).sort();
}

let allUniqueDates = new Set();
dailyRecords.forEach(record => record.d.forEach(r => allUniqueDates.add(r.dt)));
let allDates = Array.from(allUniqueDates).sort();

function updateRecordCount() {
    let total = 0;
    dailyRecords.forEach(r => total += r.d.length);
    const el = document.getElementById('record-count');
    if (el) el.textContent = total;
}

function saveToLocalStorage() {
    localStorage.setItem('wcSerena_daily',             JSON.stringify(dailyRecords));
    localStorage.setItem('wcSerena_defects',           JSON.stringify(defectsData));
    localStorage.setItem('wcSerena_defectRows',        JSON.stringify(defectRows));
    localStorage.setItem('wcSerena_productAttributes', JSON.stringify(productAttributes));
    localStorage.setItem('wcSerena_availableFeux',     JSON.stringify(availableFeux));
    localStorage.setItem('wcSerena_availableFours',    JSON.stringify(availableFours));
}

function loadFromLocalStorage() {
    const savedDaily      = localStorage.getItem('wcSerena_daily');
    const savedDefects    = localStorage.getItem('wcSerena_defects');
    const savedDefectRows = localStorage.getItem('wcSerena_defectRows');
    const savedPA         = localStorage.getItem('wcSerena_productAttributes');
    const savedFeux       = localStorage.getItem('wcSerena_availableFeux');
    const savedFours      = localStorage.getItem('wcSerena_availableFours');
    if (savedDaily && savedDefects) {
        dailyRecords = JSON.parse(savedDaily);
        defectsData  = JSON.parse(savedDefects);
        if (savedDefectRows) defectRows        = JSON.parse(savedDefectRows);
        if (savedPA)         productAttributes = JSON.parse(savedPA);
        if (savedFeux)       availableFeux     = JSON.parse(savedFeux);
        if (savedFours)      availableFours    = JSON.parse(savedFours);
        recomputeAllDates();
    }
}

function parseDateSaisie(raw) {
    if (!raw) return null;
    if (typeof raw === 'number') return excelDateToJSDate(raw);
    if (typeof raw === 'string') {
        if (raw.startsWith('Date(')) {
            const p = raw.replace('Date(','').replace(')','').split(',').map(Number);
            return new Date(p[0], p[1], p[2]);
        }
        const dmy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (dmy) return new Date(parseInt(dmy[3]), parseInt(dmy[2]) - 1, parseInt(dmy[1]));
        const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (ymd) return new Date(parseInt(ymd[1]), parseInt(ymd[2]) - 1, parseInt(ymd[3]));
    }
    return null;
}

function excelDateToJSDate(serial) {
    const utcDays  = Math.floor(serial - 25569);
    const dateInfo = new Date(utcDays * 86400 * 1000);
    return new Date(dateInfo.getFullYear(), dateInfo.getMonth(), dateInfo.getDate());
}

function normalizeModelName(name) {
    return (name === null || name === undefined) ? '' : String(name).replace(/\s+/g, ' ').trim();
}

function parseWorkbookData(workbook) {
    const METADATA_COLS = new Set([
        'Date Saisie', 'Modèle Produit', 'Type de Feu', 'Four',
        'Total Triées', 'Pièces Bonnes', 'À Réparer', 'Rebuts', 'Rendement %'
    ]);
    const newDailyRecords    = {};
    const importedDefectRows = [];
    const importedFeux       = new Set();
    const importedFours      = new Set();
    const newProductAttrs    = {};
    let sheetFound = false;

    for (const sheetName of workbook.SheetNames) {
        const sheet   = workbook.Sheets[sheetName];
        const jsonRaw = XLSX.utils.sheet_to_json(sheet);
        if (!jsonRaw.length) continue;
        const keys = Object.keys(jsonRaw[0]);
        if (!keys.includes('Date Saisie') || !keys.includes('Modèle Produit')) continue;
        const defectCols = keys.filter(k => !METADATA_COLS.has(k));
        sheetFound = true;

        jsonRaw.forEach(row => {
            const dateRaw = row['Date Saisie'];
            const model   = normalizeModelName(row['Modèle Produit']);
            if (!dateRaw || !model) return;
            let dateObj = parseDateSaisie(dateRaw);
            if (!dateObj || isNaN(dateObj.getTime())) return;
            const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(dateObj.getDate()).padStart(2,'0')}`;
            const feu  = row['Type de Feu'] || undefined;
            const four = row['Four']        || undefined;
            const b    = parseInt(row['Pièces Bonnes']) || 0;
            const r    = parseInt(row['Rebuts'])        || 0;
            const rep  = parseInt(row['À Réparer'])     || 0;
            const t    = parseInt(row['Total Triées'])  || (b + r + rep);
            if (feu)  importedFeux.add(feu);
            if (four) importedFours.add(four);
            if (!newDailyRecords[model]) newDailyRecords[model] = [];
            newDailyRecords[model].push({ dt: dateStr, b, r, t, feu, four });
            newProductAttrs[model] = newProductAttrs[model] || {};
            if (feu)  newProductAttrs[model].feu  = feu;
            if (four) newProductAttrs[model].four = four;
            defectCols.forEach(col => {
                const qty = parseInt(row[col]) || 0;
                if (qty > 0) importedDefectRows.push({ model, defType: col, qty, date: dateStr, feu, four });
            });
        });
        break;
    }

    if (!sheetFound) return false;
    dailyRecords      = Object.entries(newDailyRecords).map(([p, d]) => ({ p, d }));
    defectRows        = importedDefectRows;
    productAttributes = newProductAttrs;
    if (importedFeux.size  > 0) availableFeux  = Array.from(importedFeux).sort();
    if (importedFours.size > 0) availableFours = Array.from(importedFours).sort();
    return true;
}

document.getElementById('excel-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        const workbook = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
        const ok = parseWorkbookData(workbook);
        if (!ok) {
            alert('Format non reconnu. Vérifiez que la feuille contient les colonnes "Date Saisie" et "Modèle Produit".');
            e.target.value = '';
            return;
        }
        refreshDashboard(true, true);
        updateRecordCount();
        saveToLocalStorage();
        alert('Données importées avec succès ! Les graphiques ont été mis à jour.');
        e.target.value = '';
    };
    reader.readAsArrayBuffer(file);
});

/* ─────────────────────────────────────────────────────────────
   CHARTS.JS  ─  product metadata, chart renderers
───────────────────────────────────────────────────────────── */
const gridConfig = { color: 'rgba(255,255,255,0.05)', drawBorder: false };
let compChart, defChart, qualityDonutChart, dashTop10Chart;

function isLightTheme() {
    return document.documentElement.classList.contains('light-theme');
}

function chartTextColor() {
    return isLightTheme() ? '#1e293b' : '#d1d5db';
}

let productAttributes = {
    'WC SERENA NEW':  { feu: '1er feu',  four: 'FOUR TUNNEL' },
    'WC SERENA NOIR': { feu: '1er feu',  four: 'FOUR TUNNEL' },
    'WC SERENA':      { feu: '1er feu',  four: 'FOUR TUNNEL' }
};
let availableFeux  = ['1er feu', '2 Éme'];
let availableFours = ['FOUR TUNNEL', 'FOUR 3'];
let allProductModels = [];

function updateFilterMetadata() {
    const feuxSet   = new Set(availableFeux);
    const foursSet  = new Set(availableFours);
    const modelsSet = new Set();
    dailyRecords.forEach(record => {
        modelsSet.add(record.p);
        const attrs = productAttributes[record.p] || {};
        if (attrs.feu)  feuxSet.add(attrs.feu);
        if (attrs.four) foursSet.add(attrs.four);
    });
    allProductModels = Array.from(modelsSet).sort();
    availableFeux    = Array.from(feuxSet).sort();
    availableFours   = Array.from(foursSet).sort();
}

function getGlobalFilterValues() {
    return {
        model: document.getElementById('global-filter-model').value,
        feu:   document.getElementById('global-filter-feu').value,
        four:  document.getElementById('global-filter-four').value
    };
}

function rowMatchesFeuFour(productName, row, feu, four) {
    const attrs   = productAttributes[productName] || {};
    const rowFeu  = row.feu  || attrs.feu;
    const rowFour = row.four || attrs.four;
    if (feu  !== 'ALL' && rowFeu  !== feu)  return false;
    if (four !== 'ALL' && rowFour !== four) return false;
    return true;
}

function isProductInGlobalFilter(productName) {
    const { model, feu, four } = getGlobalFilterValues();
    if (model !== 'ALL' && productName !== model) return false;
    if (feu === 'ALL' && four === 'ALL') return true;
    const rec = dailyRecords.find(r => r.p === productName);
    const prodData = rec ? rec.d : [];
    return prodData.some(row => rowMatchesFeuFour(productName, row, feu, four));
}

function getFilteredProductNames() {
    return dailyRecords.map(r => r.p).filter(p => isProductInGlobalFilter(p));
}

function getSelectedTreeDates() {
    return Array.from(document.querySelectorAll('#tree-container .tree-day-cb:checked'))
        .map(cb => cb.value).sort();
}

function getWeekKey(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dow = date.getDay();
    date.setDate(date.getDate() + (dow === 0 ? -6 : 1 - dow));
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function buildWeekBuckets(selectedDates) {
    const buckets = {};
    selectedDates.forEach(dt => {
        const key = getWeekKey(dt);
        (buckets[key] = buckets[key] || []).push(dt);
    });
    return Object.keys(buckets).sort().map(key => ({ key, dates: buckets[key].sort() }));
}

function formatWeekLabel(dates) {
    const first = dates[0], last = dates[dates.length - 1];
    const d1 = parseInt(first.split('-')[2], 10);
    const d2 = parseInt(last.split('-')[2], 10);
    const m1 = moisFR[parseInt(first.split('-')[1], 10) - 1].slice(0, 3);
    return first === last ? `${d1} ${m1}` : `${d1}-${d2} ${m1}`;
}

function isDateInGlobalFilter() { return true; }

function populateGlobalFilterOptions() {
    updateFilterMetadata();
    const modelSelect = document.getElementById('global-filter-model');
    const feuSelect   = document.getElementById('global-filter-feu');
    const fourSelect  = document.getElementById('global-filter-four');
    modelSelect.innerHTML = '<option value="ALL">Tous les modèles</option>';
    feuSelect.innerHTML   = '<option value="ALL">Tous les types</option>';
    fourSelect.innerHTML  = '<option value="ALL">Tous les fours</option>';
    allProductModels.forEach(m => { const o=document.createElement('option'); o.value=m; o.textContent=m; modelSelect.appendChild(o); });
    availableFeux.forEach(f  => { const o=document.createElement('option'); o.value=f; o.textContent=f; feuSelect.appendChild(o);   });
    availableFours.forEach(f => { const o=document.createElement('option'); o.value=f; o.textContent=f; fourSelect.appendChild(o);  });
}

function handleGlobalFilterChange() {
    renderComparatif();
    renderQuotidienTable();
    renderDefautsView();
}

function resetGlobalFilters() {
    document.getElementById('global-filter-model').value = 'ALL';
    document.getElementById('global-filter-feu').value   = 'ALL';
    document.getElementById('global-filter-four').value  = 'ALL';
    toggleAllTreeNodes(true);
}

function calcProductTotals(productName, selectedDates) {
    const { feu, four } = getGlobalFilterValues();
    const rec = dailyRecords.find(r => r.p === productName);
    const prodData = rec ? rec.d : [];
    let totT=0, totB=0, totR=0, totRep=0;
    prodData.forEach(row => {
        if (selectedDates.includes(row.dt) && rowMatchesFeuFour(productName, row, feu, four)) {
            totT += row.t; totB += row.b; totR += row.r;
            totRep += (row.t - row.b - row.r);
        }
    });
    return { yieldPct: totT > 0 ? ((totB/totT)*100).toFixed(2) : '0.00', totT, totB, totRep, totR };
}

function computeGlobalTotals(selectedDates, selectedRefs) {
    let totT=0, totB=0, totR=0, totRep=0;
    selectedRefs.forEach(prodName => {
        const k = calcProductTotals(prodName, selectedDates);
        totT += k.totT; totB += k.totB; totR += k.totR; totRep += k.totRep;
    });
    return { totT, totB, totR, totRep };
}

function updateKPIs(selectedDates, selectedRefs) {
    const toggleCard = (cardId, prodName, pctId, tId, bId, repId, rId) => {
        const card = document.getElementById(cardId);
        if (selectedRefs.includes(prodName)) {
            card.style.display = 'flex';
            const k = calcProductTotals(prodName, selectedDates);
            document.getElementById(pctId).innerText = `${k.yieldPct}%`;
            document.getElementById(tId).innerHTML   = `TOTAL TRIES <span class="kpi-num kpi-num-white">${k.totT}</span>`;
            document.getElementById(bId).innerHTML   = `PIÈCES BONNES <span class="kpi-num kpi-num-green">${k.totB}</span>`;
            document.getElementById(repId).innerHTML = `À RÉPARER <span class="kpi-num kpi-num-yellow">${k.totRep}</span>`;
            document.getElementById(rId).innerHTML   = `REBUTS <span class="kpi-num kpi-num-red">${k.totR}</span>`;
        } else {
            card.style.display = 'none';
        }
    };
    toggleCard('kpi-card-new',       'WC SERENA NEW',  'kpi-new-pct',       'kpi-new-t',       'kpi-new-b',       'kpi-new-rep',       'kpi-new-r');
    toggleCard('kpi-card-noir',      'WC SERENA NOIR', 'kpi-noir-pct',      'kpi-noir-t',      'kpi-noir-b',      'kpi-noir-rep',      'kpi-noir-r');
    toggleCard('kpi-card-classique', 'WC SERENA',      'kpi-classique-pct', 'kpi-classique-t', 'kpi-classique-b', 'kpi-classique-rep', 'kpi-classique-r');

    const count = selectedRefs.length;
    document.getElementById('kpi-container').className =
        `grid grid-cols-1 ${count===3?'md:grid-cols-2 xl:grid-cols-3':count===2?'md:grid-cols-2':'md:grid-cols-1'} gap-4`;
}

function renderComparatif() {
    const selectedRefs = ['WC SERENA NEW', 'WC SERENA NOIR', 'WC SERENA'].filter(ref => isProductInGlobalFilter(ref));

    const selectedDates = getSelectedTreeDates();
    const isFullRange = selectedDates.length === allDates.length && allDates.length > 0;
    const weekBuckets  = isFullRange ? buildWeekBuckets(selectedDates) : null;
    const labels = isFullRange ? weekBuckets.map(b => formatWeekLabel(b.dates)) : selectedDates.map(d => d.split('-')[2]);

    if (selectedDates.length > 0) {
        document.getElementById('chart-title').innerHTML =
            `Évolution Temporelle <span class="text-indigo-500 text-sm ml-2 font-normal">| ${formatFrenchDate(selectedDates[0])} au ${formatFrenchDate(selectedDates[selectedDates.length-1])}${isFullRange ? ' · par semaine' : ' · par jour'}</span>`;
    } else {
        document.getElementById('chart-title').innerHTML =
            `Évolution Temporelle <span class="text-indigo-500 text-sm ml-2 font-normal">| Aucune date sélectionnée</span>`;
    }

    const getYieldArray = (productName) => {
        const rec = dailyRecords.find(r => r.p === productName);
        const { feu, four } = getGlobalFilterValues();
        if (!rec) return (isFullRange ? weekBuckets : selectedDates).map(() => null);
        if (isFullRange) {
            return weekBuckets.map(bucket => {
                let totB = 0, totT = 0;
                bucket.dates.forEach(dateStr => {
                    const dr = rec.d.find(r => r.dt === dateStr && rowMatchesFeuFour(productName, r, feu, four));
                    if (dr) { totB += dr.b; totT += dr.t; }
                });
                return totT > 0 ? parseFloat(((totB / totT) * 100).toFixed(2)) : null;
            });
        }
        return selectedDates.map(dateStr => {
            const dr = rec.d.find(r => r.dt === dateStr && rowMatchesFeuFour(productName, r, feu, four));
            if (!dr || dr.t === 0) return null;
            return parseFloat(((dr.b / dr.t) * 100).toFixed(2));
        });
    };

    const dlCfg = {
        display: true, anchor: 'end', align: 'top',
        formatter: v => v !== null ? v + '%' : '',
        color: chartTextColor(), font: { size: 12, weight: 'bold', family: 'Inter' }, offset: 6
    };

    const ctx = document.getElementById('comparisonChart').getContext('2d');
    const gradient = (r, g, b) => {
        const g2 = ctx.createLinearGradient(0, 0, 0, 400);
        g2.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
        g2.addColorStop(1, `rgba(${r},${g},${b},0.0)`);
        return g2;
    };

    const allDatasets = [
        { id:'WC SERENA NEW',  label:'WC SERENA NEW',  data:getYieldArray('WC SERENA NEW'),  borderColor:'#6366f1', backgroundColor:gradient(99,102,241),   borderWidth:3, fill:true, tension:0.4, spanGaps:true, pointBackgroundColor:'#0b0f19', pointBorderColor:'#6366f1', pointBorderWidth:2, pointRadius:5, pointHoverRadius:8, datalabels:dlCfg },
        { id:'WC SERENA NOIR', label:'WC SERENA NOIR', data:getYieldArray('WC SERENA NOIR'), borderColor:'#94a3b8', backgroundColor:gradient(148,163,184),  borderWidth:3, fill:true, tension:0.4, spanGaps:true, pointBackgroundColor:'#0b0f19', pointBorderColor:'#94a3b8', pointBorderWidth:2, pointRadius:5, pointHoverRadius:8, datalabels:dlCfg },
        { id:'WC SERENA',      label:'WC SERENA',      data:getYieldArray('WC SERENA'),      borderColor:'#f43f5e', backgroundColor:gradient(244,63,94),    borderWidth:3, fill:true, tension:0.4, spanGaps:true, pointBackgroundColor:'#0b0f19', pointBorderColor:'#f43f5e', pointBorderWidth:2, pointRadius:5, pointHoverRadius:8, datalabels:dlCfg }
    ];

    const availableDS = allDatasets.filter(ds => isProductInGlobalFilter(ds.id));
    const datasets    = availableDS.filter(ds => selectedRefs.includes(ds.id));
    window.currentChartData = { labels, datasets };

    if (compChart) {
        compChart.data.labels   = labels;
        compChart.data.datasets = datasets;
        compChart.update();
    } else {
        compChart = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true, maintainAspectRatio: false,
                layout: { padding: { top: 30, right: 20 } },
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: { grid: gridConfig, ticks: { color: chartTextColor(), font: { family: 'Inter', size: 12 } } },
                    y: {
                        min: 0, max: 100, grid: gridConfig,
                        title: { display: true, text: 'Rendement (%)', color: chartTextColor(), font: { size: 13, weight: 'bold', family: 'Inter' }, padding: { bottom: 15 } },
                        ticks: { color: chartTextColor(), font: { family: 'Inter', size: 12 }, padding: 10, callback: v => v + '%' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(31,41,55,0.95)',
                        titleFont: { size: 14, family: 'Inter' },
                        bodyFont: { size: 14, family: 'Inter' },
                        padding: 12, borderColor: '#4b5563', borderWidth: 1, cornerRadius: 4,
                        callbacks: {
                            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y !== null ? ctx.parsed.y + '%' : 'N/A'}`
                        }
                    }
                }
            }
        });
    }
    generateCustomLegend();
    updateKPIs(selectedDates, selectedRefs);

    const totals = computeGlobalTotals(selectedDates, selectedRefs);
    renderQualityDonut(totals);
    renderDashTop10(selectedDates);
}

function renderQualityDonut(totals) {
    const totalEl = document.getElementById('quality-donut-total');
    if (totalEl) totalEl.textContent = totals.totT;

    const labels = ['Bonnes', 'À Réparer', 'Rebuts'];
    const colors = ['#22c55e', '#eab308', '#ef4444'];
    const data   = [totals.totB, totals.totRep, totals.totR];

    if (qualityDonutChart) qualityDonutChart.destroy();
    const ctx = document.getElementById('qualityDonutChart').getContext('2d');
    qualityDonutChart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '70%',
            plugins: { legend: { display: false }, tooltip: { enabled: true }, datalabels: { display: false } }
        }
    });

    const legend = document.getElementById('quality-donut-legend');
    if (legend) {
        legend.innerHTML = labels.map((l, i) => `
            <div class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full" style="background:${colors[i]}"></span>
                <span class="text-gray-400">${l}: <span class="text-white font-semibold">${data[i]}</span></span>
            </div>`).join('');
    }
}

function renderDashTop10(selectedDates) {
    const emptyEl  = document.getElementById('dash-top10-empty');
    const totalEl  = document.getElementById('dash-top10-total');
    const canvasEl = document.getElementById('dashTop10Chart');

    const filtered = defectRows.filter(row => {
        if (!isDefectRowInGlobalFilter(row)) return false;
        if (selectedDates.length > 0 && (!row.date || !selectedDates.includes(row.date))) return false;
        return true;
    });

    const agg    = filtered.reduce((acc, row) => { acc[row.defType] = (acc[row.defType] || 0) + row.qty; return acc; }, {});
    const sorted = Object.entries(agg).sort((a, b) => b[1] - a[1]);
    const top10Labels = sorted.slice(0, 10).map(e => e[0]);
    const top10Counts = sorted.slice(0, 10).map(e => e[1]);
    const totalDefects = sorted.reduce((s, e) => s + e[1], 0);

    if (totalEl) totalEl.textContent = totalDefects > 0 ? `Total : ${totalDefects} défauts` : '';

    if (dashTop10Chart) { dashTop10Chart.destroy(); dashTop10Chart = null; }
    if (top10Labels.length === 0) {
        if (emptyEl)  emptyEl.classList.remove('hidden');
        if (canvasEl) canvasEl.style.display = 'none';
        return;
    }
    if (emptyEl)  emptyEl.classList.add('hidden');
    if (canvasEl) canvasEl.style.display = '';

    const denom    = totalDefects || 1;
    const maxVal   = Math.max(...top10Counts) * 1.3;
    const barColors = top10Counts.map((_, i) => i === 0 ? '#eab308' : '#3b82f6');

    dashTop10Chart = new Chart(canvasEl.getContext('2d'), {
        type: 'bar',
        data: {
            labels: top10Labels,
            datasets: [
                { data: top10Counts, backgroundColor: barColors, barThickness: 14, borderRadius: 4, borderSkipped: false,
                  datalabels: { display: true, anchor: 'end', align: 'right', color: chartTextColor(), font: { family: 'Inter', size: 12, weight: 'bold' },
                    formatter: val => `${((val/denom)*100).toFixed(1).replace('.',',')}%  (${val})` }, zIndex: 2 },
                { data: top10Counts.map(() => maxVal), backgroundColor: isLightTheme() ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', barThickness: 14, borderRadius: 4, borderSkipped: false,
                  datalabels: { display: false }, zIndex: 1 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false, indexAxis: 'y', grouped: false,
            layout: { padding: { right: 130 } },
            scales: {
                x: { display: false, max: maxVal, min: 0 },
                y: { grid: { display: false, drawBorder: false }, ticks: { color: chartTextColor(), font: { family: 'Inter', size: 12, weight: '500' } } }
            },
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    });
}

window.toggleDataset = function(index) {
    const isVisible = compChart.isDatasetVisible(index);
    if (isVisible) compChart.hide(index); else compChart.show(index);
    const cb = document.getElementById(`legend-cb-${index}`);
    if (cb) cb.checked = !isVisible;
};

function generateCustomLegend() {
    const container = document.getElementById('chart-legend');
    if (!container) return;
    container.innerHTML = '';
    compChart.data.datasets.forEach((ds, i) => {
        const isHidden = !compChart.isDatasetVisible(i);
        container.innerHTML += `
            <div class="flex items-center cursor-pointer custom-cb" style="--cb-color:${ds.borderColor};" onclick="toggleDataset(${i})">
                <input type="checkbox" id="legend-cb-${i}" class="form-checkbox h-5 w-5 mr-3 cursor-pointer"
                    style="border-color:${ds.borderColor}; border-width:2px;" ${isHidden ? '' : 'checked'}
                    onclick="event.stopPropagation(); toggleDataset(${i})">
                <label class="text-sm font-bold uppercase tracking-wider cursor-pointer" style="color:${ds.borderColor}; pointer-events:none;">${ds.label}</label>
            </div>`;
    });
}

function renderQuotidienTable() {
    const tbody = document.getElementById('quotidien-table-body');
    const tfoot = document.getElementById('quotidien-table-foot');
    tbody.innerHTML = '';
    const treeSelectedDates = getSelectedTreeDates();
    let allData = [];

    const { feu: fFilter, four: fourFilter } = getGlobalFilterValues();

    dailyRecords.forEach(record => {
        if (!isProductInGlobalFilter(record.p)) return;
        record.d.forEach(row => {
            const passesTree = treeSelectedDates.length === 0 || treeSelectedDates.includes(row.dt);
            if (!passesTree) return;
            if (!rowMatchesFeuFour(record.p, row, fFilter, fourFilter)) return;
            allData.push({ ...row, product: record.p });
        });
    });

    allData.sort((a, b) => a.dt.localeCompare(b.dt) || a.product.localeCompare(b.product));
    let totB=0, totR=0, totT=0, totRep=0;

    if (allData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="px-6 py-8 text-center text-gray-500 italic">Aucune donnée pour la sélection actuelle.</td></tr>`;
        tfoot.innerHTML = '';
        return;
    }

    allData.forEach(row => {
        const rep = row.t - row.b - row.r;
        totB += row.b; totR += row.r; totT += row.t; totRep += rep;
        const yld = row.t > 0 ? ((row.b/row.t)*100).toFixed(2) : '0.00';
        const prodColor = row.product==='WC SERENA NEW' ? 'text-indigo-400' : row.product==='WC SERENA NOIR' ? 'text-gray-100' : 'text-red-400';
        const attrs = productAttributes[row.product] || {};
        const feuVal  = row.feu  || attrs.feu  || '-';
        const fourVal = row.four || attrs.four || '-';
        tbody.innerHTML += `
            <tr class="hover:bg-gray-800 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-300 font-medium whitespace-nowrap">${formatFrenchDate(row.dt)}</td>
                <td class="px-6 py-4 text-sm font-bold ${prodColor} whitespace-nowrap">${row.product}</td>
                <td class="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">${feuVal}</td>
                <td class="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">${fourVal}</td>
                <td class="px-6 py-4 text-sm text-white whitespace-nowrap">${row.t}</td>
                <td class="px-6 py-4 text-sm text-green-400 font-bold whitespace-nowrap">${row.b}</td>
                <td class="px-6 py-4 text-sm text-yellow-400 font-bold whitespace-nowrap">${rep}</td>
                <td class="px-6 py-4 text-sm text-red-400 whitespace-nowrap">${row.r}</td>
                <td class="px-6 py-4 text-sm text-indigo-400 font-black whitespace-nowrap">${yld}%</td>
            </tr>`;
    });

    const finalYield = totT > 0 ? ((totB/totT)*100).toFixed(2) : '0.00';
    tfoot.innerHTML = `
        <tr>
            <td class="px-6 py-5 text-gray-400 uppercase tracking-widest font-black" colspan="4">Total Filtré</td>
            <td class="px-6 py-5 text-white font-bold">${totT}</td>
            <td class="px-6 py-5 text-green-400 font-bold">${totB}</td>
            <td class="px-6 py-5 text-yellow-400 font-bold">${totRep}</td>
            <td class="px-6 py-5 text-red-400 font-bold">${totR}</td>
            <td class="px-6 py-5 text-indigo-400 font-black text-lg">${finalYield}%</td>
        </tr>`;
}

function isDefectRowInGlobalFilter(row) {
    const { model, feu, four } = getGlobalFilterValues();
    const rowModel = normalizeModelName(row.model);
    if (model !== 'ALL' && rowModel !== normalizeModelName(model)) return false;
    const attrs   = productAttributes[rowModel] || {};
    const rowFeu  = row.feu  || attrs.feu;
    const rowFour = row.four || attrs.four;
    if (feu  !== 'ALL' && rowFeu  !== feu)  return false;
    if (four !== 'ALL' && rowFour !== four) return false;
    return true;
}

function renderDefautsView() {
    const selectedDates = getSelectedTreeDates();
    const { feu, four } = getGlobalFilterValues();

    const filtered = defectRows.filter(row => {
        if (!isDefectRowInGlobalFilter(row)) return false;
        if (selectedDates.length > 0 && (!row.date || !selectedDates.includes(row.date))) return false;
        return true;
    });

    const agg = filtered.reduce((acc, row) => { acc[row.defType] = (acc[row.defType] || 0) + row.qty; return acc; }, {});
    const sorted = Object.entries(agg).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(e => e[0]);
    const counts = sorted.map(e => e[1]);
    const totalDefects = counts.reduce((s, c) => s + c, 0);

    let totalTries = 0;
    dailyRecords.forEach(record => {
        if (!isProductInGlobalFilter(record.p)) return;
        record.d.forEach(row => {
            if (selectedDates.length > 0 && !selectedDates.includes(row.dt)) return;
            if (!rowMatchesFeuFour(record.p, row, feu, four)) return;
            totalTries += row.t;
        });
    });

    const totalEl = document.getElementById('defauts-total');
    if (totalEl) totalEl.textContent = totalDefects > 0 ? `Total : ${totalDefects} défauts / ${totalTries} pièces triées` : '';

    if (defChart) defChart.destroy();
    window.currentDefectsData = { labels: labels.slice(0, 10), values: counts.slice(0, 10), model: getGlobalFilterValues().model, total: totalDefects };
    if (labels.length === 0) return;

    const top10Labels = labels.slice(0, 10);
    const top10Counts = counts.slice(0, 10);
    const denom       = totalTries || 1;

    const ctx      = document.getElementById('defectsChart').getContext('2d');
    const barColors = top10Counts.map((_,i) => i===0 ? '#eab308' : '#3b82f6');
    const maxVal    = Math.max(...top10Counts) * 1.3;

    defChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top10Labels,
            datasets: [
                { data: top10Counts, backgroundColor: barColors, barThickness: 16, borderRadius: 4, borderSkipped: false,
                  datalabels: { display:true, anchor:'end', align:'right', color: chartTextColor(), font:{family:'Inter',size:14,weight:'bold'},
                    formatter: val => `${((val/denom)*100).toFixed(2).replace('.',',')}%  (${val})` }, zIndex: 2 },
                { data: top10Counts.map(()=>maxVal), backgroundColor:'rgba(255,255,255,0.05)', barThickness:16, borderRadius:4, borderSkipped:false,
                  datalabels:{ display:false }, zIndex: 1 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false, indexAxis: 'y', grouped: false,
            layout: { padding: { right: 160 } },
            scales: {
                x: { display: false, max: maxVal, min: 0 },
                y: { grid: { display: false, drawBorder: false }, ticks: { color: chartTextColor(), font: { family: 'Inter', size: 14, weight: '500' } } }
            },
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    });
}

/* ─────────────────────────────────────────────────────────────
   FILTERS.JS  ─  tree date picker, ref dropdown
───────────────────────────────────────────────────────────── */
function buildTreeDropdown(containerId='tree-container') {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const treeData = {};
    allDates.forEach(dateStr => {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return;
        const [y, m] = [parts[0], parts[1]];
        if (!treeData[y]) treeData[y] = {};
        if (!treeData[y][m]) treeData[y][m] = [];
        treeData[y][m].push(dateStr);
    });

    for (const [year, months] of Object.entries(treeData)) {
        let html = `
            <div class="py-1">
                <div class="flex items-center text-sm py-1">
                    <span class="cursor-pointer w-5 inline-block text-center text-gray-400 hover:text-white text-xs" onclick="toggleExpand('node-year-${year}',this)">▼</span>
                    <input type="checkbox" id="cb-year-${year}" class="form-checkbox ml-1 tree-year-cb" data-year="${year}" checked onchange="toggleYearNode('${year}',this.checked,'${containerId}')">
                    <label class="ml-3 font-bold cursor-pointer text-gray-200 hover:text-white text-base" onclick="document.getElementById('cb-year-${year}').click()">${year}</label>
                </div>
                <div id="node-year-${year}" class="ml-3 pl-3 border-l border-gray-600">`;

        for (const [month, days] of Object.entries(months)) {
            const monthName = moisFR[parseInt(month,10)-1];
            html += `
                <div class="flex items-center text-sm py-2">
                    <span class="cursor-pointer w-5 inline-block text-center text-gray-400 hover:text-white text-xs" onclick="toggleExpand('node-month-${year}-${month}',this)">▼</span>
                    <input type="checkbox" id="cb-month-${year}-${month}" class="form-checkbox ml-1 tree-month-cb" data-year="${year}" data-month="${month}" checked onchange="toggleMonthNode('${year}','${month}',this.checked,'${containerId}')">
                    <label class="ml-3 font-semibold cursor-pointer text-gray-200 hover:text-white text-base" onclick="document.getElementById('cb-month-${year}-${month}').click()">${monthName}</label>
                </div>
                <div id="node-month-${year}-${month}" class="ml-6 mt-1 space-y-3 py-2">`;
            days.forEach(dateStr => {
                const d = dateStr.split('-')[2];
                html += `
                    <div class="flex items-center text-sm group">
                        <input type="checkbox" value="${dateStr}" class="form-checkbox tree-day-cb" data-year="${year}" data-month="${month}" checked onchange="handleTreeDayChange('${containerId}')">
                        <label class="ml-3 cursor-pointer text-gray-300 group-hover:text-white transition-colors text-base" onclick="this.previousElementSibling.click()">${d}</label>
                    </div>`;
            });
            html += `</div>`;
        }
        html += `</div></div>`;
        container.innerHTML += html;
    }
    updateDateDropdownText(containerId);
}

function toggleDateMenu() {
    document.getElementById('date-dropdown-menu').classList.toggle('hidden');
}

function toggleExpand(id, iconEl) {
    const el = document.getElementById(id);
    if (el.classList.contains('hidden')) { el.classList.remove('hidden'); iconEl.innerText = '▼'; }
    else { el.classList.add('hidden'); iconEl.innerText = '▶'; }
}

function getActiveTabName() {
    const activeBtn = document.querySelector('.sidebar-nav-btn.active');
    return activeBtn ? activeBtn.id.replace('btn-','') : null;
}

function renderActiveTab() {
    const activeTab = getActiveTabName();
    if (activeTab === 'comparatif') renderComparatif();
    else if (activeTab === 'quotidien') renderQuotidienTable();
    else if (activeTab === 'defauts')   renderDefautsView();
}

function toggleAllTreeNodes(isChecked, containerId='tree-container') {
    const container = document.getElementById(containerId);
    container.querySelectorAll('.tree-day-cb,.tree-month-cb,.tree-year-cb').forEach(cb => {
        cb.checked = isChecked; cb.indeterminate = false;
    });
    updateDateDropdownText(containerId);
    renderActiveTab();
}

function toggleYearNode(year, isChecked, containerId='tree-container') {
    const c = document.getElementById(containerId);
    c.querySelectorAll(`.tree-day-cb[data-year="${year}"]`).forEach(cb => cb.checked = isChecked);
    c.querySelectorAll(`.tree-month-cb[data-year="${year}"]`).forEach(cb => { cb.checked = isChecked; cb.indeterminate = false; });
    handleTreeDayChange(containerId);
}

function toggleMonthNode(year, month, isChecked, containerId='tree-container') {
    const c = document.getElementById(containerId);
    c.querySelectorAll(`.tree-day-cb[data-year="${year}"][data-month="${month}"]`).forEach(cb => cb.checked = isChecked);
    handleTreeDayChange(containerId);
}

function handleTreeDayChange(containerId='tree-container') {
    const c = document.getElementById(containerId);
    const months = new Set(Array.from(c.querySelectorAll('.tree-day-cb')).map(cb => `${cb.dataset.year}-${cb.dataset.month}`));
    months.forEach(ym => {
        const [y, m] = ym.split('-');
        const allD     = c.querySelectorAll(`.tree-day-cb[data-year="${y}"][data-month="${m}"]`);
        const checkedD = c.querySelectorAll(`.tree-day-cb[data-year="${y}"][data-month="${m}"]:checked`);
        const mCb = document.getElementById(`cb-month-${y}-${m}`);
        if (mCb) {
            if (checkedD.length === allD.length)     { mCb.checked=true;  mCb.indeterminate=false; }
            else if (checkedD.length === 0)          { mCb.checked=false; mCb.indeterminate=false; }
            else                                     { mCb.checked=false; mCb.indeterminate=true;  }
        }
    });
    const years = new Set(Array.from(c.querySelectorAll('.tree-day-cb')).map(cb => cb.dataset.year));
    years.forEach(y => {
        const allD     = c.querySelectorAll(`.tree-day-cb[data-year="${y}"]`);
        const checkedD = c.querySelectorAll(`.tree-day-cb[data-year="${y}"]:checked`);
        const yCb = document.getElementById(`cb-year-${y}`);
        if (yCb) {
            if (checkedD.length === allD.length) { yCb.checked=true;  yCb.indeterminate=false; }
            else if (checkedD.length === 0)      { yCb.checked=false; yCb.indeterminate=false; }
            else                                 { yCb.checked=false; yCb.indeterminate=true;  }
        }
    });
    updateDateDropdownText(containerId);
    renderActiveTab();
}

function updateDateDropdownText(containerId='tree-container') {
    const c       = document.getElementById(containerId);
    const checked = c.querySelectorAll('.tree-day-cb:checked').length;
    const total   = c.querySelectorAll('.tree-day-cb').length;
    const textEl  = document.getElementById('date-dropdown-text');
    if (!textEl) return;
    if (checked === total && total > 0) textEl.innerText = 'Toutes les dates';
    else if (checked === 0)             textEl.innerText = 'Aucune sélection';
    else if (checked > 1)               textEl.innerText = 'Sélections multiples';
    else textEl.innerText = formatFrenchDate(c.querySelector('.tree-day-cb:checked').value);
}

window.addEventListener('click', function(e) {
    const dateDrop = document.getElementById('date-dropdown-container');
    if (dateDrop && !dateDrop.contains(e.target)) document.getElementById('date-dropdown-menu').classList.add('hidden');
});

/* ─────────────────────────────────────────────────────────────
   DASHBOARD.JS  ─  tabs, saisie form, PPTX export, init
───────────────────────────────────────────────────────────── */
const saisieProblems = {
    'Coulage':  ['Gérces coul','Trou d\'air','Corps étrangers','Coup','M,prise','Divers coulage','Déformation','Finition','Fuite'],
    'Emailage': ['M,email','Retrait email','Grains email','logos email','Tache email','Moutonnage','Corps étranger','Coup email','Piktage','Chamotte','Coulure email','Finition email','M.email','Coups email','Collage email','Divers email'],
    'Four':     ['Point noir','Coup cuis','Grain four','P,alumine','Incuit/brouillonnage','Explosion Cuis','Mauvais réparation','Collage cuis','Divers cuis','Filage','Préchauffe cuis','Coups cuis']
};

function setTheme(theme, render = true) {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('wcSerena_theme', theme);
    document.getElementById('theme-toggle-input').checked = (theme === 'light');

    const light = theme === 'light';
    Chart.defaults.color = light ? '#1e293b' : '#9ca3af';
    Chart.defaults.scale.grid.color = light ? 'rgba(100,116,139,0.15)' : 'rgba(255,255,255,0.05)';
    Chart.defaults.plugins.datalabels.color = light ? '#1e293b' : '#ffffff';
    gridConfig.color = light ? 'rgba(100,116,139,0.15)' : 'rgba(255,255,255,0.05)';

    if (render) {
        [compChart, defChart, qualityDonutChart, dashTop10Chart].forEach(c => { if (c) c.destroy(); });
        compChart = defChart = qualityDonutChart = dashTop10Chart = null;
        renderActiveTab();
        [compChart, defChart, qualityDonutChart, dashTop10Chart].forEach(c => { if (c) c.update(); });
    }
}

function init() {
    setTheme(localStorage.getItem('wcSerena_theme') || 'dark', false);
    loadFromLocalStorage();
    updateRecordCount();
    populateGlobalFilterOptions();
    populateInputOptions();
    buildTreeDropdown();
    openTab('comparatif');
    const form = document.getElementById('dataForm');
    if (form) form.addEventListener('submit', handleInputSubmit);
    document.getElementById('theme-toggle-input').addEventListener('change', (e) => {
        setTheme(e.target.checked ? 'light' : 'dark');
    });
    loadFromOneDrive(false).then(() => startOdAutoRefresh());
}

function refreshDashboard(updatedProduction, updatedDefects) {
    if (updatedProduction || updatedDefects) {
        recomputeAllDates();
        buildTreeDropdown();
        if (typeof populateGlobalFilterOptions === 'function') populateGlobalFilterOptions();
    }
    updateRecordCount();
    const activeTab = getActiveTabName();
    if (activeTab === 'comparatif' && updatedProduction) renderComparatif();
    if (activeTab === 'quotidien'  && updatedProduction) renderQuotidienTable();
    if (activeTab === 'defauts'    && updatedDefects)    renderDefautsView();
    if (activeTab === 'input')                           renderInputRecords();
}

function openTab(tabName) {
    ['comparatif','quotidien','defauts','input'].forEach(tab => {
        document.getElementById('tab-'+tab).classList.add('hidden');
        document.getElementById('btn-'+tab).classList.remove('active');
    });
    document.getElementById('tab-'+tabName).classList.remove('hidden');
    document.getElementById('btn-'+tabName).classList.add('active');
    if (tabName === 'comparatif') renderComparatif();
    if (tabName === 'quotidien')  renderQuotidienTable();
    if (tabName === 'defauts')    renderDefautsView();
    if (tabName === 'input')      renderInputRecords();
}

function populateInputOptions() {
    const modelSelect    = document.getElementById('input-model');
    const feuSelect      = document.getElementById('input-feu');
    const fourSelect     = document.getElementById('input-four');
    const problemGroups  = document.getElementById('input-problem-groups');
    if (!modelSelect || !feuSelect || !fourSelect || !problemGroups) return;

    const modelOptions = new Set(allProductModels.concat(['WC SERENA NEW','WC SERENA NOIR','WC SERENA']));
    modelSelect.innerHTML = '<option value="">Sélectionner un modèle</option>' +
        Array.from(modelOptions).sort().map(m => `<option value="${m}">${m}</option>`).join('');
    feuSelect.innerHTML  = '<option value="">Sélectionner un type de feu</option>' +
        availableFeux.map(f  => `<option value="${f}">${f}</option>`).join('');
    fourSelect.innerHTML = '<option value="">Sélectionner un four</option>' +
        availableFours.map(f => `<option value="${f}">${f}</option>`).join('');

    problemGroups.innerHTML = Object.entries(saisieProblems).map(([group, items]) => {
        const checks = items.map(item => `
            <label class="inline-flex items-center gap-2 text-slate-100 text-sm">
                <input type="checkbox" class="form-checkbox saisie-problem" value="${item}"
                       onchange="this.closest('label').querySelector('.saisie-problem-qty').disabled=!this.checked">
                <span class="flex-1">${item}</span>
                <input type="number" min="1" value="1" class="saisie-problem-qty blue-input rounded-lg px-2 py-1 w-16 text-sm text-center" disabled title="Quantité">
            </label>`).join('');
        return `
            <div class="rounded-3xl border border-slate-700 bg-slate-950/90 p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 mb-3">${group}</p>
                <div class="grid gap-2">${checks}</div>
            </div>`;
    }).join('');
}

function renderInputRecords() {
    const body = document.getElementById('input-records-body');
    if (!body) return;
    const rows = [];
    dailyRecords.forEach(record => {
        record.d.forEach(entry => {
            rows.push({ date: entry.dt, model: record.p, feu: entry.feu||'-', four: entry.four||'-',
                bonnes: entry.b, rebuts: entry.r, reparer: entry.t - entry.b - entry.r });
        });
    });
    rows.sort((a,b) => b.date.localeCompare(a.date));
    body.innerHTML = rows.slice(0,12).map(row => `
        <tr class="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
            <td class="px-4 py-3 text-slate-200">${row.date}</td>
            <td class="px-4 py-3 text-slate-200">${row.model}</td>
            <td class="px-4 py-3 text-slate-200">${row.feu}</td>
            <td class="px-4 py-3 text-slate-200">${row.four}</td>
            <td class="px-4 py-3 text-green-400 font-semibold">${row.bonnes}</td>
            <td class="px-4 py-3 text-red-400 font-semibold">${row.rebuts}</td>
            <td class="px-4 py-3 text-yellow-400 font-semibold">${row.reparer}</td>
            <td class="px-4 py-3 text-slate-200 font-semibold">${row.bonnes + row.rebuts + row.reparer}</td>
        </tr>`).join('');
}

function handleInputSubmit(event) {
    event.preventDefault();
    const date     = document.getElementById('input-date').value;
    const model    = document.getElementById('input-model').value;
    const feu      = document.getElementById('input-feu').value;
    const four     = document.getElementById('input-four').value;
    const bonnes   = parseInt(document.getElementById('input-bonnes').value, 10)  || 0;
    const rebuts   = parseInt(document.getElementById('input-rebuts').value, 10)  || 0;
    const reparer  = parseInt(document.getElementById('input-reparer').value, 10) || 0;
    const otherProblem = document.getElementById('input-problem-other').value.trim();
    const feedback = document.getElementById('input-form-feedback');

    if (!date || !model || !feu || !four) {
        if (feedback) feedback.textContent = 'Veuillez remplir la date, le modèle, le feu et le four.';
        return;
    }
    if (bonnes + rebuts + reparer <= 0) {
        if (feedback) feedback.textContent = 'Saisissez au moins une quantité valide.';
        return;
    }

    const selectedProblems = Array.from(document.querySelectorAll('.saisie-problem:checked')).map(cb => ({
        name: cb.value,
        qty: Math.max(1, parseInt(cb.closest('label').querySelector('.saisie-problem-qty').value, 10) || 1)
    }));
    if (otherProblem) selectedProblems.push({ name: otherProblem, qty: 1 });

    const entry = { dt: date, b: bonnes, r: rebuts, t: bonnes + rebuts + reparer, feu, four };
    const record = dailyRecords.find(r => r.p === model);
    if (record) record.d.push(entry); else dailyRecords.push({ p: model, d: [entry] });

    productAttributes[model] = { feu, four };
    if (!availableFeux.includes(feu))   availableFeux.push(feu);
    if (!availableFours.includes(four)) availableFours.push(four);

    if (selectedProblems.length > 0) {
        selectedProblems.forEach(({ name, qty }) => {
            defectRows.push({ model, defType: name, qty, date, feu, four });
        });
    }

    recomputeAllDates();
    populateGlobalFilterOptions();
    populateInputOptions();
    buildTreeDropdown();
    refreshDashboard(true, selectedProblems.length > 0);
    saveToLocalStorage();
    renderInputRecords();
    if (feedback) feedback.textContent = 'Enregistrement ajouté avec succès.';
    document.getElementById('dataForm').reset();
    document.getElementById('input-date').value = date;
}

async function exportToPPTX() {
    const btn = document.getElementById('export-pptx-btn');
    if (btn) { btn.disabled = true; btn.lastChild.textContent = ' Capture...'; }

    const activeTabName = getActiveTabName();
    const isLight = isLightTheme();
    const bgColor = isLight ? '#f1f5f9' : '#0b0f19';

    const tabs = [
        { name: 'comparatif' },
        { name: 'quotidien'  },
        { name: 'defauts'    },
    ];

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Management Qualité';
    pptx.company = 'SERENA';
    pptx.title  = 'Rapport de Direction WC SERENA';

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    for (const tab of tabs) {
        openTab(tab.name);
        await new Promise(r => setTimeout(r, 900));
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 100));

        const canvas = await html2canvas(document.body, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: bgColor,
            x: 0,
            y: 0,
            width: vw,
            height: vh,
            scrollX: 0,
            scrollY: 0,
            windowWidth: vw,
            windowHeight: vh,
            ignoreElements: el => el.id === 'export-pptx-btn'
        });

        const imgData = canvas.toDataURL('image/png');
        const slide = pptx.addSlide();
        slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
    }

    openTab(activeTabName || 'comparatif');
    await pptx.writeFile({ fileName: 'Rapport_WC_SERENA.pptx' });
    if (btn) { btn.disabled = false; btn.lastChild.textContent = ' Export PPTX'; }
}

/* ─────────────────────────────────────────────────────────────
   GOOGLE SHEETS AUTO-LOAD  ─  JSONP (no proxy, no CORS issues)
───────────────────────────────────────────────────────────── */
const GS_SHEET_ID   = '1LpS95mg0pagDdy2rBAa8-1szsKCnydyWPrUKp48hLNs';
const OD_REFRESH_MS = 40 * 60 * 1000;
let   odRefreshTimer = null;

function setOdStatus(state, msg) {
    const dot = document.getElementById('od-status-dot');
    const txt = document.getElementById('od-status-text');
    const btn = document.getElementById('od-refresh-btn');
    if (!dot || !txt) return;
    const colors = { loading: '#6366f1', ok: '#22c55e', error: '#ef4444' };
    dot.style.background = colors[state] || '#6b7280';
    dot.style.animation  = state === 'loading' ? 'od-pulse 1s ease-in-out infinite' : '';
    if (btn) btn.disabled = (state === 'loading');
    txt.textContent = msg;
}

/* JSONP — injects a <script> tag so CORS never applies */
function fetchSheetJSONP() {
    return new Promise((resolve, reject) => {
        const cb = '__gs' + Date.now();
        const el = document.createElement('script');
        const timer = setTimeout(() => {
            el.remove(); delete window[cb];
            reject(new Error('Délai dépassé'));
        }, 20000);
        window[cb] = (res) => {
            clearTimeout(timer); el.remove(); delete window[cb];
            res && res.table ? resolve(res.table) : reject(new Error('Données vides'));
        };
        el.onerror = () => {
            clearTimeout(timer); el.remove(); delete window[cb];
            reject(new Error('Accès refusé — vérifiez le partage'));
        };
        el.src = `https://docs.google.com/spreadsheets/d/${GS_SHEET_ID}/gviz/tq?tqx=responseHandler:${cb}&gid=0`;
        document.head.appendChild(el);
    });
}

function parseGvizTable(table) {
    const METADATA = new Set([
        'Date Saisie','Modèle Produit','Type de Feu','Four',
        'Total Triées','Pièces Bonnes','À Réparer','Rebuts','Rendement %'
    ]);
    const headers = table.cols.map(c => c.label || c.id);
    if (!headers.includes('Date Saisie') || !headers.includes('Modèle Produit')) return false;

    const defectCols = headers.filter(h => !METADATA.has(h));
    const newRecords = {}, newDefects = [], feux = new Set(), fours = new Set(), attrs = {};

    let _debugCount = 0;
    for (const row of (table.rows || [])) {
        const get = (col) => {
            const i = headers.indexOf(col);
            return (i >= 0 && row.c && row.c[i]) ? row.c[i].v : null;
        };
        const dateRaw = get('Date Saisie');
        const model   = normalizeModelName(get('Modèle Produit'));
        if (!dateRaw || !model) continue;

        if (_debugCount < 10) {
            console.log(`[DateSaisie RAW #${_debugCount + 1}]`, dateRaw, `| type: ${typeof dateRaw}`);
            _debugCount++;
        }

        const dateObj = parseDateSaisie(dateRaw);
        if (!dateObj || isNaN(dateObj.getTime())) continue;

        const ds  = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(dateObj.getDate()).padStart(2,'0')}`;
        const feu  = get('Type de Feu')  || undefined;
        const four = get('Four')         || undefined;
        const b    = parseInt(get('Pièces Bonnes')) || 0;
        const r    = parseInt(get('Rebuts'))        || 0;
        const rep  = parseInt(get('À Réparer'))     || 0;
        const t    = parseInt(get('Total Triées'))  || (b + r + rep);

        if (feu)  feux.add(feu);
        if (four) fours.add(four);
        if (!newRecords[model]) newRecords[model] = [];
        newRecords[model].push({ dt: ds, b, r, t, feu, four });
        attrs[model] = attrs[model] || {};
        if (feu)  attrs[model].feu  = feu;
        if (four) attrs[model].four = four;
        defectCols.forEach(col => {
            const qty = parseInt(get(col)) || 0;
            if (qty > 0) newDefects.push({ model, defType: col, qty, date: ds, feu, four });
        });
    }
    if (!Object.keys(newRecords).length) return false;
    dailyRecords     = Object.entries(newRecords).map(([p, d]) => ({ p, d }));
    defectRows       = newDefects;
    productAttributes = attrs;
    if (feux.size)  availableFeux  = Array.from(feux).sort();
    if (fours.size) availableFours = Array.from(fours).sort();
    return true;
}

async function loadFromOneDrive(isManual) {
    setOdStatus('loading', isManual ? 'Actualisation…' : 'Chargement…');
    try {
        const table = await fetchSheetJSONP();
        const ok    = parseGvizTable(table);
        if (!ok) throw new Error('Format non reconnu');
        refreshDashboard(true, true);
        updateRecordCount();
        saveToLocalStorage();
        const hm = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        setOdStatus('ok', `Mis à jour ${hm}`);
    } catch (err) {
        console.error('Google Sheets load error:', err);
        setOdStatus('error', `Erreur: ${err.message}`);
    }
}

function startOdAutoRefresh() {
    if (odRefreshTimer) clearInterval(odRefreshTimer);
    odRefreshTimer = setInterval(() => loadFromOneDrive(false), OD_REFRESH_MS);
}

/* ─── Boot ─────────────────────────────────────────────────── */
init();
