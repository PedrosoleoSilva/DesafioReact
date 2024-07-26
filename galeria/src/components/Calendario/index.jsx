
import './Calendario.css'
import { Calendar } from 'primereact/calendar';
        

const Calendario = (props) => {
    return (
        <div className='calendario'>
            <Calendar onChange={props.onChange} value={props.value}  />
        </div>
    );
}

export default Calendario;