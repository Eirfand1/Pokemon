import { useState, useEffect } from 'react'
import { Card, Button, Modal, Progress } from 'flowbite-react';
import Load from './loading.gif';
const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20); 
  const [modal, setModal] = useState(false);
  const [pokeDetail, setPokeDetail] = useState([]);
 
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const jsonData = await response.json();
        const pokemonDetails = await Promise.all(
          jsonData.results.map(async (item) => {
            const detailResponse = await fetch(item.url);
            return await detailResponse.json();
          })
        );
        setPokemon(pokemonDetails);
      } catch (err) {
        setError('Failed to fetch Pokemon data');
        console.error('Error : ', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [offset]);
 
  const nextPage = ()=> {
    setLoading(true);
    setOffset(offset=>offset + limit);
  } 
 
  const prevPage = ()=> {
    setLoading(true);
    offset === 0 ? setLoading(false) : setOffset(offset=>offset - limit);
 
  }
 
  const PokemonCard = ({ result }) => {
    const img = result.sprites.front_default;
 
    return (
      <Card key={result.id} className="w-full max-w-sm border-4 border-purple-300 hover:rotate-2 transition-all" onClick={()=>{
        setModal(true);
        setPokeDetail(result);
      }}>
          <h2 className="text-l rounded p-4 bg-amber-100 w-full text-red-600 font-bold capitalize text-center">{result.name}</h2>
          <img 
            src={img} 
            alt={result.name} 
            className="w-48 mx-auto transition-all duration-300"
          />
          <p className="text-center">Type: {result.types.map(type => type.type.name).join(', ')}</p>
      </Card>
    );
  };
 
  const ModalPokemon = ({pokeDetail}) => {
      return (
         <Modal show={modal} onClose={() => setModal(false)} size="3xl" popup>
            <Modal.Header/>
            <Modal.Body className="grid grid-cols-1 place-items-center gap-8">
              <h1 className="text-3xl font-bold uppercase font-pressStart">{pokeDetail.name}</h1>
              <img src={pokeDetail.sprites.other.dream_world.front_default} alt="poke" className='w-60' /> 
 
              <div className="w-full">
                <h2 className="text-xl font-bold mb-2">Type</h2>
                <p className="capitalize">{pokeDetail.types.map(type => type.type.name).join(', ')}</p>
              </div>
 
              <div className="w-full">
                <h2 className="text-xl font-bold mb-2">HP : {pokeDetail.stats[0].base_stat}</h2>
                <Progress progress={pokeDetail.stats[0].base_stat - 20} color="green" label={`${pokeDetail.stats[0].base_stat}/100`} />
              </div>
 
              <div className="w-full">
                <h2 className="text-xl font-bold mb-2">Stats</h2>
                {pokeDetail.stats.slice(1).map((stat, index) => (
                  <div key={index} className="mb-2">
                    <p className="capitalize">{stat.stat.name}: {stat.base_stat}</p>
                    <Progress progress={stat.base_stat - 20} color="blue" />
                  </div>
                ))}
              </div>
 
              <div className="w-full">
                <h2 className="text-xl font-bold mb-2">Abilities</h2>
                <ul className="list-disc list-inside">
                  {pokeDetail.abilities.map((ability, index) => (
                    <li key={index} className="capitalize">{ability.ability.name}</li>
                  ))}
                </ul>
              </div>
            </Modal.Body>
          </Modal>
      )
 
  } 
 
 
  
  if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;
 
  return (
 
    <div className="bg-pink-100 min-h-screen py-8 font-roboto">
      
      <h1 className="sm:text-3xl text-2xl font-bold text-center mb-10 font-pressStart">MON MON POKEMON WS KEDEKEP MON</h1>
      <div className="container w-10/12 mx-auto px-4">
      {
        loading && (
        <div className="flex bg-gray-100/25 w-screen flex-col justify-center items-center h-screen">
            <img className='w-40' src={Load} alt="" />
            <div className='font-pressStart'>Loading...</div>  
        </div>
        )
      }
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">
          {pokemon.map((result) => (
            <PokemonCard key={result.id} result={result}/> 
          ))}
        </div>  
        <div className='flex py-5 justify-between font-pressStart'>
          <div><Button color="light" className='border-4' onClick={prevPage}>Prev</Button></div>
          <div><Button color="light" className='border-4' onClick={nextPage}>Next</Button></div>
        </div>
      </div>
      <style jsx global>
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto:wght@400;700&display=swap');
      </style>
      {
        modal && (
         <ModalPokemon pokeDetail={pokeDetail}/> 
        )
      }
 
    </div>
 
  )
}
 
export default Pokemon