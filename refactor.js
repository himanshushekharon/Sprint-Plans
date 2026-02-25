const fs = require('fs');

const file = fs.readFileSync('Frontend/src/components/Dashboard.jsx', 'utf8');

const components = [
    { name: 'AnimatedCounter', startStr: 'const AnimatedCounter =' },
    { name: 'AnalyticsSection', startStr: '// --- Analytics Components ---' },
    { name: 'Overview', startStr: '// --- Overview Component ---' },
    { name: 'CreateProjectModal', startStr: '// --- Create Project Modal ---' },
    { name: 'Projects', startStr: '// --- Projects Management Component ---' },
    { name: 'CreateTeamModal', startStr: '// --- Create Team Modal ---' },
    { name: 'AddMemberModal', startStr: '// --- Add Member Modal ---' },
    { name: 'ManageProjectsModal', startStr: '// --- Manage Team Projects Modal ---' },
    { name: 'Teams', startStr: '// --- Teams Management Component ---' },
    { name: 'CreateTaskModal', startStr: '// --- Create Task Modal ---' },
    { name: 'Tasks', startStr: '// --- Task Management Component ---' },
    { name: 'Messages', startStr: '// --- Messages Component ---' },
    { name: 'SettingsPage', startStr: 'const SettingsPage = ({' },
    { name: 'Dashboard', startStr: '// --- Main Dashboard Component ---' }
];

let items = components.map(c => {
    let idx = file.indexOf(c.startStr);
    return { name: c.name, idx };
});

items.sort((a, b) => a.idx - b.idx);

if (items.some(i => i.idx === -1)) {
    console.log('Missed some components', items.filter(i => i.idx === -1));
    process.exit(1);
}

const chunks = {};
const importsBlock = file.substring(0, items[0].idx).trim();

for (let i = 0; i < items.length; i++) {
    const start = items[i].idx;
    const end = (i === items.length - 1) ? file.indexOf('export default Dashboard;') : items[i + 1].idx;
    chunks[items[i].name] = file.substring(start, end).trim();
}

if (!fs.existsSync('Frontend/src/components/dashboard')) {
    fs.mkdirSync('Frontend/src/components/dashboard');
}

const componentNames = items.map(i => i.name).filter(n => n !== 'Dashboard');

Object.keys(chunks).forEach(name => {
    if (name === 'Dashboard') return;

    let neededImports = [];
    componentNames.forEach(c => {
        if (c !== name && chunks[name].includes(c)) {
            let regex = new RegExp(`\\b${c}\\b`);
            if (regex.test(chunks[name])) {
                neededImports.push(`import ${c} from './${c}';`);
            }
        }
    });

    let newContent = importsBlock + '\n' + neededImports.join('\n') + '\n\n' + chunks[name] + `\n\nexport default ${name};\n`;
    fs.writeFileSync(`Frontend/src/components/dashboard/${name}.jsx`, newContent);
});

// Write dashboard.jsx
let dashboardImports = importsBlock + '\n';
componentNames.forEach(c => {
    dashboardImports += `import ${c} from './dashboard/${c}';\n`;
});

let newDashboardContent = dashboardImports + '\n\n' + chunks['Dashboard'] + `\n\nexport default Dashboard;\n`;
fs.writeFileSync('Frontend/src/components/Dashboard.jsx', newDashboardContent);

console.log('REFACTOR SUCCESS');
