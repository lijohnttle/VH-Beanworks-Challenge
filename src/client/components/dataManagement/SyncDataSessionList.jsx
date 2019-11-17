import React from 'react';
import { Table, TableBody, TableRow, TableCell,Fab, Tooltip } from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { withStyles, makeStyles } from '@material-ui/styles';

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

const SyncDataSessionList = ({ sessions, selectedSessionId, showSessionLogs }) => {
    return (
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
                                {session.status}
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
    );
}

export default SyncDataSessionList;