const assert = require('assert');

const baseURL = 'http://localhost:5000/api';

async function fetchJSON(url, options = {}) {
  const res = await fetch(baseURL + url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const data = await res.json();
  if (!res.ok) throw { message: data.message || res.statusText, data, status: res.status };
  return data;
}

async function testFailure() {
  try {
    console.log('Logging in as Manufacturer...');
    const mfgRes = await fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'manufacturer@pharmachain.com', password: 'Password123' }) });
    const mfgToken = mfgRes.token;

    console.log('Testing blockchain failure registration...');
    let failed = false;
    try {
      await fetchJSON('/medicines', {
        method: 'POST',
        headers: { Authorization: `Bearer ${mfgToken}` },
        body: JSON.stringify({
          name: 'Fail Medicine',
          batchNumber: 'FAIL-BATCH',
          manufacturer: 'Pfizer',
          manufacturingDate: '2026-01-01',
          expiryDate: '2028-01-01',
          quantity: 100
        })
      });
    } catch (e) {
      console.log('Registration correctly failed:', e.data.message);
      assert(e.status === 502, 'Should return 502 Bad Gateway');
      failed = true;
    }
    
    assert(failed, 'Registration should have failed when node is down!');
    console.log('Network failure test passed successfully!');
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

testFailure();
