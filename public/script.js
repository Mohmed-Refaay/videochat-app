const socket = io("/");
var userName = prompt("what is your name?");
const videoArea = document.getElementById("videos-container");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

let myVedioStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    myVedioStream = stream;
    addVideoStream(myVideo, stream);
  });

peer.on("call", (call) => {
  call.answer(myVedioStream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
});

peer.on("close", () => {
  console.log("call ended");
});

socket.on("user-joined", (userId) => {
  conneToNewUser(userId, myVedioStream);
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

peer.on("error", (err) => {
  console.log(err);
});

const conneToNewUser = (id, stream) => {
  const call = peer.call(id, stream);
  const video = document.createElement("video");

  console.log(call);
  call.on("stream", (userVideoStream) => {
    console.log("streaming");
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoArea.append(video);
};

const message = $("#chat_message");

$("html").keydown((e) => {
  if (e.which == 13 && message.val().length !== 0) {
    socket.emit("message", message.val());
    message.val("");
  }
});

socket.on("receive-message", (msg) => {
  $(".messages").append(
    `<li class="message"><b>${userName ? userName : "user"}</b></br>${msg}</li>`
  );

  const d = $(".main__chat_window")
  d.scrollTop(d.prop("scrollHeight"))
});
