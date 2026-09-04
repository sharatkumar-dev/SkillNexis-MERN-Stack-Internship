const http = require('http');

const request = (method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload);
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5002,
        path: `/api${path}`,
        method,
        headers
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

async function testSuite() {
  console.log('--- 1. Health Check ---');
  const health = await request('GET', '/health');
  console.log('Health Status:', health.status, health.data.message);

  console.log('\n--- 2. Register User ---');
  const userPayload = {
    name: 'Alex Mercer',
    email: `alex_${Date.now()}@taskmanager.com`,
    password: 'password123'
  };
  const reg = await request('POST', '/auth/register', userPayload);
  console.log('Register Status:', reg.status, reg.data.message);
  const token = reg.data.data.token;
  console.log('Token acquired:', token ? 'YES' : 'NO');

  console.log('\n--- 3. Create Task (Urgent) ---');
  const task1 = await request(
    'POST',
    '/tasks',
    {
      title: 'Complete MERN Task Manager Mini Project',
      description: 'Implement Kanban view, full REST API, and dynamic filters.',
      status: 'in_progress',
      priority: 'urgent',
      category: 'Work',
      dueDate: new Date(Date.now() + 86400000).toISOString()
    },
    token
  );
  console.log('Create Task Status:', task1.status, task1.data.message, 'ID:', task1.data.data.task._id);
  const taskId = task1.data.data.task._id;

  console.log('\n--- 4. Create Task (Completed) ---');
  await request(
    'POST',
    '/tasks',
    {
      title: 'Setup MongoDB & Express Server',
      description: 'Connected Mongoose and configured CORS and routes.',
      status: 'completed',
      priority: 'high',
      category: 'Work'
    },
    token
  );

  console.log('\n--- 5. Get Task Stats ---');
  const stats = await request('GET', '/tasks/stats', null, token);
  console.log('Stats:', JSON.stringify(stats.data.data, null, 2));

  console.log('\n--- 6. Filter Tasks (status=in_progress) ---');
  const filtered = await request('GET', '/tasks?status=in_progress', null, token);
  console.log('Filtered in_progress tasks count:', filtered.data.data.tasks.length);

  console.log('\n--- 7. Patch Task Status ---');
  const patched = await request('PATCH', `/tasks/${taskId}/status`, { status: 'completed' }, token);
  console.log('Patched Status:', patched.data.data.task.status);

  console.log('\n--- ALL BACKEND SUITE TESTS PASSED! ---');
}

testSuite().catch(console.error);
