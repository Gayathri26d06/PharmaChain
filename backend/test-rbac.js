const assert = require('assert');
const { execSync } = require('child_process');

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
    console.log('--- Starting RBAC Integration Tests ---');

    // 0. Set up Admin
    console.log('Creating initial admin via setup script...');
    process.env.ADMIN_NAME = 'Super Admin';
    process.env.ADMIN_EMAIL = 'admin@pharmachain.com';
    process.env.ADMIN_PASSWORD = 'AdminPassword123!';
    execSync('node createAdmin.js', { env: process.env, stdio: 'inherit' });

    // 1. Register a new user (Should default to customer)
    console.log('Registering a new public user...');
    const testEmail = 'testcustomer_' + Date.now() + '@pharmachain.com';
    let custRes;
    try {
      custRes = await fetchJSON('/auth/register', { 
        method: 'POST', 
        body: JSON.stringify({ 
          name: 'Test Customer', 
          email: testEmail, 
          password: 'Password123', 
          confirmPassword: 'Password123',
          role: 'manufacturer' // Try to inject role
        }) 
      });
    } catch (e) {
      if (e.status === 400) custRes = await fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ email: testEmail, password: 'Password123' }) });
      else throw e;
    }
    const token = custRes.token;
    assert(custRes.user.role === 'customer', 'User should be forced to customer role');
    assert(custRes.user.manufacturerStatus === 'not_applicable', 'User should have not_applicable manufacturer status');

    // 2. Customer tries to add medicine (Should fail)
    console.log('Customer attempting to register medicine...');
    let failedAdd = false;
    try {
      await fetchJSON('/medicines', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: 'Med', batchNumber: 'B1', manufacturer: 'M', manufacturingDate: '2025-01-01', expiryDate: '2026-01-01', quantity: 100 })
      });
    } catch (e) {
      assert(e.status === 403, 'Should get 403 Forbidden');
      failedAdd = true;
    }
    assert(failedAdd, 'Customer successfully registered medicine (THIS SHOULD NOT HAPPEN)');

    // 3. Customer applies for Manufacturer role
    console.log('Customer applying for Manufacturer role...');
    const applyRes = await fetchJSON('/auth/apply-manufacturer', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ companyName: 'Test Pharma', registrationNumber: 'REG-123', address: '123 Test St' })
    });
    assert(applyRes.success === true, 'Application failed');

    // 4. Pending Manufacturer tries to add medicine (Should fail)
    console.log('Pending Manufacturer attempting to register medicine...');
    failedAdd = false;
    try {
      await fetchJSON('/medicines', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: 'Med', batchNumber: 'B1', manufacturer: 'M', manufacturingDate: '2025-01-01', expiryDate: '2026-01-01', quantity: 100 })
      });
    } catch (e) {
      assert(e.status === 403, 'Should get 403 Forbidden for pending manufacturer');
      failedAdd = true;
    }
    assert(failedAdd, 'Pending Manufacturer successfully registered medicine (THIS SHOULD NOT HAPPEN)');

    // 5. Admin logs in
    console.log('Admin logging in...');
    const adminRes = await fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@pharmachain.com', password: 'AdminPassword123!' }) });
    const adminToken = adminRes.token;

    // 6. Admin approves application
    console.log('Admin approving application...');
    const appsRes = await fetchJSON('/admin/applications', { headers: { Authorization: `Bearer ${adminToken}` } });
    const targetApp = appsRes.applications.find(a => a.email === testEmail);
    assert(targetApp, 'Application not found by admin');

    const approveRes = await fetchJSON(`/admin/applications/${targetApp._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'approved' })
    });
    assert(approveRes.success === true, 'Approval failed');

    // 7. Approved Manufacturer registers medicine
    console.log('Approved Manufacturer registering medicine (Testing failure fallback for offline blockchain node)...');
    // We expect 502 because we don't have hardhat running in this test script, but 502 means it passed RBAC!
    let passedRBAC = false;
    try {
      await fetchJSON('/medicines', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }, // Token might need to be refreshed if roles are stored in JWT? Wait, jwt only stores ID. The middleware queries the DB! So the old token works!
        body: JSON.stringify({ name: 'Test Med', batchNumber: 'B1', manufacturer: 'Test Pharma', manufacturingDate: '2025-01-01', expiryDate: '2026-01-01', quantity: 100 })
      });
      passedRBAC = true;
    } catch (e) {
      if (e.status === 502) {
        console.log('Got 502 Bad Gateway - This is expected since local blockchain node is offline. RBAC allowed the request!');
        passedRBAC = true;
      } else {
        throw e;
      }
    }
    assert(passedRBAC, 'RBAC blocked the approved manufacturer');

    console.log('\n✅ All RBAC Integration Tests Passed Successfully!');
  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    if (error.data) console.error(error.data);
    process.exit(1);
  }
}

runTests();
