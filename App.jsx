import React, { useState } from 'react';
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const FEE_WALLET = '6oDVSoREbwfrnk1o1nwq2C9uF1HkVHV78W4s2vEWKmip';

function App() {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState('Not Connected');

  async function connectWallet() {
    if ('solana' in window) {
      const resp = await window.solana.connect();
      setWallet(resp.publicKey.toString());
      setStatus('Connected');
    } else {
      alert('Phantom Wallet not found!');
    }
  }

  async function sendFee() {
    if (!wallet) return alert('Connect wallet first.');
    const provider = window.solana;
    const transaction = new window.solanaWeb3.Transaction().add(
      window.solanaWeb3.SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet),
        toPubkey: new PublicKey(FEE_WALLET),
        lamports: 0.002 * LAMPORTS_PER_SOL,
      })
    );
    transaction.feePayer = provider.publicKey;
    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhashObj.blockhash;
    let signed = await provider.signTransaction(transaction);
    let signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);
    alert('Fee sent: 0.002 SOL');
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>AgriPump</h1>
      <p>Status: {status}</p>
      {!wallet && <button onClick={connectWallet}>Connect Wallet</button>}
      {wallet && <button onClick={sendFee}>Send 0.002 SOL Fee</button>}
    </div>
  );
}

export default App;
