/**
 * Server-only: uses TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (never expose to the client).
 * Plain text (no parse_mode) so customer names/addresses cannot break Telegram formatting.
 */
export async function sendTelegramMessage(message: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!res.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
