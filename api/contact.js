export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, address, address2, city, zip, capacity, message } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !address || !city || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Format the email content
  const fullAddress = `${address}${address2 ? ', ' + address2 : ''}, ${city}, TX ${zip || ''}`.trim();

  const capacityLabels = {
    'single': 'Single Item ($125)',
    'quarter': '1/4 Truck ($275)',
    'half': '1/2 Truck ($449)',
    'three-quarter': '3/4 Truck ($599)',
    'full': 'Full Truck ($749)',
    'unsure': 'Not Sure - Need Estimate'
  };

  const emailHtml = `
    <h2>New Quote Request</h2>
    <p><strong>From:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Phone:</strong> <a href="tel:${phone.replace(/\D/g, '')}">${phone}</a></p>
    <p><strong>Address:</strong> ${fullAddress}</p>
    <p><strong>Estimated Capacity:</strong> ${capacityLabels[capacity] || capacity || 'Not specified'}</p>
    <hr>
    <h3>What they need removed:</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p style="color: #666; font-size: 12px;">This quote request was submitted via jltmjunk.com</p>
  `;

  const emailText = `
New Quote Request

From: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Address: ${fullAddress}
Estimated Capacity: ${capacityLabels[capacity] || capacity || 'Not specified'}

What they need removed:
${message}

---
This quote request was submitted via jltmjunk.com
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'JLTM Website <onboarding@resend.dev>',
        to: 'info@jltmjunk.com',
        reply_to: email,
        subject: `Quote Request from ${firstName} ${lastName}`,
        html: emailHtml,
        text: emailText
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, message: 'Quote request sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
