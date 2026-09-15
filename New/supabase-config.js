const SUPABASE_URL = 'https://pomlnzhtlvejiyvqfjfu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_GY6bOK0ECnDsZCrocmUZ2g_4LQqr9E6';

async function supabaseRequest(path, options = {}) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        ...options,
        headers: {
            apikey: SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(`Supabase request failed (${response.status}): ${message}`);
    }

    if (response.status === 204) return null;
    return response.json();
}

async function listPayments() {
    return supabaseRequest('payments?select=*&order=id.desc');
}

async function createPayment(payment) {
    const result = await supabaseRequest('payments', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(payment)
    });
    return result[0];
}

async function updatePayment(id, payment) {
    const update = {
        status: payment.status,
        approvalTime: payment.approvalTime || '',
        approvedBy: payment.approvedBy || '',
        adminComment: payment.adminComment || '',
        rejectionTime: payment.rejectionTime || '',
        rejectionReason: payment.rejectionReason || '',
        rejectedBy: payment.rejectedBy || ''
    };
    const result = await supabaseRequest(`payments?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(update)
    });
    return result[0];
}

async function getPayment(id) {
    const result = await supabaseRequest(`payments?id=eq.${encodeURIComponent(id)}&select=*`);
    return result[0] || null;
}

