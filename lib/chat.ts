import tmi from 'tmi.js';
import { EventEmitter } from 'events';

export interface ChatCommand {
  command: string;
  args: string[];
  username: string;
  displayName: string;
  userstate: tmi.Userstate;
}

type CommandHandler = (cmd: ChatCommand) => void | Promise<void>;

export class TwitchChatManager extends EventEmitter {
  private client: tmi.Client | null = null;
  private commandHandlers: Map<string, CommandHandler> = new Map();
  private connected = false;

  constructor(private accessToken: string, private channelName: string) {
    super();
  }

  /**
   * Connect to Twitch chat
   */
  async connect() {
    if (this.connected) return;

    this.client = new tmi.Client({
      options: { debug: true, messagesLogLevel: 'info' },
      connection: {
        secure: true,
        reconnect: true,
      },
      identity: {
        username: 'streamerama-bot',
        password: `oauth:${this.accessToken}`,
      },
      channels: [this.channelName],
    });

    this.client.on('message', this.handleMessage.bind(this));
    this.client.on('connected', () => {
      this.connected = true;
      this.emit('connected');
      console.log(`Connected to ${this.channelName}`);
    });
    this.client.on('disconnected', () => {
      this.connected = false;
      this.emit('disconnected');
    });

    await this.client.connect();
  }

  /**
   * Disconnect from Twitch chat
   */
  async disconnect() {
    if (this.client && this.connected) {
      await this.client.disconnect();
      this.connected = false;
    }
  }

  /**
   * Register command handler
   */
  registerCommand(command: string, handler: CommandHandler) {
    this.commandHandlers.set(command.toLowerCase(), handler);
  }

  /**
   * Handle incoming messages
   */
  private async handleMessage(
    channel: string,
    userstate: tmi.Userstate,
    message: string,
    self: boolean
  ) {
    if (self || !message.startsWith('!')) return;

    const parts = message.slice(1).split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const handler = this.commandHandlers.get(command);
    if (handler) {
      const username = userstate['user-id'] || 'unknown';
      const displayName = userstate['display-name'] || 'Unknown';
      
      try {
        await handler({
          command,
          args,
          username,
          displayName,
          userstate,
        });
      } catch (error) {
        console.error(`Error handling command ${command}:`, error);
        this.emit('error', error);
      }
    }

    this.emit('message', { command, args, username: userstate['user-id'], message });
  }

  /**
   * Send message to chat
   */
  async sendMessage(message: string) {
    if (this.client && this.connected) {
      await this.client.say(this.channelName, message);
    }
  }

  /**
   * Get connection status
   */
  isConnected() {
    return this.connected;
  }
}
