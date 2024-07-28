import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import './DataNascimento.css'


const DataNascimento = (props) => {
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
                 showYearDropdown
                 showMonthDropdown
                 dropdownMode="select"
                 yearDropdownItemNumber={100}
            />
        </div>
    );
}

export default DataNascimento;