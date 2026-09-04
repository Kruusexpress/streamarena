import axios, { AxiosInstance } from 'axios';

const TWITCH_API_BASE = 'https://api.twitch.tv/helix';

export class TwitchAPI {
  private client: AxiosInstance;
  private clientId: string;
  private accessToken: string;

  constructor(clientId: string, accessToken: string) {
    this.clientId = clientId;
    this.accessToken = accessToken;
    this.client = axios.create({
      baseURL: TWITCH_API_BASE,
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get authenticated user's information
   */
  async getAuthenticatedUser() {
    try {
      const response = await this.client.get('/users');
      return response.data.data[0];
    } catch (error) {
      console.error('Error fetching authenticated user:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    try {
      const response = await this.client.get('/users', {
        params: { id: userId },
      });
      return response.data.data[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Get user by username
   */
  async getUserByLogin(login: string) {
    try {
      const response = await this.client.get('/users', {
        params: { login },
      });
      return response.data.data[0];
    } catch (error) {
      console.error('Error fetching user by login:', error);
      throw error;
    }
  }

  /**
   * Get user's stream information
   */
  async getStreamInfo(userId: string) {
    try {
      const response = await this.client.get('/streams', {
        params: { user_id: userId },
      });
      return response.data.data[0];
    } catch (error) {
      console.error('Error fetching stream info:', error);
      throw error;
    }
  }

  /**
   * Create EventSub subscription
   */
  async createEventSubSubscription(
    type: string,
    version: string,
    condition: Record<string, string>,
    transport: Record<string, string>
  ) {
    try {
      const response = await this.client.post('/eventsub/subscriptions', {
        type,
        version,
        condition,
        transport,
      });
      return response.data.data[0];
    } catch (error) {
      console.error('Error creating EventSub subscription:', error);
      throw error;
    }
  }

  /**
   * List EventSub subscriptions
   */
  async listEventSubSubscriptions() {
    try {
      const response = await this.client.get('/eventsub/subscriptions');
      return response.data.data;
    } catch (error) {
      console.error('Error listing EventSub subscriptions:', error);
      throw error;
    }
  }

  /**
   * Delete EventSub subscription
   */
  async deleteEventSubSubscription(subscriptionId: string) {
    try {
      await this.client.delete('/eventsub/subscriptions', {
        params: { id: subscriptionId },
      });
    } catch (error) {
      console.error('Error deleting EventSub subscription:', error);
      throw error;
    }
  }

  /**
   * Get channel information
   */
  async getChannelInfo(broadcasterId: string) {
    try {
      const response = await this.client.get('/channels', {
        params: { broadcaster_id: broadcasterId },
      });
      return response.data.data[0];
    } catch (error) {
      console.error('Error fetching channel info:', error);
      throw error;
    }
  }
}

/**
 * Get OAuth token from Twitch
 */
export async function getTwitchOAuthToken(code: string) {
  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TWITCH_REDIRECT_URI,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting OAuth token:', error);
    throw error;
  }
}

/**
 * Refresh OAuth token
 */
export async function refreshTwitchOAuthToken(refreshToken: string) {
  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error refreshing OAuth token:', error);
    throw error;
  }
}

/**
 * Validate OAuth token
 */
export async function validateTwitchToken(accessToken: string) {
  try {
    const response = await axios.get('https://id.twitch.tv/oauth2/validate', {
      headers: {
        'Authorization': `OAuth ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error validating token:', error);
    throw error;
  }
}
