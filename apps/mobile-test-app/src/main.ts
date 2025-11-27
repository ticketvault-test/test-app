import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/core/app-config/app.config';
import { AppComponent } from './app/core/app.component';

import { defineCustomElements } from '@ionic/core/loader';

defineCustomElements(window);

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
