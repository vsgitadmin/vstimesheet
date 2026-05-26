import { useState } from 'react';
import { toast } from 'react-toastify';
import SelectUserInput from '../../../src/Components/SelectUserInput/index';
import { createUserNotification } from '../../../src/Controllers/Communication/index';

export default function TestNotificationPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [sending, setSending] = useState(false);

  const onUserChange = (u) => {
    if (Array.isArray(u)) {
      setSelectedUser(u[0] ?? null);
    } else {
      setSelectedUser(u ?? null);
    }
  };

  const sendTest = async () => {
    if (!selectedUser?._id) {
      toast.error('Select a user first.');
      return;
    }
    setSending(true);
    try {
      await createUserNotification({
        reciever: selectedUser._id,
        text: `Test notification — sent at ${new Date().toISOString()}`,
        link: '/admin/dashboard/test-notification',
        type: 'general',
      });
      toast.success('Notification saved and pushed to that user’s socket (if they are connected).');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Request failed';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, padding: '1rem 0' }}>
      <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Test live notification</h1>
      <p style={{ color: '#555', fontSize: 14, marginBottom: '1.25rem', lineHeight: 1.5 }}>
        Uses the same path as production: <code>createNotification</code> persists the row, then the server emits{' '}
        <code>notification</code> to the recipient’s stored socket id. Open a second browser (or incognito) as the
        recipient with the dashboard open so their client registers <code>updateID</code>.
      </p>
      <SelectUserInput
        multiSelect={false}
        returnRaw={true}
        returnUser={onUserChange}
        deleteUser={() => setSelectedUser(null)}
        label="Recipient"
      />
      <button
        type="button"
        className="jobs_add_btn"
        style={{ marginTop: 20 }}
        disabled={sending || !selectedUser}
        onClick={sendTest}
      >
        {sending ? 'Sending…' : 'Send'}
      </button>
    </div>
  );
}
