import { useState, useEffect } from 'react';
import CampoTexto from '../CampoTexto';
import './Formulario.css';
import Botao from '../Botao';
import ListaHorario from '../ListaHorario';
import Calendario from '../Calendario';
import axios from 'axios';
import { isWeekend } from 'date-fns';
import DataNascimento from '../CalendarioDataNascimento';
import { FaUser, FaEnvelope, FaPhone, FaCity } from 'react-icons/fa';

const Formulario = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cidade, setCidade] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorTelefone, setErrorTelefone] = useState('');
    const [errorData, setErrorData] = useState('');
    const [horarios, setHorarios] = useState([]);
    const [horarioSelecionado, setHorarioSelecionado] = useState('');
    const [data, setData] = useState(null); 
    const [horariosData, setHorariosData] = useState([]);
    const [dataId, setDataId] = useState('');

    const listaHorario = async (selectedDate) => {
        try {
            const response = await axios.get(`http://localhost:5000/horarios?data=${selectedDate}`);
            const dataExistente = response.data[0];
    
            if (dataExistente) {
                setHorarios(dataExistente.horarios);
                setHorariosData(response.data); 
                setDataId(dataExistente.id);
            } else {
                const todosHorarios = await axios.get('http://localhost:5000/horarios');
                const horariosExistentes = todosHorarios.data;
                const proximoId = horariosExistentes.length
                    ? (Math.max(...horariosExistentes.map(h => parseInt(h.id))) + 1).toString()
                    : '1';
                const novoRegistro = {
                    id: proximoId,
                    data: selectedDate,
                    horarios: [
                        { horario: "08:00", vagas: 20 },
                        { horario: "09:00", vagas: 20 },
                        { horario: "10:00", vagas: 20 },
                        { horario: "11:00", vagas: 20 },
                        { horario: "14:00", vagas: 20 },
                        { horario: "15:00", vagas: 20 },
                        { horario: "16:00", vagas: 20 },
                        { horario: "17:00", vagas: 20 }
                    ]
                };

                await axios.post('http://localhost:5000/horarios', novoRegistro);
                setHorarios(novoRegistro.horarios);
                setHorariosData([novoRegistro]); 
                setDataId(novoRegistro.id);
            }
        } catch (error) {
            console.error("Erro ao listar ou criar horários:", error);
        }
    };
    
    useEffect(() => {
        if (data) {
            listaHorario(data.toISOString().split('T')[0]);
        }
    }, [data]);

    const agendarHorario = async () => {
        if (!validarEmail(email)) {
            setErrorEmail('O Email deve conter @gmail.com ou @hotmail.com.');
            return;
        }
        if (!validarTelefone(telefone)) {
            setErrorTelefone('Por favor insira um número válido');
            return;
        }
        if (isWeekend(new Date(data))) {
            setErrorData('Não é possível selecionar sábados ou domingos.');
            return;
        }
    
        try {
            await axios.post("http://localhost:5000/agenda", {
                nome: nome,
                email: email,
                dataNascimento: dataNascimento,
                telefone: telefone,
                cidade: cidade,
                data: data.toISOString().split('T')[0],
                horarioSelecionado: horarioSelecionado
            });

            const formattedDate = data.toISOString().split('T')[0];
            const horariosDataAtualizados = horariosData.find(d => d.data === formattedDate);
            
            if (horariosDataAtualizados) {
                const horarioAtualizado = horariosDataAtualizados.horarios.map(horario => {
                    if (horario.horario === horarioSelecionado) {
                        if (horario.vagas > 0) {
                            return { ...horario, vagas: horario.vagas - 1 };
                        } else {
                            alert('Não há mais vagas disponíveis para o horário selecionado.');
                            return horario;
                        }
                    }
                    return horario;
                });

                if (dataId) {
                    await axios.patch(`http://localhost:5000/horarios/${dataId}`, {
                        horarios: horarioAtualizado
                    });

                    setHorarios(horarioAtualizado);
                }
            }
            alert("Sua Reserva foi Realizada com Sucesso!");

            setNome('');
            setEmail('');
            setDataNascimento('');
            setTelefone('');
            setCidade('');
            setErrorEmail('');
            setErrorTelefone('');
            setHorarioSelecionado('');
            setData(null);
            setErrorData('');
        
            listaHorario(formattedDate);
        } catch (error) {
            console.error("Erro ao realizar a reserva:", error);
        }
    };
    

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@(gmail\.com|hotmail\.com)$/;
        return regex.test(email);
    };

    const validarTelefone = (telefone) => {
        const regex = new RegExp('^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$');
        return regex.test(telefone);
    };

    return (
        <div>
            <section className='formulario'>
                <form onSubmit={(evento) => { evento.preventDefault(); agendarHorario(); }}>
                    <h3>Preencha o Card Abaixo para Realizar o Agendamento da Visita</h3>
                    <div className='form'>
                        <Calendario
                            label="Selecione uma data"
                            selected={data}
                            onChange={date => setData(date)}
                            placeholderText="Selecione Uma data"
                        />
                        <ListaHorario
                            label="Horário"
                            obrigatorio
                            options={horarios}
                            valor={horarioSelecionado}
                            aoAlterado={valor => setHorarioSelecionado(valor)}
                        />
                    </div>
                    <div className="input">
                        <FaUser className="input-icon" />
                        <CampoTexto
                            label="Nome"
                            placeholder="Digite o Seu Nome"
                            obrigatorio
                            valor={nome}
                            aoAlterado={valor => setNome(valor)}
                        />
                    </div>
                    <div className="input">
                        <FaEnvelope className="input-icon" />
                        <CampoTexto
                            label="Email"
                            placeholder="Digite o Seu Email"
                            obrigatorio
                            valor={email}
                            aoAlterado={valor => setEmail(valor)}
                        />
                        {errorEmail && <p className="erro">{errorEmail}</p>}
                    </div>
                    <DataNascimento
                        label="Data Nascimento"
                        selected={dataNascimento}
                        onChange={(date) => setDataNascimento(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecione uma data"
                        className="campo-data"
                    />
                    <div className="input">
                        <FaPhone className="input-icon" />
                        <CampoTexto
                            label="Telefone"
                            placeholder="Digite o seu Numero de Telefone"
                            obrigatorio
                            valor={telefone}
                            aoAlterado={valor => setTelefone(valor)}
                        />
                        {errorTelefone && <p className="erro">{errorTelefone}</p>}
                    </div>
                    <div className="input">
                        <FaCity className="input-icon" />
                        <CampoTexto
                            label="Cidade"
                            placeholder="Digite a sua Cidade"
                            obrigatorio
                            valor={cidade}
                            aoAlterado={valor => setCidade(valor)}
                        />
                        {errorData && <p className="erro">{errorData}</p>}
                    </div>
                    <Botao>
                        Enviar Card
                    </Botao>
                </form>
            </section>
        </div>
    );
}

export default Formulario;
