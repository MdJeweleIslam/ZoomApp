const socket = io('/')


const videGrid = document.getElementById('video-grid')

const MyPeer = new Peer(undefined, {
	host: '/',
	port: '3001'
})

const Myvideo = document.createElement('video')
Myvideo.muted = true;

const peers = {}

navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true
}).then(stream => {
	addVideoStream(Myvideo, stream)

	MyPeer.on('call', () => {
		call.answer(stream)
		const video = document.createElement('vedio')
		call.on('stream', userVideoStream => {
			addVideoStream(video, userVideoStream)
		})
	})

	MyPeer.on('call', call => {
		call.answer(stream)
		const video = document.createElement('video')

		call.on('stream', userVideoStream => {
			addVideoStream(video, userVideoStream)
		})
	})

	socket.on('user-connected', userId => {
		connectToNewUser(userId, stream)
	})
})

socket.on('user-disconnected', userId => {
	if(peers[userId]) peers[userId].close()
})


MyPeer.on('open', id => {
	socket.emit('join-room', ROOM_ID, id)
})

socket.on('user-connected', userId => {
	console.log('User Connected: ' + userId)
})

socket.on('user-disconnected', userId => {
	console.log(userId)
})

function addVideoStream(video, stream){
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play()
	})
	videGrid.append(video)
}

function connectToNewUser(userId, stream){
	const call = MyPeer.call(userId, stream)
	const video = document.createElement('video')
	call.on('stream', userVideoStream => {
		addVideoStream(video, userVideoStream)
	})
	call.on('close', () => {
		video.remove()
	})

	peers[userId] = call
}