import {useState, useEffect, useRef} from "react";
import ResultSearch from "../Components/onResults/ResultSearch.jsx";
import ResultBox from "../Components/onResults/ResultBox.jsx";
import "../spinners/InfiniteSpinner.jsx";
import InfiniteSpin from "../spinners/InfiniteSpinner.jsx";

const Result = () => {

    
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState();
    const audioPlayback = useRef(new Audio()); 
    const [loaded, setLoaded] = useState(true);
    useEffect(() => {
        if(showResult){
            
            let generatedNumber = Math.random()*11;

            if(generatedNumber >= 8) audioPlayback.current.src = "/audio/sunshine_playback.mp3"; //
            else audioPlayback.current.src = "/audio/joy_playback.mp3";
            const audioTimeout = setTimeout(() => {
                audioPlayback.current.volume = 0.1;
                audioPlayback.current.play();
            }, 100);
        }
    }, [showResult]);

    const storeResult = (result) => setResult(result);

    const showResultBox = () => setShowResult(!showResult);

    const flipResultsLoad = (loadState = false) => 
        {
            console.log(loaded);
            setLoaded(loadState)
        };

    return(
        <section id="result-page" className="min-h-60 w-full flex">
            {!showResult && loaded && <ResultSearch storeResult={storeResult}
            updateShowResult={showResultBox} setLoaded={flipResultsLoad} />}

            {!loaded && <div className="min-h-[90vh] flex justify-center items-center w-full">
                <InfiniteSpin />
            </div>}

            {showResult && loaded && result && <ResultBox 
            seatNo={result.SeatNo}
            candidateName={result.Name}
            finalResult={result.Result}
            totalMarks={result.totalMarks}
            subjects={result.Subjects}

            updateShowResult={showResultBox}
            />}

        </section>
    )
}

export default Result;