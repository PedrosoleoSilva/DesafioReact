import './ListaHorario.css';

const ListaHorario = ({ options, label, obrigatorio, aoAlterado, valor }) => {

    const aoSelecionar = (evento) => {
        aoAlterado(evento.target.value);
    }
    return (
        <div className='lista'>
            <label>{label}</label>
            <select onChange={aoSelecionar} required={obrigatorio} value={valor}>
                <option value="">Selecione um horário</option>
                {options.map((option) => (
                    <option value={option.id} key={option.id}>{option.horario}</option>
                ))}
            </select>
        </div>
    );
}

export default ListaHorario;
