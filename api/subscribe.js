export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        source: 'website',
        subscribed: true
      })
    });

    const data = await response.json();

    // Handle success or "already subscribed" as success
    if (data.success || data.id || (data.message && data.message.includes('already'))) {
      return res.status(200).json({ success: true, message: 'Subscribed successfully' });
    }

    console.error('Loops error:', data);
    return res.status(500).json({ error: 'Failed to subscribe', details: data });
  } catch (error) {
    console.error('Error subscribing:', error);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
