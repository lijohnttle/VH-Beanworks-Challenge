import React from 'react';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { defaultTheme } from './themes';
import Header from './components/Header';
import DataManagementPage from './components/dataManagement/DataManagementPage';

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider theme={defaultTheme}>
                <CssBaseline />

                <Header />

                <DataManagementPage />
            </MuiThemeProvider>
        );
    }
}

export default App;