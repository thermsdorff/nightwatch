const assert = require('assert');
const {WebElement, Key} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().setValue() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().setValue()', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/elements',
        postdata: {
          using: 'css selector',
          value: 'input[name=q]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '9'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/clear',
        method: 'POST',
        postdata: {},
        response: JSON.stringify({
          value: null
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/value',
        method: 'POST',
        postdata: {
          text: 'nightwatch',
          value: [
            'n', 'i', 'g', 'h', 't', 'w', 'a', 't', 'c', 'h'
          ]
        },
        response: JSON.stringify({
          value: null
        })
      }, true);

    const resultPromise = this.client.api.element('input[name=q]').setValue('nightwatch');
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });

  it('test .element().find().setValue()', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'css selector',
          value: 'input[name=q]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '9'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/clear',
        method: 'POST',
        postdata: {},
        response: JSON.stringify({
          value: null
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/value',
        method: 'POST',
        postdata: {
          text: 'nightwatch',
          value: [
            'n', 'i', 'g', 'h', 't', 'w', 'a', 't', 'c', 'h'
          ]
        },
        response: JSON.stringify({
          value: null
        })
      }, true);

    const resultPromise = this.client.api.element('#signupSection').find('input[name=q]').setValue('night', 'watch');
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });

  it('test .element.find().setValue()', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'css selector',
          value: 'input[name=q]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '9'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/clear',
        method: 'POST',
        postdata: {},
        response: JSON.stringify({
          value: null
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/value',
        method: 'POST',
        postdata: {
          text: 'nightwatch',
          value: [
            'n', 'i', 'g', 'h', 't', 'w', 'a', 't', 'c', 'h'
          ]
        },
        response: JSON.stringify({
          value: null
        })
      }, true);

    const resultPromise = this.client.api.element.find('#signupSection').find('input[name=q]').setValue(['night', 'watch']);
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');
  });

  it('test .element().setValue() with clear fallback sending keys', async function() {
    let sendKeysMockCalled = 0;

    MockServer
      .addMock({
        url: '/session/13521-10219-202/elements',
        postdata: {
          using: 'css selector',
          value: 'input[name=q]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '9'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/clear',
        method: 'POST',
        postdata: {},
        response: JSON.stringify({
          value: null
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/property/value',
        method: 'GET',
        response: {value: 'sample'}
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/value',
        method: 'POST',
        response: {value: null},
        onRequest(_, requestData) {
          assert.strictEqual(requestData.text, Array(6).fill(Key.BACK_SPACE).join(''));
          sendKeysMockCalled++;
        }
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/9/value',
        method: 'POST',
        postdata: {
          text: 'nightwatch',
          value: [
            'n', 'i', 'g', 'h', 't', 'w', 'a', 't', 'c', 'h'
          ]
        },
        response: JSON.stringify({
          value: null
        }),
        onRequest(_, requestData) {
          assert.strictEqual(requestData.text, 'nightwatch');
          sendKeysMockCalled++;
        }
      }, true);

    const resultPromise = this.client.api.element('input[name=q]').setValue('nightwatch');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '9');

    assert.strictEqual(sendKeysMockCalled, 2);
  });
});
