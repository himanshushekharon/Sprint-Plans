const fs = require('fs');
const dir = 'Frontend/src/components/dashboard';
const files = fs.readdirSync(dir);

files.forEach(f => {
    let p = dir + '/' + f;
    let content = fs.readFileSync(p, 'utf8');
    let fixed = content.replace("from '../context/DataContext'", "from '../../context/DataContext'");
    fs.writeFileSync(p, fixed);
});
console.log('Fixed imports!');
