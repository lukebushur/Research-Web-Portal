import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {  } from './app/_helpers/auth/app.auth';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
