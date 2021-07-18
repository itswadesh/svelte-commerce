<script>
let appID = 3268197896; // 请从官网控制台获取对应的appID
let server = 'wss://webliveroom-hk-test.zegocloud.com/ws'; // 请从官网控制台获取对应的server地址，否则可能登录失败

if (typeof window !== 'undefined') {
// const zg = new zego.ZegoExpressEngine(appID, server)

// zg.on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
//   if (state == 'DISCONNECTED') {
//     console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz')
//     // not yet connected or disconnected from the room
//   }

//   if (state == 'CONNECTING') {
//     console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz')
//     // connecting or reconnecting to the room
//   }

//   if (state == 'CONNECTED') {
//     console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz')
//     // connected or reconnected to the room
//   }
// })
}


</script>

<script context="module">
    import zego from 'zego-express-engine-webrtc'

</script>