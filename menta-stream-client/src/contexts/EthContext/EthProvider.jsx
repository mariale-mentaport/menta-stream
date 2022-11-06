import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

const CONTRACT_NAME = process.env.REACT_APP_CONTRACT_NAME;
const PROVIDER_URL_HTTP = process.env.REACT_APP_PROVIDER_URL_HTTP;
const PROVIDER_URL_WS = process.env.REACT_APP_PROVIDER_URL_WS;
console.log(CONTRACT_NAME)
function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifact => {
      if (artifact) {
       
        try {
          
          //const provider = new Web3.providers.HttpProvider(PROVIDER_URL);
         // const web3 = new Web3(provider);
          const web3 = new Web3(Web3.givenProvider || PROVIDER_URL_HTTP);
          const accounts = await web3.eth.requestAccounts();
          const networkID = await web3.eth.net.getId();
          console.log("accounts", accounts)
          const { abi } = artifact;
          let address, contract;

          //console.log("networkID", networkID)
          address = artifact.networks[networkID].address;
          console.log(address)
          contract = new web3.eth.Contract(abi, address);

          dispatch({
            type: actions.init,
            data: { artifact, web3, accounts, networkID, contract }
          });

        } catch (err) {
          console.error(err);
        }
       
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require(`../../contracts/${CONTRACT_NAME}.json`);
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };
    console.log(events, window)
    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
