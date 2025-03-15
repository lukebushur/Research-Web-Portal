import { ApplicationConfig } from "@angular/core";
import { provideProtractorTestingSupport } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";

import routeConfig from "./app.routes";
import { tokenInterceptor } from "./core/token-interceptor/token.interceptor";
import { LoadingInterceptor } from "./core/loading-interceptor/loading.interceptor";

// configuration to use when bootstrapping the application
export const appConfig: ApplicationConfig = {
  providers: [
    // provide support for protractor testing (end-to-end testing)
    provideProtractorTestingSupport(),
    // provide the routes defined in app.routes.ts
    provideRouter(routeConfig),
    // provide the HTTP client with the LoadingInterceptor
    provideHttpClient(
      withInterceptors([tokenInterceptor]),
      withInterceptorsFromDi(),
    ),
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    // provide browser animations
    provideAnimations(),
  ]
};
