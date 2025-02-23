import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Formulario.css';
import CampoTexto from '../CampoTexto';
import Botao from '../Botao';
import ListaDisponibilidade from '../ListaDisponibilidade';
import { differenceInYears } from 'date-fns';
import DataNascimento from '../CalendarioDataNascimento';
import { v4 as uuidv4 } from 'uuid';

const Formulario = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState(null);
    const [telefone, setTelefone] = useState('');
    const [cidade, setCidade] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorTelefone, setErrorTelefone] = useState('');
    const [errorData, setErrorData] = useState('');
    const [errorIdade, setErrorIdade] = useState('');
    const [horarioSelecionado, setHorarioSelecionado] = useState('');
    const [data, setData] = useState('');
    const navigate = useNavigate(); 

    const validarIdade = (dataNascimento) => {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        const idade = differenceInYears(hoje, nascimento);
        return idade >= 16;
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
        if (!validarAntecedencia(dataSelecionada)) {
            setErrorData('A reserva deve ser feita com pelo menos 2 dias de antecedência.');
            return;
        }
        if (!validarIdade(dataNascimento)) {
            setErrorIdade('Você deve ter pelo menos 16 anos.');
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
            alert('Reservar foi Realizada com Sucesso')
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
            setDataNascimento(null);
            setTelefone('');
            setCidade('');
            setErrorEmail('');
            setErrorTelefone('');
            setErrorIdade('');
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

    const validarAntecedencia = (dataSelecionada) => {
        const hoje = new Date();
        const diaSelecionado = dataSelecionada.getDay();
        const diaHoje = hoje.getDay();
        const diasDeAntecedencia = (diaSelecionado - diaHoje + 7) % 7;
    
        return diasDeAntecedencia >= 2;
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
                    {errorIdade && <p className="erro">{errorIdade}</p>}
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
