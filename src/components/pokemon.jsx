import { useState, useEffect } from 'react'
import { Card } from 'flowbite-react';

const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const url = 'https://pokeapi.co/api/v2/pokemon?limit=21';
        const response = await fetch(url);
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
  }, []);


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
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {pokemon.map((result) => (
            <Card key={result.id} className="w-full max-w-sm border-4 border-purple-300">
              <div className="p-4">
                <h2 className="text-xl rounded p-4 bg-amber-100 w-full text-red-600 font-bold capitalize text-center">{result.name}</h2>
                  <img src={result.sprites.front_default} alt={result.name} className="w-48 mx-auto" />
                <p className="text-center">Type: {result.types.map(type => type.type.name).join(', ')}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <style jsx global>
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto:wght@400;700&display=swap');
      </style>
    </div>

  )
}

export default Pokemon 