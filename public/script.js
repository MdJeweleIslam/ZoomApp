const socket = io('/')


const videGrid = document.getElementById('video-grid')

const MyPeer = new Peer(undefined, {
	host: '/',
	port: '3001'
})

const Myvideo = document.createElement('video')
Myvideo.muted = true;


navigator.mediaDevices.getUserMedia({
	video = true,
	audio = true,
}).then(stream => {
	addVideoStream(Myvideo, stream)
})


MyPeer.on('open', id => {
	socket.emit('join-room', ROOM_ID, id)
})

socket.on('user-connected', userId => {
	console.log('User Connected: ' + userId)
})

function addVideoStream(video, stream){
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play()
		videGrid.append(video)
	})
}