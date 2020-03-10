import { FundingSocietiesPage } from './app.po';

describe('funding-societies App', () => {
  let page: FundingSocietiesPage;

  beforeEach(() => {
    page = new FundingSocietiesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
