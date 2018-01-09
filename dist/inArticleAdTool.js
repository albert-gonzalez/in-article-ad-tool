/**
 * in-article-ad-tool
 * Generated: 2018-01-09
 * Version: 0.1.0
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.inArticleAdTool = factory());
}(this, (function () { 'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var FIRST_APPEARANCE_DEFAULT = 3;
var INSERT_EVERY_DEFAULT = 3;
var ELEMENT_SELECTOR_DEFAULT = 'p';
var LIMIT_DEFAULT = 0;

function init() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var containerSelector = _ref.containerSelector,
      _ref$limit = _ref.limit,
      limit = _ref$limit === undefined ? LIMIT_DEFAULT : _ref$limit,
      options = _objectWithoutProperties(_ref, ['containerSelector', 'limit']);

  validateParams(_extends({ containerSelector: containerSelector, limit: limit }, options));
  var adsInserted = 0;
  var hasLimit = limit > 0;

  document.querySelectorAll(containerSelector).forEach(function (element, index) {
    if (!hasLimit || adsInserted < limit) {
      adsInserted += insertAdsIntoText(_extends({ element: element, index: index, limit: limit }, options));

      if (hasLimit) {
        options.limit -= adsInserted;
      }
    }
  });
}

function validateParams(_ref2) {
  var containerSelector = _ref2.containerSelector,
      _ref2$elementSelector = _ref2.elementSelector,
      elementSelector = _ref2$elementSelector === undefined ? ELEMENT_SELECTOR_DEFAULT : _ref2$elementSelector,
      adCode = _ref2.adCode,
      _ref2$firstAppearance = _ref2.firstAppearance,
      firstAppearance = _ref2$firstAppearance === undefined ? FIRST_APPEARANCE_DEFAULT : _ref2$firstAppearance,
      _ref2$insertEvery = _ref2.insertEvery,
      insertEvery = _ref2$insertEvery === undefined ? INSERT_EVERY_DEFAULT : _ref2$insertEvery,
      _ref2$limit = _ref2.limit,
      limit = _ref2$limit === undefined ? LIMIT_DEFAULT : _ref2$limit;

  if (typeof containerSelector !== 'string') {
    throw new Error('containerSelector should be a String');
  }

  if (typeof elementSelector !== 'string') {
    throw new Error('elementSelector should be a String');
  }

  if (typeof adCode !== 'string' && typeof adCode !== 'function') {
    throw new Error('adCode should be a String or function');
  }

  if (typeof firstAppearance !== 'number') {
    throw new Error('firstAppearance should be a Number');
  }

  if (firstAppearance <= 0) {
    throw new Error('firstAppearance should be > 0');
  }

  if (typeof insertEvery !== 'number') {
    throw new Error('insertEvery should be a Number');
  }

  if (insertEvery < 0) {
    throw new Error('insertEvery should be >= 0');
  }

  if (typeof limit !== 'number') {
    throw new Error('limit should be a Number');
  }

  if (limit < 0) {
    throw new Error('limit should be >= 0');
  }
}

function insertBefore(element, elementToAdd) {
  var parentElement = element.parentNode;

  parentElement.insertBefore(elementToAdd, element);
}

function convertNodeListToArray(nodeList) {
  return Array.from(nodeList.values());
}

function filterElementsAfterFirstAppereance(_ref3) {
  var element = _ref3.element,
      index = _ref3.index,
      _ref3$firstAppearance = _ref3.firstAppearance,
      firstAppearance = _ref3$firstAppearance === undefined ? FIRST_APPEARANCE_DEFAULT : _ref3$firstAppearance;

  return index + 1 >= firstAppearance;
}

function filterElementsByPosition(_ref4) {
  var index = _ref4.index,
      _ref4$insertEvery = _ref4.insertEvery,
      insertEvery = _ref4$insertEvery === undefined ? INSERT_EVERY_DEFAULT : _ref4$insertEvery;

  return index === 0 || insertEvery > 0 && index % insertEvery === 0;
}

function filterElementsByLimit(_ref5) {
  var index = _ref5.index,
      _ref5$limit = _ref5.limit,
      limit = _ref5$limit === undefined ? LIMIT_DEFAULT : _ref5$limit;

  return limit === 0 || limit > 0 && index < limit;
}

function insertAdAfterElement(_ref6) {
  var element = _ref6.element,
      index = _ref6.index,
      adCode = _ref6.adCode;

  {
    var adCodeElement = document.createElement('div');

    if (typeof adCode === 'function') {
      adCode = adCode(element, index);
    }

    adCodeElement.innerHTML = adCode;

    adCodeElement.childNodes.forEach(function (child, index) {
      var elementToInsert = child.cloneNode(true);

      if (elementToInsert.nodeName === 'SCRIPT') {
        var oldElement = elementToInsert;

        elementToInsert = document.createElement('script');

        if (oldElement.src) {
          elementToInsert.src = oldElement.src;
          elementToInsert.setAttribute('async', '');
        }

        var inlineScript = document.createTextNode(oldElement.text);

        elementToInsert.appendChild(inlineScript);
      }

      insertBefore(element, elementToInsert);
    });
  }
}

function insertAdsIntoText(_ref7) {
  var element = _ref7.element,
      index = _ref7.index,
      elementSelector = _ref7.elementSelector,
      options = _objectWithoutProperties(_ref7, ['element', 'index', 'elementSelector']);

  element.setAttribute('data-in-article-container', index);

  var elements = convertNodeListToArray(element.querySelectorAll('[data-in-article-container="' + index + '"] > ' + elementSelector));

  elements.filter(function (element, index) {
    return filterElementsAfterFirstAppereance(_extends({ element: element, index: index }, options));
  }).filter(function (element, index) {
    return filterElementsByPosition(_extends({ index: index }, options));
  }).filter(function (element, index) {
    return filterElementsByLimit(_extends({ index: index }, options));
  }).forEach(function (element, index) {
    insertAdAfterElement(_extends({ element: element, index: index }, options));
  });

  return elements.length;
}

var inArticleAdTool = {
  init: init
};

return inArticleAdTool;

})));
