AFRAME.registerComponent("disable-spawn-sfx", {});

AFRAME.registerComponent("custom-screen", {
    schema: {
        // An index of -1 might yet be chosen for some reason; -99999999 less so.
        screenIndex: { type: 'int', default: -999999999 }
    }
});

AFRAME.registerComponent("contains-screen", {
    schema: {
        screenId: { default: -1 }
    }
});

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