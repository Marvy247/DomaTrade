#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Start the price updater in the background
node --loader ts-node/esm ./keeper/priceUpdater.ts &

# Start the liquidator in the background
node --loader ts-node/esm ./keeper/liquidator.ts &

# Wait for all background processes to finish
wait
