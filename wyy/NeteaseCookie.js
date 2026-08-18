/*
 * 网易云音乐 Loon 自动抓 Cookie
 *
 * 作用：
 * 1. 监听网易云音乐 HTTPS 请求
 * 2. 找到包含 MUSIC_U 的 Cookie
 * 3. 保存到 Loon persistentStore
 *
 * 不会把 Cookie 上传到 GitHub
 */

const STORE_KEY = "NeteaseMusicCookie";

const headers = $request.headers || {};

let cookie = headers["Cookie"] || headers["cookie"] || "";

if (!cookie) {
  console.log("网易云：本次请求没有 Cookie");
  $done({});
  return;
}

// 网易云登录态最重要的标识之一
if (!cookie.includes("MUSIC_U=")) {
  console.log("网易云：本次 Cookie 不包含 MUSIC_U");
  $done({});
  return;
}

// 清理一下 Cookie 格式
cookie = cookie
  .split(";")
  .map(item => item.trim())
  .filter(Boolean)
  .join("; ");

$persistentStore.write(cookie, STORE_KEY);

console.log("网易云音乐 Cookie 获取成功");

$notification.post(
  "网易云音乐",
  "Cookie 获取成功",
  "登录态已保存，可以自动签到"
);

$done({});
