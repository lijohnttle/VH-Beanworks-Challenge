import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import { blueGrey, teal } from '@material-ui/core/colors';

let defaultTheme = createMuiTheme({
    palette: {
        primary: blueGrey,
        secondary: teal,
        background: {
            default: '#ffffff',
            paper: '#ffffff'
        }
    },
    typography: {
        h1: {
            fontSize: '3rem'
        },
        h2: {
            fontSize: '2.2rem'
        },
        h3: {
            fontSize: '1.6rem'
        },
        h4: {
            fontSize: '1.4rem'
        },
        h5: {
            fontSize: '1.2rem'
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 'bold'
        }
    }
});

defaultTheme = responsiveFontSizes(defaultTheme);

export { defaultTheme };