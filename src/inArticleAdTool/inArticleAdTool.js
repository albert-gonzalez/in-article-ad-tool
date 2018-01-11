const FIRST_APPEARANCE_DEFAULT = 3;
const INSERT_EVERY_DEFAULT = 3;
const ELEMENT_SELECTOR_DEFAULT = 'p';
const LIMIT_DEFAULT = 0;

function init ({ containerSelector, limit = LIMIT_DEFAULT, ...options } = {}) {
  validateParams({ containerSelector, limit, ...options });
  let adsInserted = 0;
  let hasLimit = limit > 0;

  document.querySelectorAll(containerSelector).forEach(
    (element, index) => {
      if (!hasLimit || adsInserted < limit) {
        const newlimit = hasLimit ? limit - adsInserted : 0;
        adsInserted += insertAdsIntoText({ element, index, limit: newlimit, ...options });
      }
    }
  );
};

function validateParams ({ containerSelector,
  elementSelector = ELEMENT_SELECTOR_DEFAULT,
  adCode,
  firstAppearance = FIRST_APPEARANCE_DEFAULT,
  insertEvery = INSERT_EVERY_DEFAULT,
  limit = LIMIT_DEFAULT
}) {
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

function filterElementsByLimit ({ index, limit = LIMIT_DEFAULT }) {
  return limit === 0 || (limit > 0 && index < limit);
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

  let filteredElements = elements.filter((element, index) => {
    return filterElementsAfterFirstAppereance({ element, index, ...options });
  }).filter((element, index) => {
    return filterElementsByPosition({ index, ...options });
  }).filter((element, index) => {
    return filterElementsByLimit({ index, ...options });
  });

  filteredElements.forEach((element, index) => {
    insertAdAfterElement({ element, index, ...options });
  });

  return filteredElements.length;
}

export default {
  init
};
