import axios from 'axios';

// Hàm tạo header Basic Auth từ username và password
const createBasicAuthHeader = (username, password) => {
  const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${base64Credentials}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: 'Missing message or sessionId' });
  }

  // Lấy username và password từ biến môi trường
  const username = process.env.N8N_USERNAME || 'username';
  const password = process.env.N8N_PASSWORD || 'password';

  // Tạo header Basic Auth
  const authHeader = createBasicAuthHeader(username, password);

  try {
    const response = await axios.post(
        process.env.N8N_WEBHOOK || 'localhost:4567/webhook/08c45389-5815-437b-a1df',
      { chatInput: message, sessionId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        maxBodyLength: Infinity,
      }
    );

    const botResponse = response.data.response || 'Không có phản hồi từ server';
    return res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error('Error calling n8n webhook:', error.message);
    return res.status(500).json({ error: 'Không có phản hồi từ server' });
  }
}