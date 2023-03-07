import * as Sentry from '@sentry/node';
import * as vscode from 'vscode';
import { MixpanelApi } from '../api/mixpanel.api';
import { ConfigurationUtils } from '../utils/configuration-utils';

class AnalyticsService {
  mixpanelApi: MixpanelApi | undefined;
  sessionStartTime: Date | undefined;

  init(userId: string): void {
    this.mixpanelApi = new MixpanelApi(userId);
    this.sessionStartTime = new Date();

    this.updateUserProperties();
    this.tagEvent('session_start', {});
  }

  tagEvent(name: string, param?: { [key: string]: string }) {
    if (!vscode.env.isTelemetryEnabled) {
      return;
    }

    this.mixpanelApi?.trackEvent(name, param ?? {});
  }

  updateUserProperties() {
    if (!vscode.env.isTelemetryEnabled) {
      return;
    }

    this.mixpanelApi?.setUserProperties(ConfigurationUtils.getUserProperties());
  }

  trackUpdatedProperties(event: vscode.ConfigurationChangeEvent) {
    if (!vscode.env.isTelemetryEnabled) {
      return;
    }

    ConfigurationUtils.properties.forEach((property) => {
      const propertyName = property.scope + '.' + property.key;

      if (event.affectsConfiguration(propertyName)) {
        const value = ConfigurationUtils.getConfigurationValue<any>(
          property.scope,
          property.key,
        ).toString();
        this.mixpanelApi?.trackEvent('user_configuration_change', {
          name: propertyName,
          value,
        });
      }
    });
  }

  endSession() {
    if (!vscode.env.isTelemetryEnabled) {
      return;
    }

    const duration =
      new Date().getMilliseconds() - this.sessionStartTime!.getMilliseconds();
    this.mixpanelApi?.trackEvent('end_session', {
      duration: duration.toString(),
    });
  }

  trackError(err: any) {
    Sentry.captureException(err);
    this.mixpanelApi?.trackEvent('error', err);
  }
}

export const analyticsService = new AnalyticsService();
