import { useState } from 'react';
import CampoTexto from '../CampoTexto';
import './Formulario.css'
import Botao from '../Botao';

const Formulario = () => {
   const [nome, setNome] = useState('')
   const [email, setEmail] = useState('')
   const [dataNascimento, setDataNascimento] = useState('')
   const [telefone, setTelefone] =useState('');
   const [cidade, setCidade] = useState('');
   const [errorEmail, setErrorEmail] = useState('');
   const [errorTelefone, setErrorTelefone] = useState('');

  
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
  
    setNome('')
    setEmail('')
    setDataNascimento('')
    setTelefone('')
    setCidade('')
    setErrorEmail('')
    setErrorTelefone('')
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
        <section className='formulario'>
            <form onSubmit={aoSalvar}>
                <h3>Preencha o Card Abaixo para Realizar o Agendamento da Visita</h3>
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
    );
}

export default Formulario;