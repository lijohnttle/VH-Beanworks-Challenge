import React from 'react';
import { Table, TableBody, TableRow, TableCell,Fab, Tooltip, CircularProgress, IconButton, Menu, MenuItem, Link } from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import CheckIcon from '@material-ui/icons/Check';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/styles';
import DataSyncSessionStatus from '../../../models/DataSyncSessionStatus';
import DataSyncItem from '../../../services/dataSync/DataSyncItem';

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
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleShowMenuClick = event => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Table>
                <TableBody>
                    {sessions.map(session => {
                        const classes = { };
                        const isSelected = selectedSessionId === session.sessionID;
                        let showLogsText = "Show logs";

                        if (isSelected) {
                            classes.root = 'selected';
                            let showLogsText = "Hide logs";
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
                                    <IconButton
                                        aria-label="more"
                                        aria-controls="long-menu"
                                        aria-haspopup="true"
                                        onClick={handleShowMenuClick}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}>
                                        <Link href={`/archives/${session.sessionID}/${DataSyncItem.ACCOUNT}`} target="_blank">
                                            <MenuItem>
                                                Accounts
                                            </MenuItem>
                                        </Link>
                                        <Link href={`/archives/${session.sessionID}/${DataSyncItem.VENDOR}`} target="_blank">
                                            <MenuItem>
                                                Vendors
                                            </MenuItem>
                                        </Link>
                                    </Menu>
                                </SyncTableCell>
                                <SyncTableCell align="right">
                                    <Tooltip title={showLogsText} aria-label="show-logs">
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