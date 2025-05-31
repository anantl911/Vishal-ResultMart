import {useState, useEffect, useRef} from "react";
import FAQ from "../Components/onAbout/FAQ.jsx";
import Stats from "../Components/onAbout/Stats.jsx";
import  MassGenerate from "../Components/onAbout/MassGenerate.jsx";
import InfiniteSpin from "../spinners/InfiniteSpinner.jsx";

const About = () => {

    const [resultList, setResults] = useState(null);
    const [resultCount, setResultCount] = useState(40);
    const [totalPass, setTotalPass] = useState(0);
    const [histogramData, setHistogramData] = useState();
    const [resultListUpdated, setResultListUpdated] = useState(false);
    const [toppersList, setToppersList] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [resultChecked, setResultChecked] = useState(0);
    const [socialShareCount, setSocialShareCount] = useState(0);

    useEffect(() => {

        const fetchResults = async () => {
            try{
            console.log(import.meta.env.VITE_BACKEND_INSTANCE)
            const response = await fetch(`${import.meta.env.VITE_BACKEND_INSTANCE}/api/fetchAll`).then(response => response.json()).then(data => {return data});

            console.log(response);

            let fetchResponse = await fetch(`${import.meta.env.env.VITE_BACKEND_INSTANCE}/api/fetchdata`, { method: "POST" }); // this is for registering site views
            const data = await response.json();

            let visitResponse = await fetch(`${import.meta.env.env.VITE_BACKEND_INSTANCE}/api/getviews`).then(response => response.json()).then(data => {
                return data;
            })
            let socialFetch = await fetch(`${import.meta.env.env.VITE_BACKEND_INSTANCE}/api/getshares`).then(response => response.json()).then(data => {return data}); 

            if(socialFetch.success) setSocialShareCount(socialFetch.data);
            if(visitResponse.success) setResultChecked(visitResponse.data);
            if(data.success) {
                setResults(data.data);
                setDataLoaded(true);
            } else return;
            } catch (err){
                console.log(err);
            }
        }

        fetchResults();
    }, [])

    useEffect(() => {

        const histogramData = {}
        for(let i = 1 ; i<=95 ; i+=5){
            let key = `${i}-${i+5}`;
            histogramData[key] = 0;
        }

        const checkPercentage = (percentage) => {
            
        const range = Object.keys(histogramData).find(key => {
            let [lower, upper] = key.split("-").map(Number);
            return percentage > lower && percentage <= upper;
        });

            return range || "95-100";
        }

        const getToppers = () => {
            let passedStudentCount = 0;
            let toppersList = []
            if(resultList){
                Object.entries(resultList).forEach(result => {
                    
                    const percentage = parseFloat(((result[1].totalMarks / 500) * 100).toFixed(2));
                    result[1].Subjects
                    const histogramGroup = checkPercentage(percentage);
                    histogramData[histogramGroup] += 1;

                    if(result[1].Result === "Pass") passedStudentCount += 1;
                    else toppersList.push({name: result[1].Name,seatNo: result[0], percentile: percentage});
                })

                setTotalPass(passedStudentCount);
            }
            setHistogramData(histogramData);
            return toppersList;
        }

        if(resultList && !resultListUpdated){
            const toppersList = getToppers().sort((a,b) => b.percentile - a.percentile)
            .slice(0,10);
            console.log("Toppers list: ",toppersList);
            setToppersList(toppersList);
            setResultListUpdated(true);
            
            setResultCount(Object.keys(resultList).length);
        };
    }, [resultList])

    

    return(
        <article id="about" className={dataLoaded ? "min-h-[90rem] w-full" : "w-full relative min-h-[100vh]"}>
            {dataLoaded ? <div id="stats-container" className="mt-20 mb-20 gap-10 mx-10 flex flex-col lg:flex-row items-start">
                {histogramData && resultList && toppersList && (
                <div className="flex-[2.5] w-full">
                    <Stats
                    histogramData={histogramData}
                    totalCount={resultCount}
                    resultList={resultList}
                    totalPass={totalPass}
                    toppersList={toppersList}
                    resultChecked={resultChecked}
                    socialShareCount={socialShareCount}
                    />
                    <MassGenerate />
                </div>
                )}
                <div className="flex-[1]">
                <FAQ />
                </div>
            </div> : 
            <div className="absolute w-full flex justify-center min-h-[80vh] items-center">
                <InfiniteSpin />
            </div>}
        </article>
    )
}

export default About;