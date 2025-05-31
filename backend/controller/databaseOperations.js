const { db } = require("../utils/firebase.js")
const { ref, get, remove, set, update, runTransaction } = require("firebase/database");

const getResult = async (seatNo, placeOfBirth, userAgent = null) => {

    let response, data, status;
    const logRef = ref(db, `logs/check/${seatNo.toUpperCase()}`)

    if((!seatNo.toUpperCase().includes("VM8002") && !seatNo.toUpperCase().includes("VM000"))  || !(placeOfBirth.toUpperCase() === "EARTH")){
            status = 400;
            await set(logRef, {seatNo: seatNo, placeOfBirth: placeOfBirth, ip: userAgent});
            return {success: false, msg: "Invalid data", status};
    } else {
        try{ 

            const today = new Date();
            const snapshot = await get(ref(db, `results/${seatNo.toUpperCase()}`));

            if(snapshot.exists()) {
                const checkRef = ref(db, "stats/resultVisitsCount")

                await runTransaction(checkRef, (currentCount) => {
                    return (currentCount || 0 ) + 1;
                });

                data = snapshot.val();
                let userLog = {Name: data.Name, date: today.toString(), ip: userAgent}
                const logResponse = await set(logRef, userLog);
                status = 200;
                response = {success: true, data, status};
            }
            else {
                let userLog = {seatNo, placeOfBirth, date: today.toString(), ip: userAgent}
                await set(logRef, userLog);
                data = null;
                status = 200;
                response = {success: false, msg: "No result found for that Seat No", status};
            }

        } catch(err) {
            response = {success: false, msg: err, status}
            status = 500;
        }
    }
    return response;
    
}


const postResult = async (candidate) => {

    let response, data, status;
    try{
        const seatRef = ref(db, `results/${candidate.SeatNo}`);
        await set(seatRef, candidate);
        response = {success: true, data: {SeatNo: candidate.SeatNo, Name: candidate.Name}};
    } catch (err){
        response = {success: false, msg: err};
    }
    return response;
    
}

const getAllResults = async () => {
    try{
    const snapshot = await get(ref(db, `results/`));
    if(snapshot.exists()){
        const data = snapshot.val();
        return {success: true, data: data}
    } else return {success: false, msg: "Data not found"};
    } catch(err) {
        return {success: false, msg: err};
    }
}

const getViews = async () => {
    try{
        const viewRef = ref(db, "stats/resultVisitsCount");
        const snapshot = await get(viewRef);
        if(snapshot.exists()) return {success: true, data: snapshot.val()};
        else return {success: false, msg: "Data not found"};
    } catch (err) {
        return {success: false, msg: err}
    }
}

const getShares = async () => {
    try{
        const socialRef = ref(db, "stats/socialShareCount");
        snapshot = await get(socialRef);
        if(snapshot.exists()){
            response = {success: true, data: snapshot.val()};
        } else response = {success: failed, msg: "Social counter not found1"};
    } catch(err){
        response = {success: failed, msg: err}
    }
    return response;
}

const socialShares = async () => {
    try{

        const socialRef = ref(db, "stats/socialShareCount");

        await runTransaction(socialRef, (currentCount) => {
            return (currentCount || 0 ) + 1;
        });

        return {success: true, msg: "Post shared!"};
        } catch(err) {
            return {success: false, msg: err.message} ;
        }
}

const registerView = async () => {

    try{

        const counterRef = ref(db, "stats/visitorCount");

        await runTransaction(counterRef, (currentCount) => {
            return (currentCount || 0 ) + 1;
        });

        return {success: true, msg: "Visitor count incremented"};
        } catch(err) {
            return {success: false, msg: err.message} ;
        }
    }

const registerMassEntry = async () => {

    try{

        const counterRef = ref(db, "stats/recordPushCount");

        await runTransaction(counterRef, (currentCount) => {
            return (currentCount || 0 ) + 1;
        });

        return {success: true, msg: "Push count incremented"};
        } catch(err) {
            return {success: false, msg: err.message} ;
        }
    }

const removeResult = async (seatNo, userAgent = null) => {
    let response;
    if((seatNo.toUpperCase().includes("VM8002") || seatNo.toUpperCase().includes("VM000"))){
        const entryRef = ref(db, "results/" + seatNo);
        const today = new Date();
        const logRef = ref(db, `logs/deletion/${seatNo}`);

        const snapshot = await get(entryRef);
        
        
        if(snapshot){
         deletedUser = snapshot.val();
         const deletionLog = {Name: deletedUser.Name, Date: today.toString(), ip: userAgent};
         await set(logRef, deletionLog);
         await remove(entryRef)
         response = {success: true, status: 200, msg: "bye bye bro"};
        } else {
            response = {success: true, status: 200, msg: "No seat no found"};
        }
    } else {
        response = { success: false, status: 400, msg: "Invalid seat no" };
    }

    return response;
}

module.exports = {getResult, postResult, removeResult, getAllResults, registerView, getViews, socialShares, getShares, registerMassEntry}
