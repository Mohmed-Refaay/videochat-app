const socket = io("/");

const videoArea = document.getElementById("videos-container");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
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

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

peer.on("call", (call) => {
  console.log("calling");
  call.answer(myVedioStream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
});

socket.on("user-joined", (userId) => {
  conneToNewUser(userId, myVedioStream);
});

const conneToNewUser = (id, stream) => {
  var call = peer.call(id, stream);
  const video = document.createElement("video");
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
