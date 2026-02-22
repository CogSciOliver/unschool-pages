module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("bundle.css");
	eleventyConfig.addPassthroughCopy("assets");
	return {
		dir: {
			input: ".",
			includes: "_includes",
			output: "_site",
		},
	};
};
