import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import ElectionVote from './artifacts/contracts/ElectionVote.sol/ElectionVote.json'

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const ElectionVoteAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

function App() {
  const [greeting, setGreetingValue] = useState()

  /**
   * Common area
   */

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  /**
   * Greeter area
   */

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  /**
   * ElectionVote area
   */
   async function getHighestVote() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(ElectionVoteAddress, ElectionVote.abi, provider)

      try {
        const highestVote = await contract.getHighestVote()
        console.log('HighestVote: ', highestVote)
      } 
      catch (err) {
          console.log("HighestVote - Error: ", err)
      }
    }    
  }

  async function numberOfCandidate() {

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(ElectionVoteAddress, ElectionVote.abi, provider)
      try {
        const numberOfCandidate = await contract.numberOfCandidate()
        console.log('numberOfCandidate: ', numberOfCandidate)
      } 
      catch (err) {
          console.log("numberOfCandidate - Error: ", err)
      }
    }    
  }

  async function initElectionVoteContract(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(ElectionVoteAddress, ElectionVote.abi, provider)

      return contract
    }
  }


  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col">
            <button type="button" className="btn btn-primary" onClick={fetchGreeting}>Fetch Greeting</button>
            <button type='button' className='btn btn-secondary' onClick={setGreeting}>Set Greeting</button>
            <div className="mb-3">
              <label htmlFor="greetingWord" className="form-label">Greeting</label>
              <input className="form-control" id="greetingWord"  onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
            </div>
          </div>
          <div className="col">
            Election vote App
            <div>
            <button type="button" className="btn btn-primary" onClick={numberOfCandidate}>Number of candidate</button>
            <button type="button" className="btn btn-primary" onClick={getHighestVote}>Highest vote</button>
            </div>
          </div>
          <div className="col">
            Column
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
