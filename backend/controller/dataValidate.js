
const validateData = (candidate) => {

    let request = {success: false, msg: "Bad request", statusCode: 500};

    if(candidate.SeatNo && candidate.Name
      && candidate.Result && candidate.totalMarks 
      && candidate.Subjects
    ){
        if((candidate.SeatNo.toUpperCase().includes("VM8002") || candidate.SeatNo.toUpperCase().includes("VM000"))){
            request = {success: true, msg: "Passed", statusCode: 200}
        }
    } 
    return request;

}

module.exports = {validateData};