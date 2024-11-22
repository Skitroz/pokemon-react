'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { FaSpinner } from 'react-icons/fa';

type Card = {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  level?: string;
  hp?: string;
  types?: string[];
  evolvesTo?: string[];
  attacks?: {
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }[];
  weaknesses?: {
    type: string;
    value: string;
  }[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set?: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    legalities: {
      unlimited: string;
    };
    ptcgoCode: string;
    releaseDate: string;
    updatedAt: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number?: string;
  artist?: string;
  rarity?: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities?: {
    unlimited: string;
  };
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices?: {
      averageSellPrice?: number;
      lowPrice?: number;
      trendPrice?: number;
    };
  };
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [error, setError] = useState<string | null>(null);
  const text: number = "Ca devrait générer une erreur du coup";

  const pageSize = 10;

  const searchPokemon = async (page = 1) => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=name:${searchTerm}&pageSize=${pageSize}&page=${page}`
      );
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche.');
      }
      const data = await response.json();
      setCards(data.data);
      setTotalCount(data.totalCount);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erreur lors de la recherche : ', error);
      setError((error as Error).message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      searchPokemon(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      searchPokemon(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recherche de Cartes Pokémon</h1>
      <span>{text}</span>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Entrez le nom d'un Pokémon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={() => searchPokemon(1)} disabled={isSearching}>
          {isSearching ? <FaSpinner className="animate-spin" /> : 'Rechercher'}
        </Button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isSearching && (
        <div className="flex justify-center my-4">
          <FaSpinner className="text-4xl animate-spin" />
        </div>
      )}
      {!isSearching && cards.length > 0 && (
        <>
          <div className="mb-4">
            <span className="text-gray-700">
              Total de résultats : {totalCount}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="relative perspective"
                onClick={() => handleCardClick(card)}
              >
                <div className="relative w-full h-[400px] transform-style-3d transition-transform duration-700 hover:rotate-y-180 cursor-pointer">
                  {/* Face avant */}
                  <div className="face-front">
                    <img
                      src={card.images.large}
                      alt={card.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  {/* Face arrière */}
                  <div className="face-back bg-gray-800 text-white p-4 rounded-lg overflow-y-auto">
                    <h2 className="text-lg font-bold mb-2">{card.name}</h2>
                    <h3 className="text-md font-semibold">Attaques :</h3>
                    <ul className="list-disc list-inside">
                      {card.attacks ? (
                        card.attacks.map((attack, index) => (
                          <li key={index}>
                            <strong>{attack.name}</strong> : {attack.text} (
                            {attack.damage
                              ? `${attack.damage} dmg`
                              : 'No damage'}
                            )
                          </li>
                        ))
                      ) : (
                        <li>Aucune attaque disponible.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isSearching}
            >
              Précédent
            </Button>
            <span>
              {currentPage} sur {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isSearching}
            >
              Suivant
            </Button>
          </div>
        </>
      )}
      {selectedCard && (
        <Modal onClose={closeModal}>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold mb-2">{selectedCard.name}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <img
              src={selectedCard.images.large}
              alt={selectedCard.name}
              className="w-full h-auto mb-4 rounded-lg"
            />
            {selectedCard.flavorText && (
              <p className="italic mb-4">{selectedCard.flavorText}</p>
            )}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Détails :</h3>
              <ul className="list-disc list-inside">
                {selectedCard.hp && (
                  <li>
                    <strong>HP:</strong> {selectedCard.hp}
                  </li>
                )}
                {selectedCard.types && (
                  <li>
                    <strong>Types:</strong> {selectedCard.types.join(', ')}
                  </li>
                )}
                {selectedCard.supertype && (
                  <li>
                    <strong>Supertype:</strong> {selectedCard.supertype}
                  </li>
                )}
                {selectedCard.subtypes && (
                  <li>
                    <strong>Subtypes:</strong>{' '}
                    {selectedCard.subtypes.join(', ')}
                  </li>
                )}
                {selectedCard.level && (
                  <li>
                    <strong>Niveau:</strong> {selectedCard.level}
                  </li>
                )}
                {selectedCard.weaknesses && (
                  <li>
                    <strong>Faiblesses:</strong>{' '}
                    {selectedCard.weaknesses
                      .map((w) => `${w.type} (${w.value})`)
                      .join(', ')}
                  </li>
                )}
                {selectedCard.retreatCost && (
                  <li>
                    <strong>Coût de retraite:</strong>{' '}
                    {selectedCard.retreatCost.join(', ')} (
                    {selectedCard.convertedRetreatCost})
                  </li>
                )}
                {selectedCard.evolvesTo && (
                  <li>
                    <strong>Évolue en:</strong>{' '}
                    {selectedCard.evolvesTo.join(', ')}
                  </li>
                )}
                {selectedCard.set && (
                  <li>
                    <strong>Set:</strong> {selectedCard.set.name} (
                    {selectedCard.set.releaseDate})
                  </li>
                )}
                {selectedCard.rarity && (
                  <li>
                    <strong>Rareté:</strong> {selectedCard.rarity}
                  </li>
                )}
                {selectedCard.artist && (
                  <li>
                    <strong>Artiste:</strong> {selectedCard.artist}
                  </li>
                )}
              </ul>
            </div>
            {selectedCard.attacks && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Attaques :</h3>
                <ul className="list-disc list-inside">
                  {selectedCard.attacks.map((attack, index) => (
                    <li key={index} className="mb-2">
                      <strong>{attack.name}</strong> ({attack.cost.join(', ')} -{' '}
                      {attack.convertedEnergyCost} CC) : {attack.text}{' '}
                      {attack.damage && `(${attack.damage} dmg)`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedCard.set && selectedCard.set.images && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Set:</h3>
                <img
                  src={selectedCard.set.images.logo}
                  alt={`${selectedCard.set.name} logo`}
                  className="w-32 h-auto"
                />
              </div>
            )}
            {selectedCard.cardmarket && selectedCard.cardmarket.prices && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Prix Cardmarket :</h3>
                <ul className="list-disc list-inside">
                  {selectedCard.cardmarket.prices.averageSellPrice && (
                    <li>
                      <strong>Prix moyen de vente:</strong> $
                      {selectedCard.cardmarket.prices.averageSellPrice}
                    </li>
                  )}
                  {selectedCard.cardmarket.prices.lowPrice && (
                    <li>
                      <strong>Prix bas:</strong> $
                      {selectedCard.cardmarket.prices.lowPrice}
                    </li>
                  )}
                  {selectedCard.cardmarket.prices.trendPrice && (
                    <li>
                      <strong>Tendance des prix:</strong> $
                      {selectedCard.cardmarket.prices.trendPrice}
                    </li>
                  )}
                </ul>
              </div>
            )}
            <Button onClick={closeModal} className="mt-4">
              Fermer
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
