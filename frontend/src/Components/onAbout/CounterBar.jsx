

const CounterBar = (props) => {
    return (
        <div id="total-candidates-rate" className="bg-gray-300 text-white">
            <p className="text-[clamp(16px,2.4vw,20px)] bg-[#0274b3] p-5 min-w-[14vw] text-center">{props.label}</p>
            <p className="text-[clamp(16px,2.4vw,24px)] text-center py-3 text-black ">{props.counter}</p>
        </div>
    )
}


export default CounterBar;