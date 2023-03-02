import fetch from 'node-fetch';
import { analyticsService } from '../services/analytics.service';
import { UserService } from '../services/user.service';
import { mixpanelToken } from '../utils/analytics-key';

export class MixpanelApi {
  private apiBaseUrl = 'https://api.mixpanel.com';
  private options = {
    method: 'POST',
    headers: { accept: 'text/plain', 'content-type': 'application/json' },
  };
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  trackEvent(event: string, params: { [key: string]: string }) {
    const eventDetails = {
      event,
      properties: {
        ...params,
        token: mixpanelToken,
        distinct_id: this.userId,
        $os: process.platform,
        $app_version_string: UserService.getAppVersion(),
      },
    };

    const options = {
      ...this.options,
      body: JSON.stringify([eventDetails]),
    };

    fetch(`${this.apiBaseUrl}/track`, options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => analyticsService.trackError(err));
  }

  setUserProperties(properties: { [key: string]: string }) {
    const eventDetails = {
      $token: mixpanelToken,
      $distinct_id: this.userId,
      $set: properties,
    };

    const options = {
      ...this.options,
      body: JSON.stringify([eventDetails]),
    };

    fetch(`${this.apiBaseUrl}/engage#profile-set`, options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => analyticsService.trackError(err));
  }
}
