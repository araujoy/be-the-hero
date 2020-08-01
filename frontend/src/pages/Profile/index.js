import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

export default function Profile() {
    const [incidents, setIncidents] = useState([]);
    
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');
    
    const history = useHistory();

    //array 'de dependências'. primeiro a função que quero acionar, e depois quando. se eu deixar o seg vazio,
    //faz apenas uma vez - nesse caso, eu quero isso.
    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => { 
            setIncidents(response.data);
        })
    }, [ongId]); //O ID vira uma dependência

    async function handleDeleteIncident(id){
        try{
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            });

            //P/ deletar em tempo da real da interface tb. Pego todos que tem id != do que exclui
            setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (err) {
            alert('Erro ao deletar caso, tente novamente.');
        }
    }

    function handleLogout() {
        localStorage.clear();

        history.push('/');        
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be the hero"/>
                <span>Bem vinda, {ongName}</span>

                <Link className="button" to="/incidents/new">Cadastrar novo</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#e02041"/>
                </button>            
            </header>
            <h1>Casos cadastrados</h1>
            <ul>
                {incidents.map(incident =>(
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p> 

                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(incident.value)}</p>

                        <button onClick={() => handleDeleteIncident(incident.id)} type="button" >        
                            <FiTrash2 size={20} color="#a8a8b3"/>
                        </button>
                    </li>
                ))}                
            </ul>
        </div>
    );
}