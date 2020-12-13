

const socket = io("/");

const videoArea = document.getElementById("videos-container");
const myVideo = document.createElement("video");
myVideo.muted = true;


var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030"
})

let myVedioStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVedioStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", call => {
      call.answer(stream)
      const video = document.createElement("video");
      call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on("user-joined", (userId) => {
      conneToNewUser(userId, stream);
    });
  });


peer.on("open" , (id) => {
  socket.emit("join-room", ROOM_ID, id);
})




const conneToNewUser = (id, stream) => {
  const call = peer.call(id, stream)
  const video = document.createElement("video");
  call.on("stream", userVideoStream => {
    console.log("streaming")
    addVideoStream(video, userVideoStream)
  })
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoArea.append(video);
};
