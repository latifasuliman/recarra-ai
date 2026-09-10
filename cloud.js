/* Recarra — one book. recarra.com, www, and github.io post/look up here. */
window.RECARRA_SITE = "https://recarra.com";
window.RECARRA_CLOUD = [
  "/api/offer",
  "https://hds-ai4xrnqwtej4-6014-lm503.grok-code-wild.hades-www.grok-sandbox.com/api/offer",
];
window.recarraSaveOffer = function (lead) {
  return Promise.allSettled(
    window.RECARRA_CLOUD.map(function (url) {
      return fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
    }),
  );
};
window.recarraFindOffer = function (q) {
  q = String(q || "").trim();
  if (!q) return Promise.resolve(null);
  return (function next(i) {
    if (i >= window.RECARRA_CLOUD.length) return Promise.resolve(null);
    return fetch(window.RECARRA_CLOUD[i] + "?q=" + encodeURIComponent(q))
      .then(function (res) {
        if (!res.ok) return next(i + 1);
        return res.json();
      })
      .catch(function () {
        return next(i + 1);
      });
  })(0);
};
