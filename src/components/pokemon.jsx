import { useState, useEffect } from 'react'
import { Card, Button, Modal } from 'flowbite-react';

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
        setLoading(false)
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
      <Card key={result.id} className="w-full max-w-sm border-4 border-purple-300" onClick={()=>{
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

  


  if (loading) return( 
  <div className="flex bg-white flex-col justify-center items-center h-screen">
    <img className='w-40' src="https://64.media.tumblr.com/f94d1715779ac36beb437479b1803c9c/1aac43197a01d1aa-2f/s1280x1920/5f569f71938b6474c4213c500f96ae8538d39bdc.gifv" alt="" />
   <div className='font-pressStart'>Loading...</div>  
  </div>
  )
  if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;

  return (

    <div className="bg-pink-100 min-h-screen py-8 font-roboto">
      <h1 className="sm:text-3xl text-2xl font-bold text-center mb-10 font-pressStart">MON MON POKEMON WS KEDEKEP MON</h1>
      <div className="container w-10/12 mx-auto px-4">
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
          <Modal show={modal} onClose={() => setModal(false)} popup>
            <Modal.Header/>
            <Modal.Body className="flex flex-col gap-8 justify-center items-center ">
              <h1 className="text-3xl font-bold uppercase font-pressStart">{pokeDetail.name}</h1>
              <img src={pokeDetail.sprites.other.dream_world.front_default} alt="poke" className='w-60' /> 
              {console.log(pokeDetail)}
              <div>

              </div>
            </Modal.Body>
          </Modal>
         
        )
      }
      
    </div>

  )
}

export default Pokemon 