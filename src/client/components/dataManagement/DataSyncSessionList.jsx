import React from 'react';
import { Table, TableBody, TableRow, TableCell,Fab, Tooltip, CircularProgress, IconButton } from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import CheckIcon from '@material-ui/icons/Check';
import GetAppIcon from '@material-ui/icons/GetApp';
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

const DataSyncSessionList = ({ sessions, selectedSessionId, showSessionLogs, closeSessionLogs }) => {
    return (
        <div>
            <Table>
                <TableBody>
                    {sessions.map(session => {
                        const classes = { };
                        const isSelected = selectedSessionId === session.sessionID;

                        if (isSelected) {
                            classes.root = 'selected';
                        }

                        return (
                            <SyncTableRow key={session.sessionID} classes={classes}>
                                <SyncTableCell align="left">
                                    {renderSessionStatus(session.status)}
                                </SyncTableCell>
                                <SyncTableCell>
                                    {new Date(session.startedUTC).toLocaleString()}
                                </SyncTableCell>
                                <SyncTableCell align="right">
                                    <Tooltip title="Download data set" aria-label="download-data">
                                        <IconButton
                                            color={isSelected ? "default" : "primary"}
                                            size="small" 
                                            href={`/archives/${session.sessionID}`}
                                            target="__blank">
                                            <GetAppIcon />
                                        </IconButton>
                                    </Tooltip>
                                </SyncTableCell>
                                <SyncTableCell align="right">
                                    <Tooltip title="Show logs..." aria-label="show-logs">
                                        <Fab
                                            color={isSelected ? "default" : "primary"}
                                            size="small" 
                                            onClick={() => isSelected ? closeSessionLogs() : showSessionLogs(session)}>
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

export default DataSyncSessionList;