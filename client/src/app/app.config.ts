import { ApplicationConfig } from "@angular/core";
import { provideProtractorTestingSupport } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { LoadingInterceptor } from "./loading.interceptor";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import routeConfig from "./app.routes";

// configuration to use when bootstrapping the application
export const appConfig: ApplicationConfig = {
  providers: [
    // provide support for protractor testing (end-to-end testing)
    provideProtractorTestingSupport(),
    // provide the routes defined in app.routes.ts
    provideRouter(routeConfig),
    // provide the HTTP client with the LoadingInterceptor
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    // provide browser animations
    provideAnimations()
  ]
};