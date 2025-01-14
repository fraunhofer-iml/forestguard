#!/bin/bash

# Array of directories to navigate to
directories=(
    "apps/api"
    "apps/api-e2e"
    "apps/entity-management-svc"
    "apps/frontend"
    "apps/frontend-e2e"
    "apps/process-svc"
    "libs/amqp"
    "libs/api-interfaces"
    "libs/blockchain-connector"
    "libs/configuration"
    "libs/database"
    "libs/file-storage"
    "libs/ubiriki-import"
    "libs/ui-graph"
    "libs/util"
    "libs/utm-wgs"
)

# Log file
log_file="run-eslint-fix.log"

# Clear the log file
>"$log_file"

echo "[INFO] ESLint fix started." | tee -a "$log_file"

# Loop through each directory and run eslint
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "[INFO] Running eslint in $dir" | tee -a "$log_file"
        (cd "$dir" && npx eslint --fix './**/*.ts' 2>&1 | tee -a "$log_file")
        if [ $? -ne 0 ]; then
            echo "[ERROR] ESLint failed in $dir" | tee -a "$log_file"
        else
            echo "[INFO] ESLint completed successfully in $dir" | tee -a "$log_file"
        fi
    else
        echo "[ERROR] Directory $dir does not exist. Skipping..." | tee -a "$log_file"
    fi
done

echo "[INFO] ESLint fix completed in all specified directories." | tee -a "$log_file"
