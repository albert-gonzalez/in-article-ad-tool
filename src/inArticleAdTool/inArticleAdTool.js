const FIRST_APPEARANCE_DEFAULT = 3;
const INSERT_EVERY_DEFAULT = 3;
const ELEMENT_SELECTOR_DEFAULT = 'p';

function init ({ containerSelector, ...options } = {}) {
  validateParams({ containerSelector, ...options });

  document.querySelectorAll(containerSelector).forEach(
    (element, index) => insertAdsIntoText({ element, index, ...options })
  );
};

function validateParams ({ containerSelector, elementSelector = ELEMENT_SELECTOR_DEFAULT, adCode, firstAppearance = FIRST_APPEARANCE_DEFAULT, insertEvery = INSERT_EVERY_DEFAULT }) {
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
}

function insertBefore (element, elementToAdd) {
  let parentElement = element.parentNode;

  parentElement.insertBefore(elementToAdd, element);
}

function convertNodeListToArray (nodeList) {
  return Array.from(nodeList.values());
}

function filterElementsAfterFirstAppereance ({ element, index, firstAppearance = FIRST_APPEARANCE_DEFAULT }) {
  return index + 1 >= firstAppearance;
}

function filterElementsByPosition ({ index, insertEvery = INSERT_EVERY_DEFAULT }) {
  return index === 0 || (insertEvery > 0 && index % insertEvery === 0);
}

function insertAdAfterElement ({ element, index, adCode }) {
  {
    let adCodeElement = document.createElement('div');

    if (typeof adCode === 'function') {
      adCode = adCode(element, index);
    }

    adCodeElement.innerHTML = adCode;

    adCodeElement.childNodes.forEach((child, index) => {
      let elementToInsert = child.cloneNode(true);

      if (elementToInsert.nodeName === 'SCRIPT') {
        let oldElement = elementToInsert;

        elementToInsert = document.createElement('script');

        if (oldElement.src) {
          elementToInsert.src = oldElement.src;
          elementToInsert.setAttribute('async', '');
        }

        let inlineScript = document.createTextNode(oldElement.text);

        elementToInsert.appendChild(inlineScript);
      }

      insertBefore(element, elementToInsert);
    });
  }
}

function insertAdsIntoText ({ element, index, elementSelector, ...options }) {
  element.setAttribute('data-in-article-container', index);

  let elements = convertNodeListToArray(
    element.querySelectorAll(`[data-in-article-container="${index}"] > ${elementSelector}`)
  );

  elements.filter((element, index) => {
    return filterElementsAfterFirstAppereance({ element, index, ...options });
  }).filter((element, index) => {
    return filterElementsByPosition({ index, ...options });
  }).forEach((element, index) => {
    insertAdAfterElement({ element, index, ...options });
  });
}

export default {
  init
};
