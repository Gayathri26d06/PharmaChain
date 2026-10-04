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

async function runTests() {
  try {
    console.log('--- Starting Integration Tests ---');

    // 1. Register Customer A
    console.log('Registering Customer A...');
    let custA;
    try {
      custA = await fetchJSON('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Customer A', email: 'customera@pharmachain.com', password: 'Password123', role: 'customer' }) });
    } catch (e) {
      if (e.status === 400) custA = await fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'customera@pharmachain.com', password: 'Password123' }) });
      else throw e;
    }
    const custAToken = custA.token;
    
    // 2. Register Customer B
    console.log('Registering Customer B...');
    let custB;
    try {
      custB = await fetchJSON('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Customer B', email: 'customerb@pharmachain.com', password: 'Password123', role: 'customer' }) });
    } catch (e) {
      if (e.status === 400) custB = await fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'customerb@pharmachain.com', password: 'Password123' }) });
      else throw e;
    }
    const custBToken = custB.token;

    // 3. Login as Manufacturer
    console.log('Logging in as Manufacturer...');
    const mfgRes = await fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'manufacturer@pharmachain.com', password: 'Password123' }) });
    const mfgToken = mfgRes.token;

    // 4. Test Successful Blockchain Registration
    console.log('Testing successful registration as Manufacturer...');
    const addMedRes = await fetchJSON('/medicines', {
      method: 'POST',
      headers: { Authorization: `Bearer ${mfgToken}` },
      body: JSON.stringify({
        name: 'Test Medicine',
        batchNumber: 'TEST-BATCH-01',
        manufacturer: 'Pfizer Global Manufacturing',
        manufacturingDate: '2026-01-01',
        expiryDate: '2028-01-01',
        quantity: 100
      })
    });
    
    assert(addMedRes.success === true, 'Medicine registration failed');
    console.log(`Successfully registered medicine: ${addMedRes.medicine.medicineId}`);
    const newMedId = addMedRes.medicine.medicineId;

    // 5. Customer A Verifies Medicine
    console.log('Customer A verifying medicine...');
    await fetchJSON(`/medicines/verify/${newMedId}?source=QR_CAMERA`, {
      headers: { Authorization: `Bearer ${custAToken}` }
    });

    // 6. Test Customer Isolation on Dashboard
    console.log('Testing customer dashboard isolation...');
    const dashA = await fetchJSON('/medicines/stats/dashboard', { headers: { Authorization: `Bearer ${custAToken}` } });
    const dashB = await fetchJSON('/medicines/stats/dashboard', { headers: { Authorization: `Bearer ${custBToken}` } });

    assert(dashA.recentVerifications.length > 0, 'Customer A should see their verification');
    const bHasA = dashB.recentVerifications.some(v => v.medicineId === newMedId);
    assert(!bHasA, 'Customer B should NOT see Customer A verification');
    console.log('Customer isolation verified successfully!');

    console.log('\nAll initial tests passed! Next step is to manually kill the blockchain node and test network failure.');
  } catch (error) {
    console.error('Test Failed:', error.message);
    if (error.data) console.error(error.data);
  }
}

runTests();
