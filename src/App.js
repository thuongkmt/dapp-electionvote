import './App.css';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { ethers } from 'ethers'
import ElectionVote from './artifacts/contracts/ElectionVote.sol/ElectionVote.json'

const ElectionVoteAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788"

function App() {
  const [candidateName, setCandidateName] = useState()
  const [candidateId, setCandidateId] = useState()

  /**
   * Common area
   */

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
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
        console.log('HighestVote: ', parseInt(highestVote, 16))
        document.getElementById('highest-vote').innerHTML = "";
        document.getElementById('highest-vote').innerHTML = parseInt(highestVote, 16);
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
        var number = parseInt(numberOfCandidate, 16);
        console.log('numberOfCandidate: ', number)
      } 
      catch (err) {
          console.log("numberOfCandidate - Error: ", err)
      }
    }    
  }

  async function getCandidator(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(ElectionVoteAddress, ElectionVote.abi, provider)
      try {
        const listCandidator = await contract.getCandidator()

        var _listCandidate = new Array();
        for(var i=0; i < listCandidator.length; i++){
          var candidate = listCandidator[i];
          console.log("candidate", parseInt(candidate.id._hex, 16));
          console.log("candidate", candidate.name);
          console.log("candidate", parseInt(candidate.voteCount._hex, 16));
          _listCandidate.push({
                id: parseInt(candidate.id._hex, 16),
                name: candidate.name,
                voteCount: parseInt(candidate.voteCount._hex, 16)
            });
        }
        console.log("_list", JSON.stringify(_listCandidate));
        var element = "";
        for(var i=0; i<_listCandidate.length; i++){
          element += '<tr><th scope="row">' + (i+1) 
          +'</th><td>' + _listCandidate[i].id + '</td><td>' + _listCandidate[i].name + '</td><td>' + _listCandidate[i].voteCount + '</td></tr>'
        }
        console.log("element", element);
        document.getElementById('bindcandidate').innerHTML = element;
        //ReactDOM.render(element, document.getElementById('bindcandidate'));
      } 
      catch (err) {
          console.log("listCandidator - Error: ", err)
      }
    }    
  }

  async function setCandidator() {
    if (!candidateName) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ElectionVoteAddress, ElectionVote.abi, signer)
      const transaction = await contract.setCandidator(candidateName)
      await transaction.wait()
      getCandidator()
    }
  }

  async function voteCandidator() {
    if (!candidateId) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ElectionVoteAddress, ElectionVote.abi, signer)
      const transaction = await contract.voteCandidator(candidateId)
      await transaction.wait()
      getCandidator()
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
        <div className='row'>
          <div className="header">
            <h1>ELECTION VOTE</h1>
            <p>Welcome to the election vote using blockchain technology</p>
          </div>
        </div>

        <div className="row content">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">VoteCount</th>
              </tr>
            </thead>
            <tbody id="bindcandidate">
            
            </tbody>
          </table>

          <div className="col">
            <button type="button" className="btn btn-default" onClick={numberOfCandidate}>Number of candidate</button>
            <button type="button" className="btn btn-default" onClick={getHighestVote}>Highest vote (<span id="highest-vote">0</span>)</button>
            <button type="button" className="btn btn-default" onClick={getCandidator}>Reload</button>
          </div>

          <div className="card">
            <div className="card-body">
              <div className='row'>
                <div className='col'>
                  <input className="form-control form-control-lg" onChange={e => setCandidateName(e.target.value)} type="text" placeholder="Add candidate" aria-label=".form-control-lg example" />
                </div>
                <div className='col'>
                  <button type="button" className="btn btn-primary" onClick={setCandidator}>Add candidate</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className='row'>
                <div className='col'>
                  <input className="form-control form-control-lg" onChange={e => setCandidateId(e.target.value)} type="text" placeholder="Vote by id" aria-label=".form-control-lg example" />
                </div>
                <div className='col'>
                  <button type="button" className="btn btn-primary" onClick={voteCandidator}>Vote</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
