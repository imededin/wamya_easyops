const { Readable } = require("stream");
const Jenkins = require("jenkins");

const jenkinsUrl =
  process.env.JENKINS_URL || "http://jenkins:123456@127.0.0.1:8080";
const jenkins = new Jenkins({
  baseUrl: jenkinsUrl,
});

function updateView(req, res) {
  const params = new URLSearchParams(req.url.split("?")[1]);
  const buildNum = params.get("buildNumber");

  console.log(buildNum);
  const logStream = jenkins.build.logStream("easyops-update", buildNum);

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Transfer-Encoding": "chunked",
    Connection: "keep-alive",
  });

  logStream.on("data", (chunk) => {
    res.write(chunk);
  });

  logStream.on("end", () => {
    res.end();
  });

  logStream.on("error", (err) => {
    console.error(err);
    res.end("Error occurred while streaming log.");
  });
}
exports.updateView = updateView;
