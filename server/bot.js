const axios = require('axios');

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHANNEL_ID;

async function sendMessage(message, images) {
  try {
    console.log(images)
    const sendMediaGroupUrl = `https://api.telegram.org/bot${botToken}/sendMediaGroup`;

    const media = images.map((image, index) => ({
      type: "photo",
      media: `https://7be4-84-54-84-110.ngrok-free.app/${image}`,
      caption: index === 0 ? message : undefined,
      parse_mode: "Markdown"
    }));

    const response = await axios.post(sendMediaGroupUrl, {
      chat_id: chatId,
      media: media,
    });
    return response.data.result[0].message_id
  } catch (error) {
    console.error("Error sending media group:", error.message);
    console.error(error.response?.data);
    throw error;
  }
}


async function editMessage(newMessage, messageId) {
  try {

    const editMessageUrl = `https://api.telegram.org/bot${botToken}/editMessageCaption`;
    const response = await axios.post(editMessageUrl, {
      chat_id: chatId,
      message_id: Number(messageId),
      caption: newMessage,
      parse_mode: 'Markdown',
    });
    return 200
  } catch (error) {
    return 400
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
