// เปลี่ยนเลขเวอร์ชันทุกครั้งที่แก้ไฟล์ เพื่อให้เครื่องผู้ใช้โหลดของใหม่
const VERSION = "salap-sakun-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "vendor/pdf-lib.min.js", "vendor/jszip.min.js", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res && (res.ok || res.type === "opaque")) {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match("index.html")))
  );
});
