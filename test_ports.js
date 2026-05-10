const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function listDbs() {
  const ports = [3306, 3307];
  for (const port of ports) {
    console.log(`Checking port ${port}...`);
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        port: port,
        user: 'root',
        password: '',
      });
      const [rows] = await connection.query('SHOW DATABASES');
      console.log(`Port ${port} Databases:`, rows.map(r => r.Database));
      await connection.end();
    } catch (err) {
      console.error(`❌ Port ${port} failed:`, err.message);
    }
  }
}

listDbs();
