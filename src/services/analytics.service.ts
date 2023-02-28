import TelemetryReporter, {
  TelemetryEventProperties,
} from '@vscode/extension-telemetry';
import * as vscode from 'vscode';
import { MixpanelApi } from '../api/mixpanel.api';
import { analyticsKey } from '../utils/analytics-key';
import { ConfigurationUtils } from '../utils/configuration-utils';

class AnalyticsService {
  reporter: TelemetryReporter | undefined;
  mixpanelApi: MixpanelApi | undefined;
  sessionStartTime: Date | undefined;

  init(userId: string): TelemetryReporter {
    this.reporter = new TelemetryReporter(analyticsKey);
    this.mixpanelApi = new MixpanelApi(userId);
    this.sessionStartTime = new Date();

    this.updateUserProperties();
    this.tagEvent('session_start', {});

    return this.reporter;
  }

  tagEvent(name: string, param?: TelemetryEventProperties) {
    if (!vscode.env.isTelemetryEnabled) {
      return;
    }

    this.reporter?.sendTelemetryEvent(name, param ?? {});
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
}

export const analyticsService = new AnalyticsService();
