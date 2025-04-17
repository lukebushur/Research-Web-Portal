import { ApplicationConfig } from "@angular/core";
import { provideProtractorTestingSupport } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";

import routeConfig from "./app.routes";
import { tokenInterceptor } from "./core/token-interceptor/token.interceptor";
import { loadingInterceptor } from "./core/loading-interceptor/loading.interceptor";

// configuration to use when bootstrapping the application
export const appConfig: ApplicationConfig = {
  providers: [
    // provide support for protractor testing (end-to-end testing)
    provideProtractorTestingSupport(),
    // provide the routes defined in app.routes.ts
    provideRouter(routeConfig),
    // provide the HTTP client with interceptors
    provideHttpClient(
      withInterceptors([tokenInterceptor, loadingInterceptor])
    ),
    // provide browser animations
    provideAnimations(),
  ]
};
