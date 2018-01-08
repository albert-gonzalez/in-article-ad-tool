let expect = require('chai').expect;
let inArticleAdTool = require('../dist/inArticleAdTool');
let JSDOM = require('jsdom').JSDOM;

describe('inArticleAdTool', () => {
  describe('validating params', () => {
    it('should throw error if containerSelector is not a string', () => {
      expect(inArticleAdTool.init).to.throw('containerSelector should be a String');
    });

    it('should throw error if elementSelector is not a string', () => {
      expect(() => inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 0
      })).to.throw('elementSelector should be a String');
    });

    it('should throw error if adCode is not a string', () => {
      expect(() => inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'p'
      })).to.throw('adCode should be a String or function');
    });

    it('should throw error if firstAppearance is not a number', () => {
      expect(() => inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'p',
        adCode: '<script></script>',
        firstAppearance: 'hi'
      })).to.throw('firstAppearance should be a Number');
    });

    it('should throw error if firstAppearance is not a number', () => {
      expect(() => inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'p',
        adCode: '<script></script>',
        firstAppearance: -1
      })).to.throw('firstAppearance should be > 0');
    });

    it('should throw error if insertEvery is not a number', () => {
      expect(() => inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'p',
        adCode: '<script></script>',
        insertEvery: 'hi'
      })).to.throw('insertEvery should be a Number');
    });

    it('should throw error if insertEvery is not a number', () => {
      expect(() => inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'p',
        adCode: '<script></script>',
        insertEvery: -1
      })).to.throw('insertEvery should be >= 0');
    });
  });

  describe('single container', () => {
    beforeEach(() => {
      let window = new JSDOM(
        `
          <div class="container">
              <div></div>
              <div></div>
              <div>
                <div></div>
              </div>
              <div></div>
              <div></div>
              <span></span>
              <div></div>
              <div>
                <div></div>
              </div>
              <div></div>
          </div>
        `).window;
      global.window = window;
      global.document = window.document;
    });

    afterEach(() => {
      global.window = undefined;
      global.document = undefined;
    });

    it('should insert the given code after the element number set in firstAppearance param (value = 7)', () => {
      inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'div',
        adCode: '<script>MyCode</script>',
        firstAppearance: 7
      });

      let elements = global.document.querySelectorAll('.container > *');

      expect(elements.length).equal(10);
      expect(global.document.querySelectorAll('script').length).equal(1);
      expect(elements[7].innerHTML).equal('MyCode');
      expect(elements[7].nodeName).equal('SCRIPT');
    });

    it('should insert the given code after the element number set in firstAppearance param and no repeat the code when insertEvery = 0', () => {
      inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'div',
        adCode: `<script src=""></script>
<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="myclient"
data-ad-slot="myslot"></ins>
<script type="text/javascript">(adsbygoogle = window.adsbygoogle || []).push({});</script>`,
        firstAppearance: 1,
        insertEvery: 0
      });

      let elements = global.document.querySelectorAll('.container > *');

      expect(elements.length).equal(12);
      expect(global.document.querySelectorAll('script').length).equal(2);
      expect(global.document.querySelectorAll('ins').length).equal(1);
      expect(elements[0].nodeName).equal('SCRIPT');
      expect(elements[1].nodeName).equal('INS');
      expect(elements[2].nodeName).equal('SCRIPT');
    });

    it('should insert the string returned by the adCode function', () => {
      inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'div',
        adCode: (element, index) => `<script>function script with el: ${element.nodeName} and index: ${index}</script>`,
        firstAppearance: 1,
        insertEvery: 6
      });

      let elements = global.document.querySelectorAll('.container > *');

      expect(elements.length).equal(11);
      expect(global.document.querySelectorAll('script').length).equal(2);
      expect(elements[0].nodeName).equal('SCRIPT');
      expect(elements[0].innerHTML).equal('function script with el: DIV and index: 0');
      expect(elements[8].nodeName).equal('SCRIPT');
      expect(elements[8].innerHTML).equal('function script with el: DIV and index: 1');
    });

    it('should insert the given code every X elements passed. X is the value set in insertEvery param', () => {
      inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'div',
        adCode: '<script>MyCode</script>',
        firstAppearance: 3,
        insertEvery: 2
      });

      let elements = global.document.querySelectorAll('.container > *');

      expect(elements.length).equal(12);
      expect(global.document.querySelectorAll('script').length).equal(3);
      expect(elements[2].nodeName).equal('SCRIPT');
      expect(elements[5].nodeName).equal('SCRIPT');
      expect(elements[9].nodeName).equal('SCRIPT');
    });
  });

  describe('multiple container', () => {
    beforeEach(() => {
      let window = new JSDOM(
        `
          <div class="container">
              <div></div>
              <div></div>
              <div>
                <div></div>
              </div>
              <div></div>
              <div></div>
              <span></span>
              <div></div>
              <div>
                <div></div>
              </div>
              <div></div>
          </div>
          <div class="container">
              <div></div>
              <div></div>
              <div>
                <div></div>
              </div>
              <div></div>
              <div></div>
              <span></span>
              <div></div>
              <div>
                <div></div>
              </div>
              <div></div>
          </div>
        `).window;
      global.window = window;
      global.document = window.document;
    });

    afterEach(() => {
      global.window = undefined;
      global.document = undefined;
    });

    it('should insert the given code after the element number set in firstAppearance param', () => {
      inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'div',
        adCode: '<script>MyCode</script>',
        firstAppearance: 7
      });

      global.document.querySelectorAll('.container').forEach((element) => {
        let elements = element.childNodes;

        expect(element.querySelectorAll('script').length).equal(1);
        expect(elements.length).equal(20);
        expect(elements[15].innerHTML).equal('MyCode');
        expect(elements[15].nodeName).equal('SCRIPT');
      });
    });

    it('should insert the given code every X elements passed. X is the value set in insertEvery param', () => {
      inArticleAdTool.init({
        containerSelector: '.container',
        elementSelector: 'div',
        adCode: '<script>MyCode</script>',
        firstAppearance: 3,
        insertEvery: 2
      });

      global.document.querySelectorAll('.container').forEach((element) => {
        let elements = element.childNodes;

        expect(elements.length).equal(22);
        expect(element.querySelectorAll('script').length).equal(3);
        expect(elements[5].nodeName).equal('SCRIPT');
        expect(elements[10].nodeName).equal('SCRIPT');
        expect(elements[17].nodeName).equal('SCRIPT');
      });
    });
  });
});
