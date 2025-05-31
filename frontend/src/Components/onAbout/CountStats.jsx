import CounterBar from "./CounterBar.jsx";

const CountStats = (props) => {
    return (
                    <div className="flex gap-10 flex-col select-none">

                        <div className="flex gap-14">
                        
                            <CounterBar label="Total Candidates" counter={props.totalCount} />
                            
                            <CounterBar label="Acceptance Rate" counter={((props.totalPass / props.totalCount)*100).toFixed(2) + "%"} />

                        </div>

                        <div className="flex gap-14">
                        
                            <CounterBar label="Results Checked" counter={props.checkCount} />
                            
                            <CounterBar label="Results Shared" counter={props.socialShareCount} />

                        </div>

                    </div>
    )
}

export default CountStats;