import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';


const Header = () => {
    return (
        <AppBar position="relative">
            <Toolbar variant="dense">
                <Button color="inherit" href="/">
                    <Typography variant="h6">
                        BEANWORKS
                    </Typography>
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;