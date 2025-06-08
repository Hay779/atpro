// Fichier : .eleventy.js

module.exports = function(eleventyConfig) {
  // Copie des assets statiques
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("services");

  // === LA LIGNE À AJOUTER EST ICI ===
  // On dit à Eleventy de copier le dossier "admin" qui contient
  // index.html et config.yml.
  eleventyConfig.addPassthroughCopy("src/admin");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};