const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: ["auto"],
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
    return [...map.entries()].map(([slug, items]) => ({ slug, items }));
  });

  eleventyConfig.addFilter("whereSection", function (items, section) {
    return (items || []).filter((item) => item.data.section === section);
  });

  eleventyConfig.addFilter("excludePage", function (items, url) {
    return (items || []).filter((item) => item.url !== url);
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
