var defaultInst = "KKW";
import { db } from "../helpers/firebase.js";
import { ref, push, set } from "firebase/database";

const DEPLOYED_BACKEND = import.meta.env.VITE_BACKEND_INSTANCE;

const subjectSheet = [
    {name: "Physical Ed.", totalTh: 80, totalPR: 20},
    {name: "Shystem Design", totalTh: 70, totalPR: 30},
    {name: `${defaultInst} Survival`, totalTh: 80, totalPR: 20},
    {name: "Bhojpuri", totalTh: 80, totalPR: 20},
    {name: "Brahmos Throw", totalTh: 90, totalPR: 10}
]

const searchResults = (fName, mName, lName, resultList) => {
  const fullName = `${lName} ${fName} ${mName}`.trim().replace(/\s+/g, " ");

  if (fullName.split(" ").length > 3) {
    return { duplicateVal: true, msg: "You can try next year." };
  }

  for (const [, result] of Object.entries(resultList)) {
    const resultName = result.Name?.toUpperCase() || "";
    if (fullName.toUpperCase() === resultName) {
      const parsedDate = result.examDate ? new Date(result.examDate) : null;
      const dateString = parsedDate
        ? `${String(parsedDate.getDate()).padStart(2, "0")}/${String(parsedDate.getMonth() + 1).padStart(2, "0")}`
        : "30/05";
      return {
        duplicateVal: true,
        msg: `You can try next year on ${dateString}`,
      };
    }
  }

  return { duplicateVal: false, msg: "" };
};

const pushRecord = async (record, institutionInitials = "KKW") => {

    const today = new Date().toISOString();
    record["examDate"] = today;
    const newSubjectName = institutionInitials.trim() + " " +"Survival";
    record.Subjects[2].subjectName = newSubjectName;
    let response;
    try{

        const resultResponse = await fetch(`${DEPLOYED_BACKEND}/api/postResult`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({resultList: [record]})
        }).then(response => response.json()).then(data => {return data});
        console.log(resultResponse)
        if(resultResponse.success){
            console.log("Published a result");
            response = { SeatNo: record.SeatNo, success: true }
        } else response = {
            success: false, 
            msg: resultResponse.msg
        };
    } catch (err) {
        response = {success: false, msg: err}
    }
    console.log(response);
    return response;
};


const changeDefaultInst = (instName) => defaultInst = instName;

const addNewCandidate = async (fName, mName, lName, instInitials, resultList, broadcastingSetter=null) => {
        if(fName === "" || fName === " " || 
           mName === "" || mName === " " || 
           lName === "" || lName === " " ||
           instInitials === "" || instInitials === " "){
            if(broadcastingSetter){ 
                broadcastingSetter("ERROR", "Data field are empty");
                return;
            } else return {success: false, msg: "Field empty"}
        }
        else if(instInitials.length > 8){
             if(broadcastingSetter){ 
                broadcastingSetter("ERROR", "Institute initials not name.");
                return;
            } else return {success: false}
        }
        
        const duplicationCheck = searchResults(fName, mName, lName, resultList);
        console.log(duplicationCheck);

        if(duplicationCheck.duplicateVal){
            if(broadcastingSetter) broadcastingSetter("REATTEMPT", duplicationCheck.msg);
            return {success: false, msg: "Duplicate name"};
        } else {
            const producedCandidate = createNewCandidate(resultList, fName, mName, lName);
            const pushResult = await pushRecord(producedCandidate, instInitials);
            if(broadcastingSetter){
                if(pushResult.success){ 
                    if(broadcastingSetter) broadcastingSetter("Seat No:", pushResult.SeatNo);
                } else broadcastingSetter("Failed", "Server error")
            } else{
                if(pushResult.success) return pushResult;
                else return {success: false, msg: "Server Error"}
            } 
        }
    }

const generateSeatNo = () => {
    return "VM" + Math.floor(Math.random()*999999).toString().padStart(9, "0");
}

const randomizeResult = () => {
    
    let overallTotal = 0;
    const subjects = subjectSheet.map(subject => {

        const theoryMarks = Math.floor(Math.random()*subject.totalTh);
        const prMarks = Math.floor(Math.random()*subject.totalPR);
        const totalMarks = theoryMarks + prMarks;
        overallTotal += totalMarks;

        let grade;
        if(totalMarks >= 0 && totalMarks <= 75) grade = "D";
        else if(totalMarks > 75  && totalMarks <= 85) grade = "C";
        else if(totalMarks > 85 && totalMarks <= 95) grade = "B";
        else grade = "A";
        return {grade: grade, practicalTotal: subject.totalPR, practical_marks: prMarks, subjectName: subject.name, theoreticalTotal: subject.totalTh, theory_marks: theoryMarks}
    })

    return {totalMarks: overallTotal, Subjects: subjects};
}


const createNewCandidate = (resultList, fName, mName, lName) => {

    let generatedSeatNo;
    do {
    generatedSeatNo = generateSeatNo();
    } while (Object.keys(resultList).some(seat => seat === generatedSeatNo));

    const randomResult = randomizeResult();
    const candidateFailed = randomResult.Subjects.some(subject => subject.grade === "D");
    return { 
      Name: `${lName} ${fName} ${mName}`, 
      Result: candidateFailed ? "Fail" : "Pass",
      SeatNo: generatedSeatNo,
      Subjects: randomResult.Subjects,
      totalMarks: randomResult.totalMarks
    }
}

export {createNewCandidate, randomizeResult, generateSeatNo, addNewCandidate, searchResults, changeDefaultInst, subjectSheet}