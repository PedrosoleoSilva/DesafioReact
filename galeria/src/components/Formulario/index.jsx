import { useState, useEffect } from 'react';
import CampoTexto from '../CampoTexto';
import './Formulario.css'
import Botao from '../Botao';
import ListaHorario from '../ListaHorario';
import Calendario from '../Calendario';

const Formulario = (props) => {
   const [nome, setNome] = useState('')
   const [email, setEmail] = useState('')
   const [dataNascimento, setDataNascimento] = useState('')
   const [telefone, setTelefone] =useState('');
   const [cidade, setCidade] = useState('');
   const [errorEmail, setErrorEmail] = useState('');
   const [errorTelefone, setErrorTelefone] = useState('');
   const [horarios, setHorarios] = useState([])
   const [horarioSelecionado, setHorarioSelecionado] = useState('');
   const [data, setData] = useState('');

   const criarPostAgenda = (agenda) => {
    agenda.cost = 0;
    agenda.services = [];
    fetch("http://localhost:5000/agenda", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' // Corrigido para 'application/json'
        },
        body: JSON.stringify(agenda),
    })
    .then((resp) => resp.json())
    .then((data) => {
        console.log('Resposta do servidor:', data);
    })
    .catch((err) => console.log('Erro ao enviar dados:', err));
};


    useEffect(()=>{
        fetch("http://localhost:5000/horarios",{
            method: "GET",
            headers: {
                'Content-Type': 'application/Json'
            }
           }).then((resp)=> resp.json()).then((data) =>{
            setHorarios(data)
           }).catch((err) => console.log(err))
    },[])
   const aoSalvar = (evento) =>{
    evento.preventDefault()

    if (!validarEmail(email)) {
        setErrorEmail('O Email deve conter @gmail.com ou @hotmail.com.')
        return
      }
      if (!validarTelefone(telefone)) {
        setErrorTelefone('Por favor insira um número valido')
        return
      }

      const Agenda = {
        nome,
        email,
        dataNascimento,
        telefone,
        cidade,
        data,
        horarioSelecionado
      }
      console.log('Dados enviados para o backend:', Agenda);
      criarPostAgenda(Agenda)
  
    setNome('')
    setEmail('')
    setDataNascimento('')
    setTelefone('')
    setCidade('')
    setErrorEmail('')
    setErrorTelefone('')
    setHorarioSelecionado('')
   }

   const validarEmail = (email) => {
    const regex = /^[^\s@]+@(gmail\.com|hotmail\.com)$/;
    return regex.test(email);
  };
  const validarTelefone = (telefone) => {
    const regex =  new RegExp('^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$');
    return regex.test(telefone);
  };

    return (
    <div> 
        <section className='formulario'>
            <form  onSubmit={aoSalvar}>
                <h3>Preencha o Card Abaixo para Realizar o Agendamento da Visita</h3>
                <div className='form'>
                    <Calendario  
                        label="Selecione uma data"
                        minDate={new Date()}
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
                <CampoTexto  
                    label="Nome" 
                    placeholder="Digite o Seu Nome"
                    obrigatorio
                    valor = {nome}
                    aoAlterado={valor => setNome(valor)}
                />
                 <CampoTexto  
                    label="Email" 
                    placeholder="Digite o Seu Email"
                    obrigatorio
                    valor = {email}
                    aoAlterado={valor => setEmail(valor)}
                />
                    {errorEmail && <p className="erro">{errorEmail}</p>}
                <CampoTexto  
                    label="Data Nascimento" 
                    placeholder="Digite a sua Data de Nascimento"
                    obrigatorio
                    type="number"
                    valor = {dataNascimento}
                    aoAlterado={valor => setDataNascimento(valor)}
                />
                <CampoTexto  
                    label="Telefone" 
                    placeholder="Digite o seu Numero de Telefone"
                    obrigatorio
                    valor = {telefone}
                    aoAlterado={valor => setTelefone(valor)}
                />
                    {errorTelefone && <p className="erro">{errorTelefone}</p>}
                <CampoTexto  
                    label="Cidade" 
                    placeholder="Digite a sua Cidade"
                    obrigatorio
                    valor = {cidade}
                    aoAlterado={valor => setCidade(valor)}
                />
                  
                <Botao>
                    Enviar Card
                </Botao>
            </form>
        </section>
    </div>
    );
}

export default Formulario;