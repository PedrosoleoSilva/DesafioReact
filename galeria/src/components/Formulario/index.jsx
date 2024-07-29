import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Formulario.css';
import CampoTexto from '../CampoTexto';
import Botao from '../Botao';
import ListaDisponibilidade from '../ListaDisponibilidade';
import { isWeekend, differenceInDays } from 'date-fns';
import DataNascimento from '../CalendarioDataNascimento';
import { v4 as uuidv4 } from 'uuid';

const Formulario = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cidade, setCidade] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorTelefone, setErrorTelefone] = useState('');
    const [errorData, setErrorData] = useState('');
    const [horarioSelecionado, setHorarioSelecionado] = useState('');
    const [data, setData] = useState('');
    const [disponibilidade, setDisponibilidade] = useState([]);
    const navigate = useNavigate(); 

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

    const atualizarVagas = async () => {
        try {
            const dataSelecionada = disponibilidade.find(d => d.data === data);
            if (dataSelecionada) {
                const horarioAtualizado = dataSelecionada.horarios.map(horario => 
                    horario.horario === horarioSelecionado && horario.vagas > 0
                        ? { ...horario, vagas: horario.vagas - 1 }
                        : horario
                );
                await axios.put(`http://localhost:5000/horarios/${data}`, { 
                    ...dataSelecionada,
                    horarios: horarioAtualizado
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar vagas:', error);
        }
    };

    const agendarHorario = async () => {
        if (!validarEmail(email)) {
            setErrorEmail('O Email deve conter @gmail.com ou @hotmail.com.');
            return;
        }
        if (!validarTelefone(telefone)) {
            setErrorTelefone('Por favor insira um número válido');
            return;
        }
        const dataSelecionada = new Date(data);
        const hoje = new Date();

        if (isWeekend(dataSelecionada)) {
            setErrorData('Não é possível selecionar sábados ou domingos.');
            return;
        }

        if (differenceInDays(dataSelecionada, hoje) < 2) {
            setErrorData('A reserva deve ser feita com pelo menos 2 dias de antecedência.');
            return;
        }

        try {
            const codigoTicket = uuidv4();
            await axios.post("http://localhost:5000/agenda", {
                nome,
                email,
                dataNascimento,
                telefone,
                cidade,
                data,
                horarioSelecionado,
                codigoTicket
            });

            await atualizarVagas();
            navigate('/ticket', {
                state: {
                    codigo: codigoTicket,
                    nome,
                    telefone,
                    data,
                    horario: horarioSelecionado
                }
            });
            setNome('');
            setEmail('');
            setDataNascimento('');
            setTelefone('');
            setCidade('');
            setErrorEmail('');
            setErrorTelefone('');
            setHorarioSelecionado('');
            setData('');
            setErrorData('');
        } catch (error) {
            console.error(error);
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
                        <ListaDisponibilidade
                            onDataSelect={setData}
                            onHorarioSelect={setHorarioSelecionado}
                        />
                    </div>
                    <CampoTexto
                        label="Nome"
                        placeholder="Digite o Seu Nome"
                        obrigatorio
                        valor={nome}
                        aoAlterado={valor => setNome(valor)}
                    />
                    <CampoTexto
                        label="Email"
                        placeholder="Digite o Seu Email"
                        obrigatorio
                        valor={email}
                        aoAlterado={valor => setEmail(valor)}
                    />
                    {errorEmail && <p className="erro">{errorEmail}</p>}
                    <DataNascimento
                        label="Data Nascimento"
                        selected={dataNascimento}
                        onChange={(date) => setDataNascimento(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecione uma data"
                        className="campo-data"
                    />
                    <CampoTexto
                        label="Telefone"
                        placeholder="Digite o seu Numero de Telefone"
                        obrigatorio
                        valor={telefone}
                        aoAlterado={valor => setTelefone(valor)}
                    />
                    {errorTelefone && <p className="erro">{errorTelefone}</p>}
                    <CampoTexto
                        label="Cidade"
                        placeholder="Digite a sua Cidade"
                        obrigatorio
                        valor={cidade}
                        aoAlterado={valor => setCidade(valor)}
                    />
                    {errorData && <p className="erro">{errorData}</p>}
                    <Botao>
                        Enviar Card
                    </Botao>
                </form>
            </section>
        </div>
    );
}

export default Formulario;
