// wsモジュールをつかったwebsocket

let WebSocket = require("ws");

let uuid = require("node-uuid");
let http = require("http");
let port = 8080;
let host = "test.websocket";

try {

  // ベースとなるhttpサーバーを作成
  let httpServer = http.createServer((req,res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end("<h1>Completed making server.</h1>");
    return true;
  });

  // websocketをhttpサーバーに組み込み
  // console.log(WebSocket);
  let ws = new WebSocket.Server({
    server:httpServer
  });
  // console.log(ws.constructor.name);


  // クライアントリスト
  let clientSockets = [];

  ws.on("connection", (socket, request, other) => {
    // console.log(ws.url);
    // console.log(request.url);
    console.log(socket.constructor.name);
    console.log(request.constructor.name);
    // コネクションイベントが発生するたびに､クライアントリストをスタックする
    let id = uuid.v4();
    console.log(id);
    socket.uuid = id;

    clientSockets.push({
      uuid: uuid,
      socket: socket
    });
    console.log("uuid:" + socket.uuid + "が接続しました");

    socket.on("message", (message) => {
      try {
        if (message.length > 4096) {
          socket.send("送信データがおおきすぎます");
          return true;
        }
        console.log(message);
        ws.clients.forEach(socket => {
          socket.send("クライアント"+ socket.uuid + "が発言: => " + message);
        })
        // clientSockets.forEach((obj, index) => {
        //   if (obj.socket.uuid !== socket.uuid) {
        //     obj.socket.send("クライアント"+ socket.uuid + "が発言: => " + message);
        //   }
        // });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("close", (e) => {
      try {
        console.log("uuid:" + socket.uuid + "が切断されました");
        clientSockets = clientSockets.filter((data) => {
          if (data.uuid !== socket.uuid) {
            data.socket.send("クライアントuuid:" + socket.uuid　+ "が切断されました");
            return true;
          }
        })
      } catch (error) {
        console.log(error);
      }
    });
  });


  httpServer.listen(port, host);
} catch (error) {
  console.log(error);
}


