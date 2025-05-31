import { useState } from "react";


const FAQ = () => {

        const [activeAccordions, setActiveAccordions] = useState({
        "question-1": false,
        "question-2": false,
        "question-3": false,
        "question-4": false 
        }
    );

    let questionCount = 0;

    const ToggleAccordion = (questionID) => {
        // console.log(e)
        // const elementID = e.target.parentElement.parentElement.parentElement.id;
        console.log(questionID);
        setActiveAccordions(prev => ({...prev, [questionID]: !prev[questionID]}));
    };

    const generateQuestions = (question, answer) => {
        questionCount +=1;
        const questionID = `question-${questionCount}`;
        return (
            <div id={questionID} key={questionID} className="w-full mb-4">
                <div className=" bg-gray-300 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-start">
                    <div className="w-full px-4 py-2">
                        <p className="text-lg font-medium text-gray-800">{question}</p>
                        <p
                        className={`transition-max-height duration-300 ease-in-out overflow-hidden text-sm text-gray-700 bg-blue-100 rounded mt-2 ${
                            activeAccordions[questionID] ? 'max-h-96 py-2 px-3' : 'max-h-0'
                        }`}
                        >
                        {answer}
                        </p>
                        {questionCount === 7 && <p
                        className={`transition-max-height duration-300 ease-in-out overflow-hidden text-sm text-gray-700 bg-blue-100 rounded mt-2 ${
                            activeAccordions[questionID] ? 'max-h-96 py-2 px-3' : 'max-h-0'
                        }`}
                        >
                        {"I got rejected too. ( ͡° ͜ʖ ͡°)"}
                        </p>}
                    </div>
                    <div
                        className="m-2 bg-[#0375b3] hover:bg-blue-800 text-white w-8 h-8 flex justify-center items-center rounded-full cursor-pointer transition duration-200 text-lg"
                        onClick={() => ToggleAccordion(questionID)}
                    >
                        {activeAccordions[questionID] ? "-" : "+"}
                    </div>
                    </div>
                </div>
            </div>

        )
    }

    return(
        <div id="about-box" className=" min-w-80 flex items-start flex-col">
                <div id="container" className="bg-gray-200  min-w-full">
                    <div id="about-header" className="bg-[#eb268f] text-white w-full py-2 px-6 text-center">
                        <h3>Frequently Asked Questions - FAQ</h3>
                    </div>
                

                <div id="questions-container" className="select-none px-10 flex flex-col gap-5 py-5">

                    {generateQuestions(
                    "What's this?", 
                    "A joke... just like my entire existence and life is."
                    )}
                    {generateQuestions(
                    "Why does this website not work sometimes", 
                    "It doesn't work because it's made by me."
                    )}
                    {generateQuestions(
                    "I'm in toppers list but I didn't pass.", 
                    "Toppers list includes names of those who've topped the exam but didn't pass."
                    )}
                    {generateQuestions(
                    "Eww CREEP...! Remove my name. I don't have anything to do with you/know you.", 
                    "Sorry for adding you. If u don't like it I've added option for you in the results page. Just enter your seat no and you'll be removed from the db :)"
                    )}
                    {generateQuestions(
                    "Why is the UI so ugly?", 
                    "It's inspired by my face. 🤢🤮"
                    )}
                    {generateQuestions(
                    "Frequently asked? Pehli baat to maine pucha nhi 😎", 
                    "Haan.. haan bhai ban le cool."
                    )}
                    {generateQuestions(
                    "What the hell? D grade? That's unfair!", 
                    "What can I say? Getting into Vishal Mega Mart is everyone's dream. Competition's tough"
                    )}
                    {generateQuestions(
                    "I passed the exam. Why is the joy music still being played?", 
                    "Well life is still shit even if passed in a meme exam so why bother changing it."
                    )}
                    {generateQuestions(
                    "Why is there a subject named \"Help\"?", 
                    "This website including my very own life is a complete fucking joke. Do not take anything seriously. "
                    )}
                    {generateQuestions(
                    "Brooo? But I really did want to become a Security Guard at Vishal Mega Mart", 
                    "You'll have another chance next year... No seriously!"
                    )}
                    {generateQuestions(
                    "Dark mode kidhar hai", 
                    "Arra eeh baba endsem cha abhyas krre!!"
                    )}

                </div>
            </div>
                
            </div>
    )
}

export default FAQ;