export interface WebkitMessageHandler {
  postMessage: Function;
}

export interface FMTPlatformInterface {
  FMTShowAlert: (message: string, level?: string) => void;
  FMTShowAlertBar: (message: string) => void;
  FMTExportData: (data: string, filename: string) => void;
  FMTImportData: () => void;
  FMTFinishedLoading: () => void;
  FMTShowPrompt: (message: string, level?: string) => void;
}

export interface FMTAndroidInterface extends FMTPlatformInterface {}

export interface FMTiOSInterface {
  FMTShowAlert: WebkitMessageHandler;
  FMTShowAlertBar: WebkitMessageHandler;
  FMTExportData: WebkitMessageHandler;
  FMTImportData: WebkitMessageHandler;
  FMTFinishedLoading: WebkitMessageHandler;
  FMTShowPrompt: WebkitMessageHandler;
}

export enum FMTPlatformType {
  Android = "Android",
  IOS = "IOS",
  Web = "Web",
}

declare global {
  interface Webkit {
    messageHandlers: FMTiOSInterface;
  }

  interface Window {
    webkit?: Webkit;
  }
}

// TODO - modify android app
export declare var FMTAndroidPlatform: FMTAndroidInterface;
