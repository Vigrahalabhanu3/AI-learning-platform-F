const { spawn } = require('child_process');

console.log('Starting backend server to test APIs against Supabase...');
const server = spawn('npm', ['start'], { 
  env: { ...process.env, NODE_ENV: 'production' } 
});

server.stdout.on('data', async (data) => {
  const output = data.toString();
  process.stdout.write('[Server]: ' + output);
  
  if (output.includes('Server running on http://localhost:3001')) {
    console.log('\n======================================');
    console.log('Server Started. Running API Tests...');
    console.log('======================================\n');
    
    const endpoints = [
      '/api/categories',
      '/api/topics',
      '/api/roadmaps'
    ];

    for (const endpoint of endpoints) {
      console.log(`Testing GET http://localhost:3001${endpoint} ...`);
      try {
        const res = await fetch(`http://localhost:3001${endpoint}`);
        const text = await res.text();
        
        console.log(`✅ Status: ${res.status}`);
        
        // Try parsing JSON to print a nice summary
        try {
          const json = JSON.parse(text);
          console.log(`✅ Output: Returned ${Array.isArray(json) ? json.length + ' items' : 'Object'}`);
          if (Array.isArray(json) && json.length > 0) {
            console.log(`   First item sample: ${JSON.stringify(json[0]).substring(0, 150)}...`);
          } else if (!Array.isArray(json)) {
            console.log(`   Sample: ${JSON.stringify(json).substring(0, 150)}...`);
          }
        } catch (e) {
          console.log(`✅ Output (Text): ${text.substring(0, 150)}...`);
        }
        console.log('--------------------------------------\n');
      } catch (err) {
        console.error(`❌ Error fetching ${endpoint}:`, err.message);
      }
    }
    
    console.log('Finished testing APIs. Shutting down server...');
    server.kill();
    process.exit(0);
  }
});

server.stderr.on('data', (data) => {
  process.stderr.write('[Server Error]: ' + data.toString());
});
