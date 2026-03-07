
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

const STRUCTURAL_TAGS = new Set([
  "all",
  "nav",
  "post",
  "page",
  "featured",
  "start-here",
  "unschooling-basics",
  "deschooling-lab",
  "stories",
  "rabbit-holes",
  "books",
  "unschooling-pta",
  "community"
]);

function byNavOrder(a, b) {
  const aOrder = a.data.nav_order ?? 999;
  const bOrder = b.data.nav_order ?? 999;
  if (aOrder !== bOrder) return aOrder - bOrder;
  return (a.data.title || "").localeCompare(b.data.title || "");
}

module.exports = function(eleventyConfig) {
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
  eleventyConfig.addWatchTarget("assets/css/");
  eleventyConfig.addWatchTarget("assets/js/");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("whereSection", (items = [], section) =>
    items.filter(item => item.data.section === section).sort(byNavOrder)
  );

  eleventyConfig.addFilter("primaryTopic", (tags = []) => {
    if (!Array.isArray(tags)) return null;
    return tags.find(tag => !STRUCTURAL_TAGS.has(tag));
  });

  eleventyConfig.addFilter("readableSection", (value = "") => value.replace(/-/g, " "));

  eleventyConfig.addCollection("posts", collectionApi =>
    collectionApi.getFilteredByTag("post").sort(byNavOrder)
  );

  eleventyConfig.addCollection("featuredPosts", collectionApi =>
    collectionApi.getFilteredByTag("featured").sort(byNavOrder)
  );

  eleventyConfig.addCollection("topicHubs", collectionApi => {
    const counts = new Map();
    for (const item of collectionApi.getFilteredByTag("post")) {
      for (const tag of item.data.tags || []) {
        if (STRUCTURAL_TAGS.has(tag)) continue;
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }

    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([slug, count]) => ({
        slug,
        title: slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        count
      }));
  });

  eleventyConfig.addCollection("postsByTopic", collectionApi => {
    const map = new Map();
    for (const item of collectionApi.getFilteredByTag("post")) {
      for (const tag of item.data.tags || []) {
        if (STRUCTURAL_TAGS.has(tag)) continue;
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag).push(item);
      }
    }
    for (const [tag, items] of map.entries()) {
      map.set(tag, items.sort(byNavOrder));
    }
    return map;
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
