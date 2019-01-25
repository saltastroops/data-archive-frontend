import * as Raven from "raven-js";

export const sentryUrl = `https://${
  process.env.REACT_APP_SENTRY_KEY
}@app.getsentry.com/${process.env.REACT_APP_SENTRY_APP}`;

export function logException(ex: any, context: any) {
  Raven.captureException(ex, {
    extra: context
  });
  /* tslint:disable-next-line:no-unused-expression*/
  window && window.console && console.error && console.error(ex);
}
