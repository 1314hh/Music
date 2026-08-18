/*
 * 网易云音乐每日签到
 *
 * 每天由 Loon cron 自动执行
 */

const STORE_KEY = "NeteaseMusicCookie";

const cookie = $persistentStore.read(STORE_KEY);

if (!cookie) {
  $notification.post(
    "网易云音乐签到",
    "签到失败",
    "没有找到 Cookie，请打开网易云音乐并登录"
  );

  $done();
  return;
}

const url = "https://music.163.com/api/daily_signin?type=0";

const options = {
  url: url,
  headers: {
    "Cookie": cookie,
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)"
  }
};

$httpClient.post(options, function(error, response, data) {

  if (error) {
    console.log("网易云签到请求失败：" + error);

    $notification.post(
      "网易云音乐签到",
      "请求失败",
      String(error)
    );

    $done();
    return;
  }

  let result;

  try {
    result = JSON.parse(data);
  } catch (e) {

    console.log("网易云返回内容：" + data);

    $notification.post(
      "网易云音乐签到",
      "签到失败",
      "网易云返回的数据无法解析"
    );

    $done();
    return;
  }

  console.log("网易云签到返回：" + JSON.stringify(result));

  if (result.code === 200) {

    $notification.post(
      "网易云音乐签到",
      "签到成功",
      result.message || "今日签到完成"
    );

  } else {

    $notification.post(
      "网易云音乐签到",
      "签到结果",
      result.message ||
      result.msg ||
      ("返回 Code：" + result.code)
    );
  }

  $done();
});
