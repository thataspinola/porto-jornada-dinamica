export function redirectTo(urlOrSlug: string) {

  const pathList = urlOrSlug?.split('/');

  const isSlug = pathList?.length <= 2;

  if (isSlug) {
    const urlStep = pathList[1];
    window.open(urlStep, '_self');
  }

  const isExternal = /^https?:\/\//i.test(urlOrSlug);

  if (isExternal) {
    window.location.assign(urlOrSlug);
    return;
  }
}
