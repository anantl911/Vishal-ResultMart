import style from "./style.module.css"

const InfiniteSpin = () => {
    return (
        <div className="w-20 h-20 flex justify-center items-center">
            <span className={style.infinitespin}></span>
        </div>
    )
}

export default InfiniteSpin;