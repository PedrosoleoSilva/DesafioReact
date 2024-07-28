import { useState, useEffect } from 'react';
import CampoTexto from '../CampoTexto';
import './Formulario.css'
import Botao from '../Botao';
import ListaHorario from '../ListaHorario';
import Calendario from '../Calendario';
import axios from 'axios';
import { isWeekend} from 'date-fns';
import DataNascimento from '../CalendarioDataNascimento';
import { FaUser, FaEnvelope, FaPhone, FaCity,FaCalendarAlt } from 'react-icons/fa';


const Formulario = () => {
   const [nome, setNome] = useState('')
   const [email, setEmail] = useState('')
   const [dataNascimento, setDataNascimento] = useState('')
   const [telefone, setTelefone] = useState('');
   const [cidade, setCidade] = useState('');
   const [errorEmail, setErrorEmail] = useState('');
   const [errorTelefone, setErrorTelefone] = useState('');
   const [errorData, setErrorData] = useState('')
   const [horarios, setHorarios] = useState([])
   const [horarioSelecionado, setHorarioSelecionado] = useState('');
   const [data, setData] = useState('');

   const listaHorario = async () =>{
    try {
        const response = await axios.get("http://localhost:5000/horarios");
        setHorarios(response.data);
    } catch (error) {
        console.error(error)
    }
};

   useEffect(()=>{
    listaHorario();
})

   const agendarHorario = async () => {
       if (!validarEmail(email)) {
           setErrorEmail('O Email deve conter @gmail.com ou @hotmail.com.');
           return;
       }
       if (!validarTelefone(telefone)) {
           setErrorTelefone('Por favor insira um número valido');
           return;
       }
       if (isWeekend(new Date(data))) {
        setErrorData('Não é possível selecionar sábados ou domingos.');
        return;
    }
       try {
           const response = await axios.post("http://localhost:5000/agenda", {
               nome: nome,
               email: email,
               dataNascimento: dataNascimento,
               telefone: telefone,
               cidade: cidade,
               data: data,
               horarioSelecionado: horarioSelecionado
           });
           await axios.patch(`http://localhost:5000/horarios/${horarioSelecionado}`, {
            vagas: horarios.find(h => h.id === horarioSelecionado).vagas - 1
        });
           alert("Sua Reserva foi Realizada com Sucesso!");
           console.log(response.data);
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
           listaHorario()
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
                       <Calendario
                           label="Selecione uma data"
                           minDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)}
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
                   <div className="input-with-icon">
                       <FaUser className="input-icon"/>
                       <CampoTexto
                           label="Nome"
                           placeholder="Digite o Seu Nome"
                           obrigatorio
                           valor={nome}
                           aoAlterado={valor => setNome(valor)}
                       />
                   </div>
                   <div className="input-with-icon">
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
                     <div className="input-with-icon">
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
                   <div className="input-with-icon">
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
