/* Recarra — save/look up without blocking the confirmation page. */
window.RECARRA_SITE = "https://recarra.com";
window.RECARRA_CLOUD = ["/api/offer"];

function recarraFetch(url, opts) {
  var ctrl = new AbortController();
  var t = setTimeout(function () { ctrl.abort(); }, 2500);
  return fetch(url, Object.assign({ signal: ctrl.signal }, opts || {})).finally(function () {
    clearTimeout(t);
  });
}

window.recarraSaveOffer = function (lead) {
  return recarraFetch(window.RECARRA_CLOUD[0], {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(lead),
  }).catch(function () { return null; });
};

window.recarraFindOffer = function (q) {
  q = String(q || "").trim();
  if (!q) return Promise.resolve(null);
  return recarraFetch(window.RECARRA_CLOUD[0] + "?q=" + encodeURIComponent(q))
    .then(function (res) { return res.ok ? res.json() : null; })
    .catch(function () { return null; });
};
