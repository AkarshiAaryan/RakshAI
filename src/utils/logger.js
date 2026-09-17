// HCI Experiment & Safety Event Logger
class EventLogger {
  constructor() {
    this.logs = [];
    this.sessionId = 'session_' + Math.random().toString(36).substring(2, 9);
    this.startTime = Date.now();
  }

  log(eventType, payload = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      elapsedMs: Date.now() - this.startTime,
      sessionId: this.sessionId,
      eventType,
      payload
    };
    this.logs.push(entry);
    console.log(`[RakshAI Log: ${eventType}]`, entry);
  }

  getLogs() {
    return this.logs;
  }

  exportLogsAsJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rakshai_experiment_log_${this.sessionId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new EventLogger();
