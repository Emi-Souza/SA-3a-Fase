import React, { useState, useContext } from 'react';
import './Navbar.css';
import './JanelaModal.css';
import { BiSolidImageAdd } from "react-icons/bi";
import { PetContext } from "../contexts/PetContext";
import { useNavigate } from 'react-router-dom';

export default function JanelaModal({ isOpen, setModalOpen }) {
  const { addPet } = useContext(PetContext);
  const navigate = useNavigate();

  const [inptPetEspecie, setInptPetEspecie] = useState('');
  const [inptPetNome, setInptPetNome] = useState('');
  const [inptPetRaca, setInptPetRaca] = useState('');
  const [inptPetIdade, setInptPetIdade] = useState('');
  const [inptPetPorte, setInptPetPorte] = useState('');
  const [inptPetGenero, setInptPetGenero] = useState('');
  const [inptPetDescricao, setInptPetDescricao] = useState('');
  const [inptPetImagemURL, setInptPetImagemURL] = useState('');
  const [aceitarTermos, setAceitarTermos] = useState(false);
  const [erros, setErros] = useState({});

  if (!isOpen) {
    return null;
  }

  const validarFormulario = () => {
    if (!inptPetNome || !inptPetRaca || !inptPetIdade || !inptPetPorte || !inptPetGenero || !inptPetDescricao || !inptPetImagemURL || !aceitarTermos) {
      return { geral: 'Todos os campos são obrigatórios e você deve aceitar os termos e condições.' };
    }
    return {};
  };

  const CadastrarPet = async (e) => {
    e.preventDefault();

    const novosErros = validarFormulario();
    if (Object.keys(novosErros).length > 0) {
        setErros(novosErros);
        return;
    }

    enviarPet();
  };

  const enviarPet = async () => {
    const novoPet = {
        especie: inptPetEspecie,
        nome: inptPetNome,
        raca: inptPetRaca,
        idade: inptPetIdade,
        porte: inptPetPorte,
        genero: inptPetGenero,
        descricao: inptPetDescricao,
        imagem: inptPetImagemURL
    };

    try {
        await addPet(novoPet);
        console.log('Pet cadastrado:', novoPet);
        setModalOpen(false);
        window.location.reload();
    } catch (error) {
        setErros({ geral: 'Erro ao cadastrar pet. Tente novamente.' });
    }
  };

  return (
    <div className='modal_conteiner'>
      <div className='conteiner_modal'>
        <form className="cad-pet-container" onSubmit={CadastrarPet}>
          <div className="titulo-cad-pet">
            <div className="titulo-barra-pet">
              <h2>Criar anúncio para Pet</h2>
              <img src="/images/barra_marrom.png" className='barra-pet'/>
            </div>
            <button onClick={() => setModalOpen(false)} className='botao_modal'>{'<'}</button>
          </div>
          <div className="inputs-pet">
            <div className="inpts-pet-1">
              <div className="linha-inpt">
                <div className="label-inpt">
                  <label>Espécie:</label>
                  <input 
                    type="text"
                    value={inptPetEspecie}
                    onChange={(e) => setInptPetEspecie(e.target.value)}
                  />
                </div>
                <div className="label-inpt">
                  <label>Nome do Pet:</label>
                  <input 
                    type="text" 
                    value={inptPetNome}
                    onChange={(e) => setInptPetNome(e.target.value)}
                  />
                </div>
              </div>
              <div className="linha-inpt">
                <div className="label-inpt">
                  <label>Raça:</label>
                  <input 
                    type="text" 
                    value={inptPetRaca}
                    onChange={(e) => setInptPetRaca(e.target.value)}
                  />
                </div>
                <div className="label-inpt">
                  <label>Idade:</label>
                  <input 
                    type="text" 
                    value={inptPetIdade} 
                    onChange={(e) => setInptPetIdade(e.target.value)}
                  />
                </div>
              </div>
              <div className="linha-inpt">
                <div className="label-inpt">
                  <label>Porte:</label>
                  <select 
                    name="selectPorte" 
                    value={inptPetPorte}
                    onChange={(e) => setInptPetPorte(e.target.value)}
                  >
                    <option value=""></option>
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
                <div className="genero-pet">
                  <label>Gênero:</label>
                  <div className="radio-pet">
                    <input 
                      type="radio" 
                      name='radio-genero' 
                      className='radio-genero' 
                      value="Fêmea"
                      checked={inptPetGenero === 'Fêmea'}
                      onChange={() => setInptPetGenero('Fêmea')}
                    />
                    <p>Fêmea</p>
                    <input 
                      type="radio" 
                      name='radio-genero' 
                      className='radio-genero'
                      value="Macho"
                      checked={inptPetGenero === 'Macho'}
                      onChange={() => setInptPetGenero('Macho')}
                    />
                    <p>Macho</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="label-inpt">
            <label>Imagem URL:</label>
            <input 
              className='inptImgPet'
              type="text" 
              placeholder='Adicione a URL da imagem do seu Pet!' 
              value={inptPetImagemURL}
              onChange={(e) => setInptPetImagemURL(e.target.value)}
            />
          </div>


          <div className="descricao-pet-cad">
            <label>Descrição:</label>
            <input 
              type="text" 
              placeholder='Adicione uma descrição para seu anúncio!' 
              value={inptPetDescricao}
              onChange={(e) => setInptPetDescricao(e.target.value)}
            />
          </div>
          
          {erros.geral && <p className="erro-mensagem">{erros.geral}</p>}
          <div className="termos-cadastro-pet">
            <div className="termos-pet">
              <input 
                type="checkbox" 
                checked={aceitarTermos}
                onChange={(e) => setAceitarTermos(e.target.checked)}
              />
              <p className='termos-1'>
                Ao preencher o formulário acima você concorda com os nossos
              </p>
              <a href="#" className='link-termos'>Termos de Uso.</a>
            </div>
          </div>
          <button type="submit" className='botao-cad-pet'>Cadastrar Pet</button>
        </form>
      </div>
    </div>
  );
}