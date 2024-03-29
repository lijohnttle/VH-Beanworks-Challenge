import React from 'react';
import socketIoClient from 'socket.io-client';
import { Typography, Button, Box, CircularProgress } from '@material-ui/core';
import DataSyncService from '../../services/DataSyncService';
import NotificationType from '../../../notifications/NotificationType';
import DataSyncSessionList from './DataSyncSessionList';
import DataSyncSessionLog from './DataSyncSessionLog';

class DataManagementPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isSyncRunning: false,
            updatesEndpoint: null,
            sessions: [],
            selectedSessionId: null,
            selectedSessionLogs: []
        };
        this._socket = null;

        this.syncData = this.syncData.bind(this);
        this.showSessionLogs = this.showSessionLogs.bind(this);
        this.closeSessionLogs = this.closeSessionLogs.bind(this);
    }

    async syncData() {
        try {
            await DataSyncService.syncDataFromErp();
        }
        catch (error) {
            console.error(error);
        }
    }

    showSessionLogs(session) {
        if (session) {
            this.setState({
                selectedSessionId: session.sessionID,
                selectedSessionLogs: session.syncLog.slice().sort((a, b) => b.timestamp - a.timestamp)
            });
        }
        else {
            this.setState({
                selectedSessionId: null,
                selectedSessionLogs: []
            });
        }
    }

    closeSessionLogs() {
        this.setState({
            selectedSessionId: null,
            selectedSessionLogs: []
        });
    }

    updateSyncDataSession(session, sessions) {
        const existing = sessions.find(s => s.sessionID === session.sessionID);

        if (existing) {
            sessions[sessions.indexOf(existing)] = session;
        }
        else {
            sessions.unshift(session);
        }
    }

    async componentDidMount() {
        try {
            const syncState = await DataSyncService.getDataSyncState();
            const endpoint = {
                response: false,
                endpoint: syncState.notificationsEndpoint
            }

            this.setState({
                updatesEndpoint: endpoint
            });
            
            this._socket = socketIoClient(endpoint);
            this._socket.on(NotificationType.SYNC_DATA_STARTED, () => {
                this.setState({
                    isSyncRunning: true
                });
            });
            this._socket.on(NotificationType.SYNC_DATA_UPDATE, session => {
                this.setState(state => {
                    const sessions = state.sessions.slice();
                    
                    this.updateSyncDataSession(session, sessions);

                    let syncLog = state.selectedSessionLogs;

                    if (state.selectedSessionId === session.sessionID) {
                        syncLog = session.syncLog.slice().sort((a, b) => b.timestamp - a.timestamp);
                    }

                    return {
                        isSyncRunning: true,
                        sessions: sessions,
                        selectedSessionLogs: syncLog
                    };
                });
            });
            this._socket.on(NotificationType.SYNC_DATA_COMPLETE, session => {
                this.setState(state => {
                    const sessions = state.sessions.slice();

                    this.updateSyncDataSession(session, sessions);

                    let syncLog = state.selectedSessionLogs;

                    if (state.selectedSessionId === session.sessionID) {
                        syncLog = session.syncLog.slice().sort((a, b) => b.timestamp - a.timestamp);
                    }

                    return {
                        isSyncRunning: false,
                        sessions: sessions,
                        selectedSessionLogs: syncLog
                    };
                });
            });

            this.setState({
                isLoading: false,
                isSyncRunning: syncState.isSyncRunning,
                sessions: syncState.sessions
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    componentWillUnmount() {
        if (this._socket) {
            this._socket.disconnect();
            this._socket = null;
        }
    }

    render() {
        return (
            <div>
                <Box p={4} borderColor="grey.400" border={1} borderLeft={0} borderRight={0} borderTop={0}>
                    <Typography variant="h1">
                        Data Management
                    </Typography>
                </Box>
                
                <Box display="flex" flexDirection="row">
                    <Box p={4} flex={1}>
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

                        <DataSyncSessionList
                            sessions={this.state.sessions}
                            selectedSessionId={this.state.selectedSessionId}
                            showSessionLogs={this.showSessionLogs}
                            closeSessionLogs={this.closeSessionLogs} />
                    </Box>

                    {this.state.selectedSessionId ? (
                        <Box flex={1} ml={4} border={1} borderLeft={1} borderBottom={0} borderRight={0} borderTop={0} borderColor="grey.400">
                            <DataSyncSessionLog syncLog={this.state.selectedSessionLogs} close={this.closeSessionLogs} />
                        </Box>
                    ) : null}
                </Box>
            </div>
        );
    }
}

export default DataManagementPage;