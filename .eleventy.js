// Fichier : .eleventy.js
module.exports = function(eleventyConfig) {
  // Indique à Eleventy de copier les dossiers css, js, et img
  // dans le site final.
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("img");
  
  return {
    dir: {
      input: "src",      // Les fichiers sources sont dans un dossier "src"
      output: "_site",   // Le site final sera généré dans "_site"
      includes: "_includes" // Les morceaux réutilisables sont dans "src/_includes"
    }
  };
};