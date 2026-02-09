import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/core/app.component';
import { appConfig } from './app/core/constants/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
