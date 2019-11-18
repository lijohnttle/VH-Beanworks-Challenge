import React from 'react';
import { Typography, Box } from '@material-ui/core';

function getMessageText(record) {
    if (record.item === 'Account') {
        if (record.state === 'START') {
            return 'Starting import of accounts'
        }
        else if (record.state === 'END') {
            return 'Finished import of accounts'
        }
    }
    else if (record.item === 'Vendor') {
        if (record.state === 'START') {
            return 'Starting import of vendors'
        }
        else if (record.state === 'END') {
            return 'Finished import of vendors'
        }
    }

    return '';
}

const SyncDataSessionLog = ({ syncLog }) => {
    return (
        <div>
            <Box p={4} display="flex" flexDirection="row" justifyContent="space-between">
                <Typography variant="h3">
                    Sync Logs
                </Typography>
            </Box>
            
            <ul>
                {syncLog.map((record, i) => (
                    <div key={i}>
                        {`${new Date(record.timestamp).toLocaleString()}: ${getMessageText(record)}`}
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default SyncDataSessionLog;