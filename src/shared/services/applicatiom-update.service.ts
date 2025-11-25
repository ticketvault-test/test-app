import { inject, Injectable, signal } from '@angular/core';

import { ItemData } from '../models/item-data';
import { generateMock } from '../helpers/mock-generator';
import { SwUpdate } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class ApplicatiomUpdateService {
}
