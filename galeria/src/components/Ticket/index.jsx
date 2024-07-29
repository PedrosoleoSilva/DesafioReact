import React from 'react';
import { useLocation } from 'react-router-dom';
import './Ticket.css';

const Ticket = () => {
    const location = useLocation();
    const { state } = location;

    const ticket = state || {}; 

    return (
        <div className="ticket-container">
            <h3>Seu Ticket de Reserva</h3>
            <div className='ticket-content'>
                <div className='ticket-esquerdo'>
                    <p><strong>Nome: </strong> {ticket.nome || 'Nome não disponível'}</p>
                    <p><strong>Data da Reserva: </strong> {ticket.data || 'Data não disponível'}</p>
                    <p><strong>Telefone: </strong> {ticket.telefone || 'Telefone não disponível'}</p>
                    <p><strong>Horário: </strong> {ticket.horario || 'Horário não disponível'}</p>
                    <img src="./assets/expoarte.png" alt="logo ticket"/>
                </div>
                <div className='ticket-codigo'>
                    <img src="./assets/qr.png" alt="qrCode" />
                    <p><strong>Código:</strong> {ticket.codigo || 'Código não disponível'}</p>
                </div>
            </div>
        </div>
    );
}

export default Ticket;
