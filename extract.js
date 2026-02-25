const fs = require('fs');
const file = fs.readFileSync('Frontend/src/components/Dashboard.jsx', 'utf8');

const components = [
    { name: 'AnimatedCounter', search: 'const AnimatedCounter =' },
    { name: 'AnalyticsSection', search: '// --- Analytics Components ---' },
    { name: 'Overview', search: '// --- Overview Component ---' },
    { name: 'CreateProjectModal', search: '// --- Create Project Modal ---' },
    { name: 'Projects', search: '// --- Projects Management Component ---' },
    { name: 'CreateTeamModal', search: '// --- Create Team Modal ---' },
    { name: 'AddMemberModal', search: '// --- Add Member Modal ---' },
    { name: 'ManageProjectsModal', search: '// --- Manage Team Projects Modal ---' },
    { name: 'Teams', search: '// --- Teams Management Component ---' },
    { name: 'CreateTaskModal', search: '// --- Create Task Modal ---' },
    { name: 'Tasks', search: '// --- Task Management Component ---' },
    { name: 'Messages', search: '// --- Messages Component ---' },
    { name: 'SettingsPage', search: 'const SettingsPage = ({' },
    { name: 'Dashboard', search: '// --- Main Dashboard Component ---' }
];

let positions = components.map(c => ({ name: c.name, idx: file.indexOf(c.search) }));
console.log(positions);
