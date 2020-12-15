#! /bin/sh.
echo "STOPPING NETWORK"
./network.sh down

echo "RESTARTING NETWORK"
echo "CREATING CHANNEL"
./network.sh up createChannel -c mychannel -ca

echo "DEPLOYING CHAINCODE"
./network.sh deployCC -ccn basic -ccl javascript

echo "DELETING WALLET"
cd ../utils
rm -rf wallet

echo "ENROLLING ADMIN"
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:5000/enroll

echo "ENROLLING USERS"
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:5000/enrollUser/gupta99piyush
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:5000/enrollUser/agam99
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://localhost:5000/enrollUser/asis
