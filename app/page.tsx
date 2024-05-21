'use client'

import React from 'react';
import Game from "./Game"
import TestGame from './TestGame';
import PlayerIdent from './PlayerIdent';

const handleResetGame = () => {
    window.localStorage.clear();
    window.location.reload();
}

function App() {
    return (
        <div style={{ display: 'flex', height: '100vh', justifyContent:'space-between', flexDirection: 'column'}}>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <main style={{flexGrow: 1}}>
                <Game />
            </main>
            <footer style={{ padding: '20px'}}>
                <button style={{backgroundColor: 'pink', color:'white'}}onClick={handleResetGame}>新開一場</button>
            </footer>
        </div>
        
    )
}

export default App