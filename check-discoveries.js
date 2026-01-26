const data = require('./discoveries-extracted.json');
console.log('Total discoveries:', data.length);
console.log('NP 2440:', data.find(x => x.np === 2440));
console.log('NP 3089:', data.find(x => x.np === 3089));
console.log('NP 13.1:', data.find(x => x.np === 13.1));
console.log('Decimal NPs:', data.filter(x => x.np % 1 !== 0).map(x => x.np));
