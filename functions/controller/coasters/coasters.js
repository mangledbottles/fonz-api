'use strict';

exports.getAllCoasters = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const coastersRequest = await global.CoastersDB
                .where('userId', '==', global.userId)
                .get();
            let coasters = []
            coastersRequest.forEach((c) => {
                coasters.push(c.data())
            });
            resolve(coasters);
        } catch (error) {
            reject(error);
        }
    });

}

/* Explicity for getting ANY coaster, ownership is not implied */
exports.getUserCoaster = (coasterId) => {
    return new Promise(async (resolve, reject) => {
        const coaster = await global.CoastersDB
            .doc(coasterId)
            .get();
        if (!coaster.exists) return reject({
            status: 404,
            message: 'This coaster does not exist.'
        });
        const {
            userId,
            active,
            paused,
            name
        } = coaster.data();

        if (userId == undefined) return reject({
            status: 204,
            message: 'This coaster is not in use.'
        });
        resolve({
            name,
            paused,
            active,
            userId
        });
    });
}

/* Explicity for getting a coaster that the requesting user should own */
exports.getCoaster = (coasterId) => {
    return new Promise(async (resolve, reject) => {
        const coaster = await global.CoastersDB
            .doc(coasterId)
            .get();
        if (!coaster.exists) return reject({
            status: 404,
            message: 'This coaster does not exist.'
        });
        const {
            userId,
            active,
            paused,
            name
        } = coaster.data();
        if (userId !== global.userId && userId !== undefined) {
            // TODO: Get hosts name who currently is connected to coaster
            // const user = await global.Use
            return reject({
                status: 404,
                message: `This coaster '${name}' is linked to a different Fonz account`
            });
        }
        if (userId == undefined) return resolve({
            status: 204,
            message: 'This coaster is not assigned to any Fonz account.'
        });
        resolve({
            name,
            paused,
            active,
            userId
        });
    })
}

// create
// update
// delete
// read

// new endpoint to help error checking.
// should all of them be status 404 or can we do differnt numbers? 
// exports.checkCoaster = (coasterId) => {
//     return new Promise(async (resolve, reject) => {
//         const coaster = await global.CoastersDB
//             .doc(coasterId)
//             .get();
//         if (!coaster.exists) return reject({
//             status: 404,
//             message: 'This coaster is not licensed with Fonz Music.'
//         });
//         const {
//             userId,
//             active,
//             paused,
//             name
//         } = coaster.data();
//         console.log({ userId, globalUserId: global.userId})
//         if (userId !== global.userId && userId !== null) return reject({
// // can we get the NAME of the userID? 
// // can we get the NAME of the coaster?
//             // we can do:
// // 'this is Jay Cowan's coaster named Philip" (i can build a notification into this in the future
//             status: 404,
//             message: 'This coaster is linked to a different Fonz account.'
//         });
//          if (userId == global.userId && userId !== null) return reject({
//              // can we get the NAME of the coaster?
//             // we can do:
// // 'this coaster is already linked to your account and named Philip" (i can build a notification into this in the future
//             status: 404,
//             message: 'This coaster is already linked to your account.'
//         });
//         resolve({
//             name,
//             paused,
//             active,
//             userId
//         });
//     })
// }

exports.addCoasterToAccount = (coasterId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const coaster = await global.CoastersDB
                .doc(coasterId)
                .get();
            if (!coaster.exists) return reject({
                status: 404,
                message: 'This coaster does not exist.'
            });
            const {
                userId,
                active,
                paused,
                name
            } = coaster.data();
            console.log({
                userId
            })
            if ((userId !== global.userId) && (userId !== undefined)) return reject({
                status: 404,
                message: 'This coaster is already linked to a different Fonz account. That account must disconnect that coaster before you can add it to your account.'
            });
            if (userId == global.userId) return reject({
                status: 403,
                message: 'This coaster is already linked to your account.'
            })
            if (userId == null) {
                const linkCoaster = await global.CoastersDB.doc(coasterId).update({
                    userId: global.userId,
                    paused: false,
                    active: true,
                    name: ''
                })
                resolve({
                    message: `Coaster has been linked to your account.`
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

exports.updateCoaster = (coasterId, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                name,
                active,
                paused
            } = params;
            if (name || active || paused) {
                const coasterData = await this.getCoaster(coasterId);
                if (coasterData.userId !== global.userId) return reject({
                    status: 404,
                    message: 'This coaster is not linked to this Fonz account.'
                });
                await global.CoastersDB
                    .doc(coasterId)
                    .update({
                        name: ((name == undefined) ? coasterData.name : name),
                        active: ((active == undefined) ? coasterData.active : active),
                        paused: ((paused == undefined) ? coasterData.paused : paused)
                    });
                resolve({
                    name,
                    active,
                    paused
                })
            } else {
                reject({
                    status: 400,
                    message: 'No valid parameters have been passed.'
                })
            }
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

exports.removeCoaster = (coasterId) => {
    return new Promise(async (resolve, reject) => {
        const coasterData = await this.getCoaster(coasterId);
        const FieldValue = global.admin.firestore.FieldValue;
        if (coasterData.userId !== global.userId) return reject({
            status: 404,
            message: 'This coaster is not linked to this Fonz account.'
        });
        await global.CoastersDB
            .doc(coasterId)
            .update({
                // admin.firestore.FieldValue;
                // FieldValue.delete()
                userId: global.admin.firestore.FieldValue.delete(),
                active: false,
                paused: false
            });
        resolve({
            message: 'Coaster removed from Fonz account.'
        })
    })
}