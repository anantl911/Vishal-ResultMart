import style from "./style.module.css"

const BarSpinner = () => {
    return (
        <div>
            <span className={style.loader}></span>
        </div>
    )
}

export default BarSpinner;