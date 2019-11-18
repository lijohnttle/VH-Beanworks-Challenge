import React from 'react';
import { Typography, Box, Paper, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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

const DataSyncSessionLog = ({ syncLog, close }) => {
    return (
        <div>
            <Box ml={4}>
                <Paper>
                    <Box p={4}>
                        <Box p={4} display="flex" flexDirection="row" justifyContent="space-between">
                            <Typography variant="h3">
                                Sync Logs
                            </Typography>

                            <IconButton size="small" onClick={close}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        
                        <ul>
                            {syncLog.map((record, i) => (
                                <div key={i}>
                                    {`${new Date(record.timestamp).toLocaleString()}: ${getMessageText(record)}`}
                                </div>
                            ))}
                        </ul>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
}

export default DataSyncSessionLog;