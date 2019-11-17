import React from 'react';
import socketIoClient from 'socket.io-client';
import { Typography, Button, Box, Table, TableBody, TableRow, TableCell, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import SyncDataService from '../../services/SyncDataService';
import NotificationType from '../../../constants/NotificationType';

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
    },
}))(TableRow);

class DataManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isSyncRunning: false,
            socketEndpoint: {
                response: false,
                endpoint: "http://127.0.0.1:3000"
            }
        };
        this._socket = null;

        this.syncData = this.syncData.bind(this);
    }

    async syncData() {
        try {
            await SyncDataService.syncDataFromErp();
        }
        catch (error) {
            console.error(error);
        }
    }

    async componentDidMount() {
        try {
            const syncState = await SyncDataService.getSyncDataState();
            const endpoint = {
                response: false,
                endpoint: syncState.notificationsEndpoint
            }
            
            this._socket = socketIoClient(endpoint);
            this._socket.on(NotificationType.SYNC_DATA_STARTED, () => {
                this.setState({
                    isSyncRunning: true
                });
                console.log('Sync started');
            });
            this._socket.on(NotificationType.SYNC_DATA_COMPLETE, () => {
                this.setState({
                    isSyncRunning: false
                });
                console.log('Sync complete');
            });
            this.setState({
                isLoading: false,
                isSyncRunning: syncState.isSyncRunning
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    componentWillUnmount() {
        this._socket.disconnect();
    }

    render() {
        return (
            <div>
                <Box p={4}>
                    <Typography variant="h1">
                        Data Management
                    </Typography>
                </Box>
                
                <Box p={4}>
                    <Box mb={4} display="flex" flexDirection="row" alignItems="center">
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={this.state.isLoading || this.state.isSyncRunning}
                            onClick={this.syncData}>
                            
                            Sync
                        </Button>

                        {this.state.isSyncRunning ? (
                            <Box ml={2}>
                                <CircularProgress size="1rem" color="secondary" thickness={5} />
                            </Box>) : null}
                    </Box>

                    <Typography variant="h2" paragraph>
                        Sync Activities
                    </Typography>

                    <Table>
                        <TableBody>
                            <SyncTableRow>
                                <SyncTableCell>
                                    1
                                </SyncTableCell>
                                <SyncTableCell>
                                    2
                                </SyncTableCell>
                                <SyncTableCell>
                                    3
                                </SyncTableCell>
                            </SyncTableRow>
                        </TableBody>
                    </Table>
                </Box>
            </div>
        );
    }
}

export default DataManagementPage;