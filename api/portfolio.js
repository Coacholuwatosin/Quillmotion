const { PORTFOLIO } = require("./_data");

function shuffled(items) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

module.exports = (req, res) => {
  // No caching: the order is reshuffled on every request so the "first 6"
  // shown on the page isn't always the same clips.
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(shuffled(PORTFOLIO));
};
