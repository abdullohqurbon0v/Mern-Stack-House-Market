const axios = require('axios');

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHANNEL_ID;

async function sendMessage(message) {
  try {
    const sendMessageUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(sendMessageUrl, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });

    return response.data.result.message_id;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
}

async function editMessage(newMessage, messageId) {
  try {
    const editMessageUrl = `https://api.telegram.org/bot${botToken}/editMessageText`;
    const response = await axios.post(editMessageUrl, {
      chat_id: chatId,
      message_id: messageId,
      text: newMessage,
      parse_mode: 'HTML',
    });

    console.log('Message edited successfully:', response.data);
  } catch (error) {
    console.error('Error editing message:', error.response?.data || error.message);
  }
}

async function removeMessage(messageId) {
  try {
    const deleteMessageUrl = `https://api.telegram.org/bot${botToken}/deleteMessage`;
    const response = await axios.post(deleteMessageUrl, {
      chat_id: chatId,
      message_id: messageId,
    });

    console.log('Message deleted successfully:', response.data);
  } catch (error) {
    console.error('Error deleting message:', error.response?.data || error.message);
  }
}



module.exports = { sendMessage, editMessage, removeMessage };
