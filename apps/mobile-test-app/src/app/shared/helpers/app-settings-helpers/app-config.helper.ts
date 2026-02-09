const SKIP_CONFIG_URLS = [
  'assets/images/',
  'assets/icons/',
  'assets/app-settings/',
  'login',
];

export function isSkipGettingAppSettings(url: string): boolean {
  return SKIP_CONFIG_URLS.some(el => url.toLowerCase().includes(el));
}
