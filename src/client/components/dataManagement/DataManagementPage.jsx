import React from 'react';
import { Typography, Button, Box, Table, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

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
    render() {
        return (
            <div>
                <Box p={4}>
                    <Typography variant="h1">
                        Data Management
                    </Typography>
                </Box>
                
                <Box p={4}>
                    <Box mb={4}>
                        <Button variant="contained" color="primary">
                            Sync
                        </Button>
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