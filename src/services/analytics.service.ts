import TelemetryReporter, { TelemetryEventProperties } from "@vscode/extension-telemetry";
import { analyticsKey } from "../utils/analytics-key";

class AnalyticsService {
 reporter: TelemetryReporter | undefined;

 init(): TelemetryReporter {
    this.reporter = new TelemetryReporter(analyticsKey);

    return this.reporter;
 }

 tagEvent(name: string, param?: TelemetryEventProperties) {
    this.reporter?.sendTelemetryEvent(name, param ?? {});
 }
}

export const analyticsService = new AnalyticsService();