import React from 'react';
import { Table, TableBody, TableRow, TableCell,Fab, Tooltip, CircularProgress } from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import CheckIcon from '@material-ui/icons/Check';
import CachedIcon from '@material-ui/icons/Cached';
import { withStyles } from '@material-ui/styles';
import DataSyncSessionStatus from '../../../models/DataSyncSessionStatus';

const SyncTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.gainsboro,
    }
}))(TableCell);

const SyncTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
        "&.selected": {
            backgroundColor: 'gainsboro'
        }
    }
}))(TableRow);

const renderSessionStatus = (status) => {
    if (status === DataSyncSessionStatus.COMPLETE) {
        return <CheckIcon color="primary" />;
    }

    if (status === DataSyncSessionStatus.ACTIVE) {
        return <CircularProgress color="primary" size="1.3em" />
    }

    return status;
};

const SyncDataSessionList = ({ sessions, selectedSessionId, showSessionLogs }) => {
    return (
        <div>
            <Table>
                <TableBody>
                    {sessions.map(session => {
                        const classes = { };

                        if (selectedSessionId === session.sessionID) {
                            classes.root = 'selected';
                        }

                        return (
                            <SyncTableRow key={session.sessionID} classes={classes}>
                                <SyncTableCell>
                                    {renderSessionStatus(session.status)}
                                </SyncTableCell>
                                <SyncTableCell>
                                    {new Date(session.startedUTC).toLocaleString()}
                                </SyncTableCell>
                                <SyncTableCell>
                                    <Tooltip title="Show logs..." aria-label="show-logs">
                                        <Fab color="primary" size="small" onClick={() => showSessionLogs(session)}>
                                            <ListAltIcon />
                                        </Fab>
                                    </Tooltip>
                                </SyncTableCell>
                            </SyncTableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default SyncDataSessionList;