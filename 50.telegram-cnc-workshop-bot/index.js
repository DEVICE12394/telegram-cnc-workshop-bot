// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

const { CNCWorkshopBot } = require('./bot');
const { TelegramAdapter } = require('./adapters/telegramAdapter');
const { DashboardServer } = require('./services/dashboardServer');

// Create the telegram adapter
const telegramAdapter = new TelegramAdapter(process.env.TELEGRAM_BOT_TOKEN);

// Create the bot instance con soporte para alertas
const cncBot = new CNCWorkshopBot(telegramAdapter);

// Inicializar servicios que necesita el dashboard
const alertManager = cncBot.alertManager;
const database = cncBot.database;
const monitoringService = cncBot.monitoringService;
const notificationService = cncBot.notificationService;

// Create and start the dashboard server
const dashboardServer = new DashboardServer(
    alertManager,
    database,
    monitoringService,
    notificationService
);
dashboardServer.start();

// Listen for incoming messages from Telegram
telegramAdapter.onActivity(async (activity) => {
  try {
    await cncBot.onTurn(telegramAdapter, activity);
  } catch (error) {
    console.error('Error processing activity:', error);
  }
});

const PORT = process.env.PORT || 3978;
console.log(`\n${'='.repeat(50)}`);
console.log('🏭 CNC Workshop Telegram Bot iniciado');
console.log(`${'='.repeat(50)}`);
console.log(`\n📡 Bot Telegram: Puerto ${PORT}`);
console.log(`🌐 Dashboard Web: http://localhost:3000`);
console.log(`\n✅ Sistema de alertas: Activo`);
console.log(`📡 Monitoreo automático: En ejecución`);
console.log(`\n${'='.repeat(50)}`);
console.log('Presiona Ctrl+C para salir.\n');
