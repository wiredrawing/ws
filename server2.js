

// socket.ioを使ったwebsocket


const http = require("http");
let port = 8080;
let host = "test.websocket"

// 通常のhttpサーバー
const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end("<h1>Completed making server.</h1>");
  return true;
});
server.listen(port, host);

const sio = require("socket.io");
let io = sio(server, {
  cors: {
    // 稼働中のホストからの接続を許可
    origin: "http://localhost:3000",
    methods: ["GET", "POST",]
  }
});
console.log(server.constructor.name);
console.log(io.constructor.name);

io.on("connection", ( client ) => {
  // client => Socketクラスのオブジェクト
  console.log("クライアントID:" + client.id);


  // クライアントからのメッセージを受信時
  client.on("message", (message) => {
    let res = "クライアントID:" + client.id + "からメッセージを受信 =>" + message;
    client.broadcast.emit("message", {message: res})
  });


  // socket.ioモジュールを用いた場合のソケット切断
  client.on("disconnect", (e) => {
    console.log(e);
  });

});

