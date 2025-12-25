// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const TelegramBot = require('node-telegram-bot-api');

class TelegramAdapter {
  constructor(token) {
    this.bot = new TelegramBot(token, { polling: true });
    this.activityHandlers = [];
    this.setupHandlers();
  }

  setupHandlers() {
    // Handle messages
    this.bot.on('message', async (msg) => {
      const activity = this.convertMessageToActivity(msg);
      await this.processActivity(activity);
    });

    // Handle callback queries (button clicks)
    this.bot.on('callback_query', async (query) => {
      const activity = this.convertCallbackToActivity(query);
      await this.processActivity(activity);
    });
  }

  convertMessageToActivity(msg) {
    return {
      type: 'message',
      id: msg.message_id.toString(),
      timestamp: new Date(msg.date * 1000),
      channelId: 'telegram',
      from: {
        id: msg.from.id.toString(),
        name: msg.from.first_name + (msg.from.last_name ? ' ' + msg.from.last_name : ''),
      },
      conversation: {
        id: msg.chat.id.toString(),
      },
      recipient: {
        id: this.bot.token.split(':')[0],
      },
      text: msg.text || '',
      attachments: this.convertAttachments(msg),
      rawActivity: msg,
    };
  }

  convertCallbackToActivity(query) {
    return {
      type: 'invoke',
      id: query.id,
      timestamp: new Date(),
      channelId: 'telegram',
      from: {
        id: query.from.id.toString(),
        name: query.from.first_name + (query.from.last_name ? ' ' + query.from.last_name : ''),
      },
      conversation: {
        id: query.message.chat.id.toString(),
      },
      value: {
        data: query.data,
      },
      rawActivity: query,
    };
  }

  convertAttachments(msg) {
    const attachments = [];

    if (msg.photo) {
      attachments.push({
        contentType: 'image',
        contentUrl: msg.photo[msg.photo.length - 1].file_id,
      });
    }

    if (msg.document) {
      attachments.push({
        contentType: 'application',
        contentUrl: msg.document.file_id,
        name: msg.document.file_name,
      });
    }

    if (msg.video) {
      attachments.push({
        contentType: 'video',
        contentUrl: msg.video.file_id,
      });
    }

    return attachments;
  }

  onActivity(handler) {
    this.activityHandlers.push(handler);
  }

  async processActivity(activity) {
    for (const handler of this.activityHandlers) {
      try {
        await handler(activity);
      } catch (error) {
        console.error('Error in activity handler:', error);
      }
    }
  }

  async sendMessage(chatId, message) {
    try {
      if (typeof message === 'string') {
        await this.bot.sendMessage(chatId, message, {
          parse_mode: 'Markdown',
        });
      } else if (message.text) {
        const options = {
          parse_mode: 'Markdown',
        };

        if (message.buttons) {
          options.reply_markup = this.createKeyboard(message.buttons);
        }

        await this.bot.sendMessage(chatId, message.text, options);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  createKeyboard(buttons) {
    const keyboard = buttons.map(row => row.map(btn => ({ text: btn.text, callback_data: btn.value })));
    return {
      inline_keyboard: keyboard,
    };
  }

  async sendFile(chatId, fileUrl, caption) {
    try {
      await this.bot.sendDocument(chatId, fileUrl, {
        caption: caption,
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Error sending file:', error);
    }
  }
}

module.exports = { TelegramAdapter };
