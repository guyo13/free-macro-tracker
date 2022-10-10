// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

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

export default class FMTPlatform implements FMTPlatformInterface {
  #platform: string;
  userPromptPlatformCallback?: (response: boolean) => void;
  #hasPlatformInterface: boolean;

  constructor() {
    this.#platform = FMTPlatform.determinePlatform();
    this.#hasPlatformInterface = this.#platform !== FMTPlatformType.Web;
    this.userPromptPlatformCallback = null;
  }

  get platform() {
    return this.#platform;
  }

  get hasPlatformInterface() {
    return this.#hasPlatformInterface;
  }

  // TODO - Issue a call to the platform to get the platform name
  static isAndroidPlatform() {
    return typeof FMTAndroidPlatform !== "undefined";
  }

  static isIOSPlatform() {
    return (
      typeof window.webkit !== "undefined" &&
      typeof window.webkit.messageHandlers !== "undefined"
    );
  }

  static isWebPlatform() {
    return !(this.isAndroidPlatform() || this.isIOSPlatform());
  }

  static determinePlatform() {
    if (this.isAndroidPlatform()) return FMTPlatformType.Android;
    else if (this.isIOSPlatform()) return FMTPlatformType.IOS;
    else return FMTPlatformType.Web;
  }

  FMTShowAlert(message: string, level?: string) {
    switch (this.#platform) {
      case FMTPlatformType.Android:
        FMTAndroidPlatform.FMTShowAlert(message, level);
        break;
      case FMTPlatformType.IOS:
        window.webkit.messageHandlers.FMTShowAlert.postMessage({
          msg: message,
          level: level,
        });
        break;
    }
  }

  FMTShowAlertBar(message: string) {
    switch (this.#platform) {
      case FMTPlatformType.Android:
        FMTAndroidPlatform.FMTShowAlertBar(message);
        break;
      case FMTPlatformType.IOS:
        window.webkit.messageHandlers.FMTShowAlertBar.postMessage({
          msg: message,
        });
        break;
    }
  }

  FMTExportData(data: string, filename: string) {
    switch (this.#platform) {
      case FMTPlatformType.Android:
        FMTAndroidPlatform.FMTExportData(data, filename);
        break;
      case FMTPlatformType.IOS:
        window.webkit.messageHandlers.FMTExportData.postMessage({
          data: data,
          filename: filename,
        });
        break;
    }
  }

  FMTImportData() {
    switch (this.#platform) {
      case FMTPlatformType.Android:
        FMTAndroidPlatform.FMTImportData();
        break;
      case FMTPlatformType.IOS:
        window.webkit.messageHandlers.FMTImportData.postMessage("");
        break;
    }
  }

  FMTFinishedLoading() {
    switch (this.#platform) {
      case FMTPlatformType.Android:
        FMTAndroidPlatform.FMTFinishedLoading();
        break;
      case FMTPlatformType.IOS:
        window.webkit.messageHandlers.FMTFinishedLoading.postMessage("");
        break;
    }
  }

  FMTShowPrompt(message: string, level?: string) {
    switch (this.#platform) {
      case FMTPlatformType.Android:
        FMTAndroidPlatform.FMTShowPrompt(message, level);
        break;
      case FMTPlatformType.IOS:
        window.webkit.messageHandlers.FMTShowPrompt.postMessage({
          msg: message,
          level: level,
        });
        break;
    }
  }
}
