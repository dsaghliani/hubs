AFRAME.registerComponent("disable-spawn-sfx", {});
AFRAME.registerComponent("custom-screen", {});
// AFRAME.registerComponent("screen-ownership-handler", {
//     schema: {
//         screenId: { type: 'string' }
//     },

//     init() {
//         this.dataType = 'screenIdToTakeOwnershipOf';

//         NAF.connection.subscribeToDataChannel(this.dataType, screenId => {
//             const screen = document.querySelector(`#${screenId}`);

//             NAF.utils.getNetworkedEntity(screen).then(netScreen => {
//                 NAF.utils.takeOwnership(netScreen);
//                 this.data.screenId = screenId;
//             });
//         });
//     },

//     remove() {
//         const screenId = this.data.screenId;
//         if (screenId == '')
//             return;

//         const screen = document.querySelector(`#${screenId}`);

//         NAF.utils.getNetworkedEntity(screen).then(netScreen => {
//             if (!NAF.utils.isMine(netScreen))
//                 return;

//             const otherUsers = NAF.connection.getConnectedClients();

//             if (Object.keys(otherUsers).length > 0) {
//                 NAF.connection.sendDataGuaranteed(otherUsers[0].id, this.dataType, screenId);
//             }
//         });
//     }
// });
AFRAME.registerComponent("contains-screen", {
    schema: {
        screenId: { default: -1 }
    }
});