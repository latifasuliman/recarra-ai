/* Recarra vault — offers stay on recarra.com in this Safari (IndexedDB + localStorage). */
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
  if (lead && lead.id) window.recarraVaultMerge(lead);
  return recarraFetch(window.RECARRA_CLOUD[0], {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(lead),
  }).catch(function () { return null; });
};

window.recarraFindOffer = function (q) {
  q = String(q || "").trim();
  if (!q) return Promise.resolve(null);
  return window.recarraVaultAll().then(function (rows) {
    var digits = q.replace(/\D/g, "");
    var upper = q.toUpperCase().replace(/\s+/g, "");
    var rc = upper.indexOf("RC") === 0 ? "RC-" + upper.replace(/^RC-?/, "") : upper;
    var hit = rows.filter(function (l) {
      var id = String(l.id || "").toUpperCase();
      var code = String(l.trackCode || "").toUpperCase();
      var phone = String(l.phone || "").replace(/\D/g, "");
      return id === rc || code === rc || (digits.length >= 10 && phone.slice(-10) === digits.slice(-10));
    })[0];
    if (hit) return hit;
    return recarraFetch(window.RECARRA_CLOUD[0] + "?q=" + encodeURIComponent(q))
      .then(function (res) { return res.ok ? res.json() : null; })
      .catch(function () { return null; });
  });
};

function vaultDb() {
  return new Promise(function (resolve, reject) {
    var req = indexedDB.open("recarra-vault", 1);
    req.onupgradeneeded = function () {
      var db = req.result;
      if (!db.objectStoreNames.contains("leads")) db.createObjectStore("leads", { keyPath: "id" });
    };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
}

window.recarraVaultAll = function () {
  return vaultDb().then(function (db) {
    return new Promise(function (resolve) {
      var tx = db.transaction("leads", "readonly");
      var req = tx.objectStore("leads").getAll();
      req.onsuccess = function () { resolve(req.result || []); };
      req.onerror = function () { resolve([]); };
    });
  }).catch(function () { return []; });
};

window.recarraVaultWrite = function (leads) {
  if (!Array.isArray(leads)) return Promise.resolve();
  return vaultDb().then(function (db) {
    var tx = db.transaction("leads", "readwrite");
    var store = tx.objectStore("leads");
    leads.forEach(function (lead) {
      if (lead && lead.id) store.put(lead);
    });
    return new Promise(function (resolve) {
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { resolve(); };
    });
  }).catch(function () {});
};

window.recarraVaultMerge = function (lead) {
  if (!lead || !lead.id) return Promise.resolve();
  try {
    var rows = JSON.parse(localStorage.getItem("recarra-leads-v1") || "[]");
    rows = rows.filter(function (l) { return l && l.id !== lead.id; });
    rows.unshift(lead);
    localStorage.setItem("recarra-leads-v1", JSON.stringify(rows));
  } catch (err) {}
  return window.recarraVaultWrite([lead]);
};
