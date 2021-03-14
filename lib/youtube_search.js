const ytsr = require('ytsr')

const default_options = {limit: 10, selector: async items => 0}

async function search_result(query, options = default_options) {
    options = {...default_options, ...options};

    console.log("waiting for search...");
    const search = await ytsr(query, { limit: options.limit });
    console.log("search done.")
    const results = search.items;
    
    const id = await options.selector(results)
    if (id >= results.length)
        throw "indexOutOfRange: search_result function";
    
    return results[id];
}

module.exports = search_result;