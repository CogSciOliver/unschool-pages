const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: [480, 768, 1024],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async"
      }
    }
  });

  eleventyConfig.addPassthroughCopy({ "assets": "assets" });

  eleventyConfig.addCollection("published", function (collectionApi) {
    return collectionApi.getFilteredByGlob("content/**/*.md").sort((a, b) => {
      const ao = a.data.nav_order || 999;
      const bo = b.data.nav_order || 999;
      return ao - bo;
    });
  });

  eleventyConfig.addCollection("topicHubs", function (collectionApi) {
    const all = collectionApi.getFilteredByGlob("content/**/*.md");
    const map = new Map();
    for (const item of all) {
      const tags = (item.data.topic_hubs || []).filter(Boolean);
      for (const tag of tags) {
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag).push(item);
      }
    }

    return [...map.entries()].map(([slug, items]) => ({
      slug,
      items: items.sort((a, b) => {
        const aPriority = a.data.hub_priority ?? 999;
        const bPriority = b.data.hub_priority ?? 999;

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        return (a.data.title || "").localeCompare(b.data.title || "");
      })
    }));
  });

  eleventyConfig.addFilter("whereSection", function (items, section) {
    return (items || []).filter((item) => item.data.section === section);
  });

  eleventyConfig.addFilter("excludePage", function (items, url) {
    return (items || []).filter((item) => item.url !== url);
  });

  eleventyConfig.addShortcode("ext", (text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" data-source="rabbit-holes">${text}</a>`;
  });

  eleventyConfig.addShortcode("anchor", (id) => {
    return `<a class="anchor" id="${id}"></a>`;
  });

  eleventyConfig.addShortcode("jump", (text, id) => {
    return `<a href="#${id}" data-source="rabbit-holes">${text}</a>`;

  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};

