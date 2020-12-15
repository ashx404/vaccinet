This project aims at building a simple smart contract for a vaccine supply chain.
Parameters can be tweaked and extra parameters can be added in the chaincode.

To start the blockchain network

First move to test-network directory and then run

- ./network.sh up createChannel -c mychannel -ca

This will setup the nodes required to run a simple channel, it contains 2 peers, 1 orderer and 2 CA nodes.

After this we need to initialize the chaincode for the network that has all the essential transactional functions which are to run on the channel

To deploy chaincode on this channel

- ./network.sh deployCC -ccn basic -ccl javascript





