# This script prepares the network to test the upgrade logic for the v16rc5 release.
# It is supposed to be run on a fresh network (i.e. started with `local_node.sh -y`) and
# version v15.0.0 in order to run the series of upgrades necessary to achieve the desired state for testing.

# Exit on first failure
set -e

# Exit if the version of evmosd is not 15.0.0
if [[ $(evmosd version | grep -o -E '[0-9]+\.[0-9]+\.[0-9]+') != "15.0.0" ]]; then
  echo "Please use evmosd v15.0.0"
  exit 1
fi

# Deploy the MyToken contract
echo "Deploying a simple ERC20 token contract"
tokenAddress=$(npx hardhat run scripts/deployMyToken.js --network evmoslocal | grep -o -E '0x[a-fA-F0-9]+') >/dev/null
echo "Deployed token contract at: $tokenAddress"

# Sleep to make sure the next block is produced
sleep 3

# Submit the proposal to register the contract for incentives
echo "Submitting the proposal to register the contract for incentives"
evmosd tx gov submit-legacy-proposal register-incentive $tokenAddress 0.001aevmos 100 \
--deposit 100000000000000000000aevmos \
--title Test \
--description Test \
--fees 100000000000000aevmos \
--from dev0 \
--home ~/.tmp-evmosd \
--gas auto \
--gas-adjustment 1.4 \
-y >/dev/null

# Sleep to make sure the next block is produced
sleep 3

# Send some tokens to the incentives module account
echo "Sending tokens to the incentives module account"
evmosd tx bank send dev0 evmos1krxwf5e308jmclyhfd9u92kp369l083wn67k4q 100000000000000000000aevmos \
--home $HOME/.tmp-evmosd \
--from dev0 \
--fees 200000000000000aevmos \
--gas auto \
-b sync \
-y >/dev/null
