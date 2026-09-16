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

  eleventyConfig.addPassthroughCopy({ assets: "assets" });

  /**
   * Normalize an Eleventy content item's source path.
   */
  const getInputPath = (item) => {
    return (
      item?.inputPath ||
      item?.page?.inputPath ||
      ""
    )
      .replaceAll("\\", "/")
      .replace(/^\.\//, "");
  };

  /**
   * Section landing pages are never publishable content items.
   */
  const isSectionIndex = (item) => {
    return getInputPath(item).endsWith("/index.md");
  };

  /**
   * Resolve section membership strictly from the first directory
   * underneath content/.
   *
   * Examples:
   *
   * content/stories/tims-day.md
   * -> stories
   *
   * content/rabbit-holes/example.md
   * -> rabbit-holes
   *
   * content/bonus/transcript.md
   * -> bonus
   */
  const getContentDirectory = (item) => {
    const inputPath = getInputPath(item);

    if (!inputPath) {
      return "";
    }

    const marker = "content/";
    const markerIndex = inputPath.indexOf(marker);

    if (markerIndex === -1) {
      return "";
    }

    const relativePath = inputPath.slice(
      markerIndex + marker.length
    );

    return relativePath.split("/")[0] || "";
  };

  /**
   * Canonical universe of publishable Markdown content.
   *
   * Directory index pages still build normally, but they cannot
   * appear as article cards, topic-hub items, or bonus items.
   */
  const getPublishableItems = (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("content/**/*.md")
      .filter((item) => !isSectionIndex(item));
  };

  /**
   * All publishable Markdown content.
   *
   * Keep nav_order as the general collection ordering. Individual
   * section indexes may apply their own date or nav sorting through
   * the inDirectory filter.
   */
  eleventyConfig.addCollection(
    "published",
    function (collectionApi) {
      return getPublishableItems(collectionApi)
        .sort((a, b) => {
          const ao = a.data.nav_order ?? 999;
          const bo = b.data.nav_order ?? 999;

          return ao - bo;
        });
    }
  );

  /**
   * Cross-sectional discovery hubs.
   *
   * topic_hubs is independent from section membership and format.
   * /topics/ is a primary discovery surface.
   */
  eleventyConfig.addCollection(
    "topicHubs",
    function (collectionApi) {
      const all = getPublishableItems(collectionApi);
      const map = new Map();

      for (const item of all) {
        const tags = (
          item.data.topic_hubs || []
        ).filter(Boolean);

        for (const tag of tags) {
          if (!map.has(tag)) {
            map.set(tag, []);
          }

          map.get(tag).push(item);
        }
      }

      return [...map.entries()].map(
        ([slug, items]) => ({
          slug,
          items: items.sort((a, b) => {
            const aPriority =
              a.data.hub_priority ?? 999;

            const bPriority =
              b.data.hub_priority ?? 999;

            if (aPriority !== bPriority) {
              return aPriority - bPriority;
            }

            return (
              a.data.title || ""
            ).localeCompare(
              b.data.title || ""
            );
          })
        })
      );
    }
  );

  /**
   * Independent reusable bonus content.
   *
   * The bonus index itself is excluded because all index.md files
   * are excluded from the publishable universe.
   */
  eleventyConfig.addCollection(
    "bonusContent",
    function (collectionApi) {
      return getPublishableItems(collectionApi)
        .filter(
          (item) =>
            getContentDirectory(item) === "bonus"
        );
    }
  );

  /**
   * Expose the canonical source-directory section to Nunjucks.
   *
   * Usage:
   *
   * {% set currentSection = page | contentSection %}
   */
  eleventyConfig.addFilter(
    "contentSection",
    function (item) {
      return getContentDirectory(item);
    }
  );

  /**
   * Return publishable siblings from one source directory.
   *
   * Directory membership is authoritative.
   * Frontmatter does not determine section membership.
   *
   * sortMode:
   * - "date" = newest first
   * - "nav"  = nav_order ascending
   */
  eleventyConfig.addFilter(
    "inDirectory",
    function (
      items,
      directory,
      currentUrl = null,
      sortMode = "date"
    ) {
      if (!directory) {
        return [];
      }

      const filtered = (items || []).filter(
        (item) => {
          const sameDirectory =
            getContentDirectory(item) === directory;

          const notIndex =
            !isSectionIndex(item);

          const notCurrent =
            !currentUrl ||
            item.url !== currentUrl;

          return (
            sameDirectory &&
            notIndex &&
            notCurrent
          );
        }
      );

      if (sortMode === "nav") {
        return filtered.sort(
          (a, b) =>
            (a.data.nav_order ?? 999) -
            (b.data.nav_order ?? 999)
        );
      }

      return filtered.sort(
        (a, b) =>
          new Date(b.date || 0) -
          new Date(a.date || 0)
      );
    }
  );

  /**
   * Convert canonical directory IDs into reader-facing labels.
   *
   * This controls presentation only.
   * It does not determine section membership.
   */
  eleventyConfig.addFilter(
    "sectionLabel",
    function (section) {
      if (!section) {
        return "";
      }

      const labels = {
        "start-here": "Start Here",
        "unschooling": "Unschooling",
        "deschooling-lab": "Deschooling Lab",
        "stories": "Stories",
        "rabbit-holes": "Rabbit Holes",
        "books": "Books",
        "unschooling-pta": "Unschooling PTA",
        "creator-danii-oliver": "Danii Oliver",
        "bonus": "Bonus Content",
        "unschooling-in-mess": "Unschooling in the Mess"
      };

      if (labels[section]) {
        return labels[section];
      }

      return section
        .replaceAll("-", " ")
        .replace(
          /\b\w/g,
          (letter) => letter.toUpperCase()
        );
    }
  );

  /**
   * Resolve one reusable bonus selected by a parent article.
   *
   * Parent article:
   *
   * bonus: financial-critical-thinking-exercise
   *
   * Bonus source:
   *
   * content/bonus/financial-critical-thinking-exercise.md
   *
   * The bonus itself does not point back to its parent.
   * Multiple articles may select the same bonus.
   */
  eleventyConfig.addFilter(
    "bonusFor",
    function (items, bonusSlug) {
      if (!bonusSlug) {
        return null;
      }

      const slug = String(
        bonusSlug
      ).trim();

      if (!slug) {
        return null;
      }

      return (
        (items || []).find((item) => {
          if (
            getContentDirectory(item) !== "bonus"
          ) {
            return false;
          }

          if (isSectionIndex(item)) {
            return false;
          }

          const inputPath =
            getInputPath(item);

          const filenameMatch =
            inputPath.endsWith(
              `/bonus/${slug}.md`
            );

          const fileSlugMatch =
            item.fileSlug === slug;

          return (
            filenameMatch ||
            fileSlugMatch
          );
        }) || null
      );
    }
  );

  /**
   * General utility for excluding one rendered page.
   *
   * This is not section-classification logic and remains available
   * for templates that need it.
   */
  eleventyConfig.addFilter(
    "excludePage",
    function (items, url) {
      return (items || []).filter(
        (item) => item.url !== url
      );
    }
  );

  /**
   * External link shortcode.
   */
  eleventyConfig.addShortcode(
    "ext",
    (text, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" data-source="rabbit-holes">${text}</a>`;
    }
  );

  /**
   * Anchor shortcode.
   */
  eleventyConfig.addShortcode(
    "anchor",
    (id) => {
      return `<a class="anchor" id="${id}"></a>`;
    }
  );

  /**
   * Internal jump-link shortcode.
   */
  eleventyConfig.addShortcode(
    "jump",
    (text, id) => {
      return `<a href="#${id}" data-source="rabbit-holes">${text}</a>`;
    }
  );

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
