import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListaDisponibilidade.css';

const ListaDisponibilidade = ({ onDataSelect, onHorarioSelect }) => {
    const [disponibilidade, setDisponibilidade] = useState([]);
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

    useEffect(() => {
        const fetchDisponibilidade = async () => {
            try {
                const response = await axios.get('http://localhost:5000/horarios');
                setDisponibilidade(response.data);
            } catch (error) {
                console.error('Erro ao buscar disponibilidade:', error);
            }
        };

        fetchDisponibilidade();
    }, []);

    useEffect(() => {
        if (dataSelecionada) {
            const data = disponibilidade.find(d => d.data === dataSelecionada);
            setHorariosDisponiveis(data ? data.horarios : []);
        } else {
            setHorariosDisponiveis([]);
        }
    }, [dataSelecionada, disponibilidade]);

    const handleHorarioSelect = async (horarioSelecionado) => {
        try {
            const dataIndex = disponibilidade.findIndex(d => d.data === dataSelecionada);
            if (dataIndex !== -1) {
                const horariosAtualizados = disponibilidade[dataIndex].horarios.map(horario =>
                    horario.horario === horarioSelecionado && horario.vagas > 0
                        ? { ...horario, vagas: horario.vagas - 1 }
                        : horario
                );

                const updatedData = [...disponibilidade];
                updatedData[dataIndex] = { ...updatedData[dataIndex], horarios: horariosAtualizados };

                // Atualiza a disponibilidade no JSON Server
                await axios.put(`http://localhost:5000/horarios/${updatedData[dataIndex].id}`, updatedData[dataIndex]);

                setHorariosDisponiveis(horariosAtualizados); // Atualiza o estado local
                onHorarioSelect(horarioSelecionado);
            }
        } catch (error) {
            console.error('Erro ao atualizar vagas:', error);
        }
    };

    return (
        <div className='lista'>
            <h1>Disponibilidade de Horários</h1>
            <div>
                <label>Selecione uma data:</label>
                <select onChange={(e) => {
                    const selectedDate = e.target.value;
                    setDataSelecionada(selectedDate);
                    onDataSelect(selectedDate);
                }}>
                    <option value="">Selecione uma data</option>
                    {disponibilidade.map(data => (
                        <option key={data.id} value={data.data}>
                            {data.data}
                        </option>
                    ))}
                </select>
            </div>
            {dataSelecionada && (
                <div>
                    <label>Selecione um horário:</label>
                    <select onChange={(e) => handleHorarioSelect(e.target.value)}>
                        <option value="">Selecione um horário</option>
                        {horariosDisponiveis.map(horario => (
                            <option key={horario.horario} value={horario.horario}>
                                {horario.horario} - Vagas: {horario.vagas}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}

export default ListaDisponibilidade;
