// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <this.props.FallbackComponent error={error}/>;
    }
    return this.props.children; 
  }
}

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const idle = 'idle';
  const pending = 'pending';
  const resolved = 'resolved';
  const rejected = 'rejected';

  const [state, setState] = React.useState({status: idle, pokemon: null, error: {}});
  const { status, error, pokemon } = state;

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setState({status: pending});
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({pokemon, status: resolved});
      },
      error => {
        setState({error, status: rejected});
      },
    );
  }, [pokemonName]);

  switch (status) {
    case rejected: {
      throw error;
    }
    case idle: {
      return 'Submit a pokemon';
    }
    case pending: {
      return <PokemonInfoFallback name={pokemonName} />;
    }
    case resolved: {
      return <PokemonDataView pokemon={pokemon} />;
    }
    default: {
      throw new Error('Impossible State!');
    }
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
