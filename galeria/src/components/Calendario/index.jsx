import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import './Calendario.css'
const Calendario = (props) => {
    return (
        <div className='calendario'>
            <label>{props.label}</label>
            <DatePicker 
                 className="date"
                 minDate={props.minDate}  
                 selected={props.selected} 
                 onChange={props.onChange} 
                 value={props.value}
                 placeholderText={props.placeholderText}
            />
        </div>
    );
}

export default Calendario;