
export async function sendMessageToRubika(token: string, chatId: string, text: string) {
  try {
    const url = `https://botapi.rubika.ir/`;

    // Most Rubika Bot APIs use this JSON structure
    const payload = {
      method: 'sendMessage',
      input: {
        chat_id: chatId,
        text: text
      },
      token: token
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Rubika API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Check if Rubika returned an error in the JSON (common in their API)
    if (data.status === 'ERROR' || data.ok === false) {
      throw new Error(data.description || data.message || 'Unknown Rubika API error');
    }

    return data;
  } catch (error: any) {
    console.error('sendMessageToRubika Error:', error);
    throw error;
  }
}
