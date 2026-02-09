# MobileTv

## Using libraries

### Services Library (@mobile-tv/services)

```typescript
import { ExampleService } from '@mobile-tv/services';
```

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve mobile-test-app
```

To create a production bundle:

```sh
npx nx build mobile-test-app
```

To generate a new service in the services library:

```sh
npx nx g @nx/angular:service --name=my-service --project=services
```

To generate a new component in the UI library:

```sh
npx nx g @nx/angular:component --name=my-component --project=ui
```

To generate a new application, use:

```sh
npx nx g @nx/angular:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/angular:library --directory=libs/my-lib --name=my-lib
```
