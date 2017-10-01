const LOOP_PATTERN = /\.*?{# for ([^\s]+) in ([^\s]+) #\}(.*)\{# end #\}/;
const DATA_PATTERN = /\{% ([^\s]+) %\}/g;
const REPLACE_PATTERN = /\{[#%].*?[#%]\}/g;

/**
 * Checks whether a value is an object or not.
 * @param {any} obj Value to be tested.
 * @returns {Boolean}
 */
const isObject = obj => obj === Object(obj);

/**
 * Takes a dot notation path attempts to traverse this path through
 * the given object.
 * @param {String} path Dot delimited path to take through object.
 * @param {Object} obj Object to retrieve data from.
 * @returns {any}
 */
const getValueFromObject = (path, obj) => {
    if (!isObject(obj)) {
        return obj;
    }

    const splitPath = path.split('.');
    const nextPath = splitPath.slice(1);

    const firstKey = splitPath.slice(0, 1);
    const nextObject = obj[firstKey];

    return getValueFromObject(nextPath, nextObject);
};

/**
 * Inserts data into the relevant sections of the template.
 * @param {String} template The template to insert data into.
 * @param {Object|String} data The data to insert into the template.
 * @param {String} [dataKey] Optional string to discard from the template
 *      directives.
 * @returns {String}
 */
const fillData = (template, data, dataPrefix = '') => {
    return template.replace(DATA_PATTERN, (match, dataKey) => {
        const processedKey = dataKey.replace(dataPrefix, '');
        const valueToFill = getValueFromObject(processedKey, data);
        return valueToFill === undefined ? '' : valueToFill;
    });
};

/**
 * Recursively process all loops in the template and insert the relevant data.
 * @param {String} template The template to insert data into.
 * @param {String} [dataPrefix] Optional string to discard from the template
 *      directives.
 * @param {Object|String} data The data to insert into the template.
 * @returns {String}
 */
const processLoop = (template, dataPrefix, data) => {
    const loopMatch = LOOP_PATTERN.exec(template);
    if (!loopMatch) {
        return fillData(template, data, dataPrefix);
    }

    const [match, loopKey, dataKeyRaw, loopTemplate] = loopMatch;
    const dataKey = dataKeyRaw.replace(dataPrefix, '');

    const loopData = data[dataKey];

    let processedLoop = '';
    if (Array.isArray(loopData)) {
        const newDataPrefix = loopKey + '.';
        const boundProcessLoop = processLoop.bind(null, loopTemplate, newDataPrefix);
        processedLoop = loopData.map(boundProcessLoop).join('').trim();
    }

    const processedTemplate = template.replace(match, processedLoop);

    return fillData(processedTemplate, data, dataPrefix);
};


/**
 * Inserts the relevant data into a template string.
 * @param {String} template The template to insert data into.
 * @param {Object} data Data to insert into the template.
 * @returns {String}
 */
export const processTemplate = (template, data) => {
    return processLoop(template, '', data);
};

