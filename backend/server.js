const express = require('express');
const cors = require('cors');
const { validateData } = require("./controller/dataValidate.js");
const app = express();
const PORT = 8001;
const {getResult, postResult, removeResult, getAllResults, registerView, getViews, socialShares, getShares, registerMassEntry} = require("./controller/databaseOperations.js")

app.use(cors());
app.use(express.json());



app.get("/api/getresult/:seatNo&:placeOfBirth", async (req,res) => {

    try{
    const {seatNo, placeOfBirth} = req.params;

    const result = await getResult(seatNo, placeOfBirth, req.ip);
    if(result.success) res.status(200).json(result);
    else res.status(result.status).json(result)
    } catch(err){
        res.status(500).json({success: false, msg: err});
    }
    
});

app.get("/api/fetchAll", async (req, res) => {
    const results = await getAllResults();
    if(results.success) res.status(200).json(results);
    else res.status(500).json(results);

})

app.delete("/api/delete", async (req, res) => {
    const {seatNo} = req.body;
    console.log("Seat No", seatNo);
    const result = await removeResult(seatNo);
    console.log(result);
    res.status(result.status).json(result);
});

app.post("/api/fetchdata", async (req, res) => {
    const registeredView = await registerView();
    if(registeredView.success) res.status(200).json({success: false, msg: "server error"});
    else res.status(400).json({success: false, msg: "server error"});
})

app.post("/api/postResult", (req, res) => {

    const { resultList } = req.body;
    let failCount = 0;
    let successList = [];

    for (const candidate of resultList) {
        const result = validateData(candidate);
        if (!result.success){
            res.status(500).json({success: false, msg: "Bad request."})
        }

        const resultResponse = postResult(candidate);
        if (!resultResponse.success) failCount++;
        else successList.push(resultResponse.data);
    }
    
    res.status(200).json({success: true, data: successList})
});

app.get("/api/getviews", async (req, res) => {
    response = await getViews();
    if(response.success) res.status(200).json(response);
    else res.status(500).json(response);
})

app.get("/api/getshares", async (req, res) => {

    try{
    const response = await getShares();
    if(response.success) res.status(200).json({success: true, data: response.data});
    else res.status(500).json({success: false, msg: "Server error"});
    } catch (err) {
        if(response.success) res.status(200).json({success: false, msg: err});
    }
})

app.post("/api/shareSpike", async (req, res) => {

    const response = await socialShares();
    if(response.success) res.status(200).json({success: true})
    else res.status(200).json({success: false})
})


app.post("/api/pushCountIncr", async (req, res) => {

    const response = await registerMassEntry();
    if(response.success) res.status(200).json({success: true})
    else res.status(200).json({success: false})
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});