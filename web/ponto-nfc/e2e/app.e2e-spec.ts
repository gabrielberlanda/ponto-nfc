import { PontoNfcPage } from './app.po';

describe('ponto-nfc App', () => {
  let page: PontoNfcPage;

  beforeEach(() => {
    page = new PontoNfcPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
